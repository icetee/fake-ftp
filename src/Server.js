const net = require('net');
const packageInfo = require('../package.json');
const { Response } = require('./Response.js');
const Commands = require('./Commands.js');
const { RE_CMD } = require('./expressions.js');
const { getRandomPort } = require('./helper.js');
const debug = require('./debug.js');

module.exports = class Server {
  constructor(options) {
    this.options = options;
  }

  destroy() {
    if (this.server) this.server.close();
    if (this.activeDataSocket) this.activeDataSocket.end();
    if (this.passiveDataSocket) this.passiveDataSocket.close();

    this.server = null;
    this.socket = null;
    this.commands = null;
  }

  send(response) {
    if (!this.socket && !this.socket.writable) return;

    this.socket.write(response);
  }

  listen() {
    return new Promise((resolve, reject) => {
      this.server = net.createServer(this.options.originalServer, (socket) => {
        socket.setTimeout(0);
        socket.passive = null;
        socket.username = null;
        socket.logged = null;

        this.socket = socket;

        this.commands = new Commands(this.server, this.socket, this.options);

        if (this.options.welcomeMessage) {
          this.send(Response.welcomeMessage(packageInfo.version, this.socket.address().address));
        }

        this.socket.on('data', async (chunk) => {
          await this.socketData(chunk);
        });

        this.socket.on('timeout', () => {
          console.log("timeout!");
        });

        this.socket.on('close', () => {
          this.socket = null;
        });

        this.socket.on('error', (error) => {
          debug(error);

          reject(error);
          // this.destroy();
        });

        this.socket.writeActiveDataSocket = async (buffer) => {
          return new Promise((resolve, reject) => {
            this.activeDataSocket = net.Socket();

            this.activeDataSocket.connect(
              this.socket.dataSocketInfo.port,
              this.socket.dataSocketInfo.host,
              () => {
                this.activeDataSocket.write(buffer + '\r\n', () => {
                  resolve();
                });

                this.activeDataSocket.end();
            });

            this.activeDataSocket.on('error', (error) => {
              debug(error);
              this.activeDataSocket.end();
              reject(error);
            });

            this.activeDataSocket.on('close', () => {
              this.activeDataSocket.end();
            });
          });
        };

        this.socket.writePassiveDataSocket = async (buffer) => {
          return new Promise((resolve, reject) => {
            this.passiveDataSocket = net.createServer(dataSocket => {
              dataSocket.setKeepAlive(true, this.options.dataSocket.passive.keepalive);
              dataSocket.setTimeout(this.options.dataSocket.passive.timeout);

              dataSocket.once('connection', () => {
                debug('[connection] PASV socket connected');

                resolve();
              });
            });

            this.passiveDataSocket.on('error', (error) => {
              debug(error);

              this.passiveDataSocket.close();

              if (error) {
                reject(error);
              }
            });

            this.passiveDataSocket.on('close', (error) => {
              if (error) {
                reject(error);
              }
            });

            this.passiveDataSocket.listen(this.server.dataSocketInfo.port, this.server.dataSocketInfo.hostOriginal, () => {
              if (! this.options.silent) {
                console.log(`DataSocket listening on ${this.passiveDataSocket.address().address}:${this.passiveDataSocket.address().port}`);
              }
            });
          });
        };
      });

      this.server.listen(this.options.port, this.options.host, () => {
        resolve(this.server);
      });
    });
  }

  async socketData(chunk) {
    if (this.socket === null) return;

    const buffer = chunk.toString('utf8');
    const result = await this.commands.run(buffer);

    return this.send(result);
  }
}
