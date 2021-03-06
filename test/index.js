process.env.DEBUG = '0';

const { assert}  = require('chai');
const Client = require('./Client');
const { FTPMock, ResponseMessage, Parse } = require('../src');
const { RE_PASV } = require('../src/expressions.js');
const { linux } = require('../src/assets/list.js');
const packageInfo = require('../package.json');

const defaultConfig = {
  host: '127.0.0.1',
  port: 9021,
  user: 'icetee',
  password: 'secret',
  passive: false,
  silent: true,
};

const mockConfig = {
  authentication: true
};

const ftpMock = new FTPMock();

describe('#FTPMock with default config', () =>{
  beforeEach(() => {
    // ftpMock.createServer(mockConfig);
  });

  afterEach(() =>{
    if (ftpMock) {
      ftpMock.close();
    }
  });

  it('should return default welcomeMessage', (done) => {
    ftpMock.createServer(mockConfig);

    const client = new Client(defaultConfig);

    (async (done) => {
      client.emitter.on('response', (messages) => {
        const welcomeMessage = ResponseMessage.welcomeMessage(
          packageInfo.version,
          client.socket.address().address
        );

        assert.deepEqual(welcomeMessage, messages);

        done();
      });

      await client.connect();

      client.destroy();
    })(done);
  });

  it('should be success logged in [USER, PASS]', (done) => {
    ftpMock.createServer(mockConfig);

    const client = new Client(defaultConfig);

    (async function(done) {
      let index = 0;

      await client.connect();

      client.emitter.on('parsed', (messages) => {
        messages.forEach((message) => {
          assert.deepEqual(entities[index], message);
          index++;
        });
      });

      const entities = [
        ResponseMessage.passwordRequire(defaultConfig.user),
        ResponseMessage.loginCorrect(defaultConfig.user),
      ];

      await client.send(`USER ${defaultConfig.user}`);
      await client.send(`PASS ${defaultConfig.password}`);

      assert.equal(index, entities.length);

      client.destroy();

      done();
    })(done);
  });

  it('should be PORT success [PORT]', (done) => {
    ftpMock.createServer(mockConfig);

    const client = new Client(defaultConfig);

    (async (done) => {
      let index = 0;

      await client.connect();

      client.emitter.on('parsed', (messages) => {
        messages.forEach((message) => {
          assert.deepEqual(entities[index], message);
          index++;
        });
      });

      const entities = [
        ResponseMessage.passwordRequire(defaultConfig.user),
        ResponseMessage.loginCorrect(defaultConfig.user),
        ResponseMessage.portSuccess(),
      ];

      await client.send(`USER ${defaultConfig.user}`);
      await client.send(`PASS ${defaultConfig.password}`);

      const randomPort = [150, 52]; // 150 * 256 + 52 = 38452

      await client.send(await client.active(randomPort));

      assert.equal(index, entities.length);

      client.destroy();

      done();
    })(done);
  });

  it('should be transfer completed LIST with Active channel', (done) => {
    ftpMock.createServer(mockConfig);

    const client = new Client(defaultConfig);
    const dest = '/';

    (async (done) => {
      let index = 0;

      await client.connect();

      client.emitter.on('parsed', (messages) => {
        messages.forEach((message) => {
          assert.deepEqual(entities[index], message);
          index++;
        });
      });

      const entities = [
        ResponseMessage.passwordRequire(defaultConfig.user),
        ResponseMessage.loginCorrect(defaultConfig.user),
        ResponseMessage.portSuccess(),
        ResponseMessage.transferComplete(),
      ];

      await client.send(`USER ${defaultConfig.user}`);
      await client.send(`PASS ${defaultConfig.password}`);

      const randomPort = [150, 52]; // 150 * 256 + 52 = 38452

      await client.send(await client.active(randomPort));
      await client.send(`LIST ${dest}`);

      client.dataSocket.on('data', (chunk) => {
        assert.equal(linux + '\r\n', chunk.toString('utf8'));
      });

      assert.equal(index, entities.length);

      client.destroy();

      done();
    })(done);
  });

  it('should be PASV success', (done) => {
    ftpMock.createServer({
      passive: true,
    });

    const client = new Client(defaultConfig);

    (async (done) => {
      let index = 0;

      await client.connect();

      client.emitter.on('parsed', (messages) => {
        messages.forEach((socketMessage) => {
          if (RE_PASV.exec(socketMessage.message)) {
            const pasv = ResponseMessage.pasvSuccess(`${ftpMock.controlSocket.dataSocketInfo.host},${ftpMock.controlSocket.dataSocketInfo.p1},${ftpMock.controlSocket.dataSocketInfo.p2}`);

            entities.splice(index, 0, pasv);
            assert.deepEqual(entities[index], socketMessage);
          } else {
            assert.deepEqual(entities[index], socketMessage);
          }

          index++;
        });
      });

      const entities = [
        ResponseMessage.passwordRequire(defaultConfig.user),
        ResponseMessage.loginCorrect(defaultConfig.user),
      ];

      await client.send(`USER ${defaultConfig.user}`);
      await client.send(`PASS ${defaultConfig.password}`);
      await client.send('PASV');

      assert.equal(index, entities.length);

      client.destroy();

      done();
    })(done);
  });

  it('should be transfer completed LIST with Passive channel', (done) => {
    ftpMock.createServer({
      passive: true,
    });

    const client = new Client(defaultConfig);
    const dest = '/';

    (async (done) => {
      let index = 0;

      await client.connect();

      client.emitter.on('parsed', (messages) => {
        messages.forEach((socketMessage) => {
          if (RE_PASV.exec(socketMessage.message)) {
            const pasv = ResponseMessage.pasvSuccess(`${ftpMock.controlSocket.dataSocketInfo.host},${ftpMock.controlSocket.dataSocketInfo.p1},${ftpMock.controlSocket.dataSocketInfo.p2}`);

            entities.splice(index, 0, pasv);

            assert.deepEqual(entities[index], socketMessage);
          } else {
            assert.deepEqual(entities[index], socketMessage);
          }

          index++;
        });
      });

      const entities = [
        ResponseMessage.passwordRequire(defaultConfig.user),
        ResponseMessage.loginCorrect(defaultConfig.user),
      ];

      await client.send(`USER ${defaultConfig.user}`);
      await client.send(`PASS ${defaultConfig.password}`);
      await client.send('PASV');
      await client.send(`LIST ${dest}`);
      await client.passive(
        ftpMock.controlSocket.dataSocketInfo.hostOriginal,
        ftpMock.controlSocket.dataSocketInfo.port
      );

      assert.equal(index, entities.length);

      client.destroy();

      done();
    })(done);
  });
});
