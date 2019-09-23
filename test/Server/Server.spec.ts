/// <reference path="../../src/Server/Server.d.ts" />

import * as net from 'net';
import { assert } from 'chai';
import FakeFtp from '../../src/FakeFtp';
import SocketServerParse from '../assets/SocketServerParse';
import {
  SocketClientMessage,
  SocketServerMessage,
  CommandRunner
} from '../../src/Delivery';

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

    it('return correct command collection when multiple serial messages come', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
          welcome: false,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host, () => {
          client.write(new SocketClientMessage('mock').getMessage());
          client.write(new SocketClientMessage('hack').getMessage());
          client.write(new SocketClientMessage('quit').getMessage());
        });

        client.on('data', (data: Buffer | String) => {
          const serverMessageCollection = (new SocketServerParse(data)).getServerCommands();

          const assertMessage = [
            CommandRunner.getServerResponse(new SocketClientMessage('nu')).getMessage(),
            CommandRunner.getServerResponse(new SocketClientMessage('nu')).getMessage(),
            CommandRunner.getServerResponse(new SocketClientMessage('quit')).getMessage(),
          ];

          serverMessageCollection.forEach((serverMessage: SocketServerMessage, index: number) => {
            assert.equal(serverMessage.getMessage(), assertMessage[index]);
          });

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });
  });

  describe('Parametered commands', () => {
    it('OPTS UTF8', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
          welcome: false,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host, () => {
          client.write(new SocketClientMessage('OPTS UTF8').getMessage());
        });

        client.on('data', (data: Buffer | String) => {
          assert.equal(data.toString(), (new SocketServerMessage(500, 'OPTS UTF8 not understood')).getMessage());

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });
  });

  describe('Authentication', () => {
    it('require USER if enabled autoAuth', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
          welcome: false,
          autoAuth: true,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host);

        client.on('data', (data: Buffer | String) => {
          assert.equal(data.toString(), (new SocketServerMessage(257, 'User:')).getMessage());

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });

    it('require PASS if enabled autoAuth and writed USER icetee', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
          welcome: false,
          autoAuth: true,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host, () => {
          client.write(new SocketClientMessage('USER icetee').getMessage());
        });

        client.on('data', (data: Buffer | String) => {
          const serverMessageCollection = (new SocketServerParse(data)).getServerCommands();

          const assertMessage = [
            new SocketServerMessage(257, 'User:').getMessage(),
            new SocketServerMessage(331, 'Password required for icetee').getMessage(),
          ];

          serverMessageCollection.forEach((serverMessage: SocketServerMessage, index: number) => {
            assert.equal(serverMessage.getMessage(), assertMessage[index]);
          });

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });

    it('return user logged in with correct account', (done) => {
      (async () => {
        const FakeFtpConfig = {
          ...testConfig,
          welcome: false,
          autoAuth: true,
        };
        const FakeFtpServer = new FakeFtp(FakeFtpConfig);
        const FakeFtpTCP: net.Server = await (FakeFtpServer).start();

        const client = new net.Socket();

        client.connect(testConfig.port, testConfig.host, () => {
          client.write(new SocketClientMessage('USER icetee').getMessage());
          client.write(new SocketClientMessage('PASS secret').getMessage());
        });

        client.on('data', (data: Buffer | String) => {
          const serverMessageCollection = (new SocketServerParse(data)).getServerCommands();

          const assertMessage = [
            new SocketServerMessage(257, 'User:').getMessage(),
            new SocketServerMessage(331, 'Password required for icetee').getMessage(),
            new SocketServerMessage(230, 'User icetee logged in').getMessage(),
          ];

          serverMessageCollection.forEach((serverMessage: SocketServerMessage, index: number) => {
            assert.equal(serverMessage.getMessage(), assertMessage[index]);
          });

          client.destroy();
        });

        client.on('close', async () => {
          await FakeFtpTCP.close();

          done();
        });
      })();
    });
  });
});
