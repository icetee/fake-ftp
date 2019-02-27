const { linux } = require('./assets/list.js');
const { getRandomPort } = require('./helper.js');
const { Response } = require('./Response.js');
const { RE_CMD, RE_PORT } = require('./expressions.js');

module.exports = class Commands {
  static commandsWithoutAuth() {
    return [
      'user',
      'pass',
      'feat',
      'syst',
      'help',
      'quit'
    ];
  }

  constructor(server, socket, options) {
    this.server = server;
    this.socket = socket;
    this.options = options;
  }

  destroy() {
    //
  }

  static parse(command) {
    return command.replace(/\r?\n|\r/g, '').match(RE_CMD);
  }

  async run(command) {
    const match = Commands.parse(command);
    const fnName = (match === null) ? command.toLowerCase().trim() : match[1].toLowerCase().trim();

    if (Commands.commandsWithoutAuth().indexOf(fnName) === -1 && this.options.authentication && !this.socket.logged) {
      return this.auth(match);
    }

    if (typeof this[fnName] === 'function') {
      if (match !== null && match.length > 1) {
        if (typeof match[2] !== 'undefined') {
          return await this[fnName](match[2].trim());
        }

        return await this[fnName](match[1].trim());
      } else {
        if (fnName === 'list') {
          return await this[fnName]();
        }

        return await this[fnName]();
      }
    }

    return Response.notUnderstood(command);
  }

  auth(match) {
    const isMatched = (match !== null && match.length > 1);

    if (isMatched) {
      if (match[1] === 'user') {
        return this.user(match[2].trim());
      } else if (match[1] === 'pass' && this.socket.username !== null) {
        return this.pass(match[2].trim());
      }

      if (this.socket.username) {
        return Response.passwordRequire(this.socket.username);
      }
    }

    return Response.userRequire();
  }

  user(username) {
    this.socket.username = username;

    return Response.passwordRequire(this.socket.username);
  }

  pass(password) {
    const account = this.options.accounts.filter((account, index) => {
      return account.username === this.socket.username;
    });

    if (account.length > 0 && account[0].password === password) {
      this.socket.logged = true;

      return Response.loginCorrect(this.socket.username);
    }

    this.socket.username = null;

    return Response.loginIncorrect();
  }

  async dataSocket(buffer) {
    if (this.options.passive) {
      await this.socket.writePassiveDataSocket(buffer);
    } else {
      await this.socket.writeActiveDataSocket(buffer);
    }
  }

  async list(target) {
    await this.dataSocket(Buffer.from(linux));

    return Response.transferComplete();
  }

  port(info) {
    const portMatch = info.match(RE_PORT);

    if (!portMatch) {
      Response.portFail();
    }

    this.socket.dataSocketInfo = {
      host: `${portMatch[1]}.${portMatch[2]}.${portMatch[3]}.${portMatch[4]}`,
      port: (parseInt(portMatch[5], 10) * 256) + parseInt(portMatch[6], 0)
    };

    return Response.portSuccess();
  }

  pasv() {
    const randomPort = getRandomPort(
      this.options.dataSocket.passive.portMin,
      this.options.dataSocket.passive.portMax
    );

    this.server.dataSocketInfo = {
      host: this.socket.address().address.split('.').join(','),
      hostOriginal: this.socket.address().address,
      port: randomPort.port,
      p1: randomPort.p1,
      p2: randomPort.p2,
    };

    return Response.pasvSuccess(
      `${this.server.dataSocketInfo.host},${randomPort.p1},${randomPort.p2}`
    );
  }

  type(info) {
    return Response.typeSuccess(info);
  }

  pwd() {
    return Response.noImplemented();
  }

  opts() {
    return Response.noImplemented();
  }

  feat() {
    return Response.features([
      // 'UTF8',
    ]);
  }

  syst() {
    return Response.unixType();
  }

  help() {
    return Response.help();
  }

  quit() {
    return this.socket.end(Response.quit());
  }
};
