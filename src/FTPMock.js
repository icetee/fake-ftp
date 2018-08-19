const Server = require('./Server.js');
const { mergeDeep } = require('./helper.js');

module.exports = class FTPMock {
  constructor() {
    this.options = {
      mock: {
        host: '127.0.0.1',
        port: 9021,
        accounts: [{
          username: 'icetee',
          password: 'secret',
        }],
        welcomeMessage: true,
        authentication: true,
      },
      originalServer: {},
    };
  }

  async createServer(options) {
    const opt = mergeDeep(this.options, options);

    this.server = await (new Server()).listen(opt);

    console.log('Server listening on ' + this.server.address().address + ':' + this.server.address().port);
  }
};
