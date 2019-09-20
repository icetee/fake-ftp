const Server = require('./Server.js');
const { mergeDeep } = require('./helper.js');

module.exports = class FTPMock {
  constructor() {
    this.options = {
      host: '127.0.0.1',
      port: 9021,
      silent: true,
      accounts: [{
        username: 'icetee',
        password: 'secret',
      }],
      welcomeMessage: true,
      authentication: true,
      passive: false,
      dataSocket: {
        active: {
          port: 9020,
          keepalive: 0,
          timeout: 0
        },
        passive: {
          portMin: 1024,
          portMax: 65535, // 255 * 256 + 255
          keepalive: 0,
          timeout: 0
        }
      },
      originalServer: {},
    };
  }

  async createServer(options) {
    const opt = mergeDeep(this.options, options);

    this.server = new Server(opt);
    this.controlSocket = await this.server.listen();

    if (! this.options.silent) {
      console.log('Server listening on ' + this.controlSocket.address().address + ':' + this.controlSocket.address().port);
    }
  }

  close() {
    this.server.destroy();
  }
};
