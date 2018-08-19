const packageInfo = require('../package.json');
const Response = require('./Response.js');
const Commands = require('./Commands.js');
const { commandRegexp } = require('./expressions.js');
const path = require('path');
const net = require('net');

module.exports = class Server {
  constructor() {
    this.destroy();
  }

  destroy() {
    this.server = null;
    this.socket = null;
    this.commands = null;
    this.options = null;
  }

  send(response) {
    if (!this.socket && !this.socket.writable) return;

    this.socket.write(response);
  }

  listen(options) {
    this.options = options;

    return new Promise((resolve, reject) => {
      this.server = net.createServer(options.originalServer, (socket) => {
        socket.setTimeout(0);
        socket.passive = null;
        socket.username = null;
        socket.logged = null;

        this.socket = socket;

        this.commands = new Commands(this.server, this.socket, this.options);

        if (options.mock.welcomeMessage) {
          this.send(Response.welcomeMessage(packageInfo.version, this.socket.address().address));
        }

        this.socket.on('data', this.socketData.bind(this));

        this.socket.on('timeout', () => {
          console.log("timeout!");
        });

        this.socket.on('close', () => {
          this.socket = null;
        });

        this.socket.on('error', (err) => {
          this.destroy();
        });
      });

      this.server.listen(options.mock.port, options.mock.host, () => {
        resolve(this.server);
      });
    });
  }

  socketData(chunk) {
    if (this.socket === null) return;

    const buffer = chunk.toString('utf8');

    return this.send(this.commands.run(buffer));
  }

}
