/// <reference path="Server/Server.d.ts" />

import * as net from 'net';
import * as Server from 'Server';
import { TCPServer } from './Server';
import { SocketClientMessage, CommandRunner } from './Delivery';

/**
* Implementation of a Faker FTP Server.
*/
export default class FakeFtp {
  config: Server.IServerConfig;

  constructor(config: object) {
    this.config = {
      ...this.defaultConfig(),
      ...config,
    };
  }

  async start(): Promise<net.Server> {
    const server: net.Server = await TCPServer(this.config);

    server.on('connection', (socket: net.Socket) => {
      if (this.config.welcome) {
        socket.write(CommandRunner.getServerCommand(CommandRunner.Feats.Hello).getMessage());
      }

      socket.on('data', (data: Buffer) => {
        const clientMessage = new SocketClientMessage(data);
        const serverResponse = CommandRunner.getServerResponse(clientMessage).getMessage();

        if (clientMessage.command) {
          return socket.end(serverResponse);
        }

        socket.write(serverResponse);
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
    };
  }
}
