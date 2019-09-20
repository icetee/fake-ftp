const net = require('net');
const { lookup } = require('dns');
const { hostname } = require('os');
const { Socket } = require('net');
const { inherits, inspect } = require('util');
const EventEmitter = require('events');
const { Parse, debug } = require('../src');

module.exports = class Client {
  constructor(config) {
    this.config = Object.assign({
      host: '127.0.0.1',
      port: 21,
      user: 'anonymous',
      password: 'anonymous@',
      passive: false,
      keepalive: 1000
    }, config);

    this.socket = null;
    this.dataSocket = null;
    this.activeServer = null;
    this.passiveSocket = null;
    this.delay = time => new Promise(res => setTimeout(() => res(), time));
    this.emitter = new EventEmitter();
    this.parse = new Parse();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = new Socket();

      this.socket.setTimeout(0);
      this.socket.setKeepAlive(this.config.keepalive > 0);

      this.socket.setEncoding('binary');

      this.socket.once('data', () => {
        resolve(this.socket);
      });

      this.socket.on('data', (chunk) => {
        this.emitter.emit('chunk', chunk);

        this.parse.emitter.on('response', (messages) => {
          this.emitter.emit('response', messages);
        });

        this.emitter.emit('parsed', this.parse.read(chunk));

        debug('[connection] < ' + inspect(chunk.toString('binary')))
      });

      this.socket.connect(this.config.port, this.config.host);
    });
  }

  async send(command) {
    return new Promise((resolve, reject) => {
      this.socket.on('error', () => {
        reject();
      });

      this.socket.write(Buffer.from(`${command}\r\n`), async () => {
        await this.delay(10);
        resolve();
      });
    });
  }

  async active(randomPort) {
    return new Promise((resolve, reject) => {
      lookup(hostname(), (err, address) => {
        if (err) {
          reject(err);
        }

        const host = address.split('.').join(',');

        this.activeServer = net.createServer((dataSocket) => {
          this.dataSocket = dataSocket;
        });

        this.activeServer.listen(randomPort[0] * 256 + randomPort[1], address, () => {
          resolve(`PORT ${host},${randomPort[0]},${randomPort[1]}`);
        });
      });
    });
  }

  async passive(host, port) {
    return new Promise((resolve, reject) => {
      this.passiveSocket = new Socket();

      this.passiveSocket.setTimeout(0);

      this.passiveSocket.once('connect', () => {
        debug('[connection] PASV socket connected');
        resolve();
      });

      this.passiveSocket.once('error', (err) => {
        debug('[connection] PASV error', err);

        reject(err);
      });

      this.passiveSocket.once('end', () => {
        debug('[connection] PASV END');
      });

      this.passiveSocket.once('close', (had_error) => {
        debug('[connection] PASV CLOSE', had_error);
      });

      this.passiveSocket.connect(port, host);
    });
  }

  destroy() {
    this.emitter.removeAllListeners('data');
    this.socket.end();

    if (this.activeServer) this.activeServer.close();
  }
};
