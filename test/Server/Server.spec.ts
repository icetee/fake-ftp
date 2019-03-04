/// <reference path="../../src/Commands/Commands.d.ts" />

import * as net from 'net';
import { assert } from 'chai';
import FakeFtp from '../../src/FakeFtp';
import { SocketClientMessage, SocketServerMessage, CommandRunner } from '../../src/Delivery';

describe('FakeFtpServer', () => {
  const testConfig = {
    port: 2121,
    host: '127.0.0.1',
  };

  describe('Communication tests', () => {
    it('return receive a sent custom message', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
          welcome: false,
        };

        const FakeFtpTCP: net.Server = await (new FakeFtp(FakeFtpConfig)).start();

        FakeFtpTCP.once('connection', (socket: net.Socket) => {
          socket.write(CommandRunner.getServerResponse(new SocketClientMessage('fake')).getMessage());
        });

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host);

        client.on('data', (data: Buffer | String) => {
          assert.equal(data.toString(), (new SocketServerMessage(220, 'FAKE')).getMessage());

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });

    it('return welcome message after connected server', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host);

        client.on('data', (data: Buffer | String) => {
          assert.equal(data.toString(), CommandRunner.getServerCommand(CommandRunner.Feats.Hello).getMessage());

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });

    it('close server connection after send exit', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host, () => {
          client.write(new SocketClientMessage('quit').getMessage());
        });

        client.on('data', (data: Buffer | String) => {
          if (data.toString() === CommandRunner.getServerCommand(CommandRunner.Feats.Quit).getMessage()) {
            client.destroy();
          }
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });

    it('close server connection after send exit (uppercase)', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host, () => {
          client.write(new SocketClientMessage('QUIT').getMessage());
        });

        client.on('data', (data: Buffer | String) => {
          if (data.toString() === CommandRunner.getServerCommand(CommandRunner.Feats.Quit).getMessage()) {
            client.destroy();
          }
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });
  });
});
