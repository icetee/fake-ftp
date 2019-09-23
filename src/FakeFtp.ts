/// <reference path="Server/Server.d.ts" />
/// <reference path="./FakeFtpService.d.ts" />

import * as net from 'net';
import * as Server from 'Server';
import { TCPServer } from './Server';
import { SocketClientMessage, CommandRunner } from './Delivery';
import { SocketParse } from './Delivery';
import * as FakeFtpService from 'FakeFtpService';

/**
* Implementation of a Faker FTP Server.
*/
export default class FakeFtp implements FakeFtpService.IFakeFtp {
  config: Server.IServerConfig;
  storage: Server.IServerStorage;

  constructor(config: object, storage: object = {}) {
    this.config = {
      ...this.defaultConfig(),
      ...config,
    };

    this.storage = {
      ...this.defaultStorage(),
      ...storage,
    };

    return this;
  }

  async start(): Promise<net.Server> {
    const server: net.Server = await TCPServer(this.config);

    server.on('connection', (socket: net.Socket) => {
      CommandRunner.setFakeFtp(this);

      if (this.config.welcome) {
        socket.write(CommandRunner.getServerCommand(CommandRunner.Feats.Hello).getMessage());
      }

      if (this.config.autoAuth) {
        socket.write(CommandRunner.getServerCommand(CommandRunner.Feats.User).getMessage());
      }

      socket.on('data', (data: Buffer) => {
        CommandRunner.setFakeFtp(this);

        const clientMessageCollection = (new SocketParse(data)).getCommands();

        clientMessageCollection.forEach((clientMessage: SocketClientMessage) => {
          const serverResponse = CommandRunner.getServerResponse(clientMessage).getMessage();

          if (clientMessage.command === 'quit') {
            return socket.end(serverResponse);
          }

          socket.write(serverResponse);
        });
      });

      socket.on('error', (err: NodeJS.ErrnoException) => {
        console.log(err.code);
      });
    });

    return server;
  }

  defaultConfig(): Server.IServerConfig {
    return {
      host: '127.0.0.1',
      port: 21,
      welcome: true,
      autoAuth: false,
    };
  }

  defaultStorage(): Server.IServerStorage {
    return {
      user: null,
      password: null,
    };
  }
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error);
});
