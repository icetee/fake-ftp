process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { assert } = require('chai');
const Client = require('./Client');
const { FTPMock, SocketMessage } = require('../src');

const config = {
  host: '127.0.0.1',
  port: 9021,
  user: 'icetee',
  password: 'secret',
  passive: false
};

const mockConfig = {
  mock: {
    authentication: true
  }
};

const ftpMock = new FTPMock();

ftpMock.createServer(mockConfig);

(async function() {
  const ftp = new Client(config);
  const socket = await ftp.connect();

  await ftp.send('USER icetee');
  await ftp.send('PASS secret');

  const randomPort = [150, 52]; // 150 * 256 + 52 = 38452

  await ftp.send(await ftp.active(randomPort));
  await ftp.send('LIST /');
})();
