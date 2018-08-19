const { FTPMock } = require('./src');

const ftpMock = new FTPMock();

ftpMock.createServer({
  mock: {
    authentication: true
  }
});
