const Response = require('./Response.js');
const { commandRegexp } = require('./expressions.js');

module.exports = class Commands {
  constructor(server, socket, options) {
    this.server = server;
    this.socket = socket;
    this.options = options;
  }

  destroy() {
    //
  }

  static parse(command) {
    return command.replace(/\r?\n|\r/g, '').match(commandRegexp);
  }

  run(command) {
    const match = Commands.parse(command);

    if (this.options.mock.authentication && !this.socket.logged) {
      return this.auth(match);
    }

    if (match !== null && match.length > 1) {
      const fnName = match[1].toLowerCase().trim();

      if (typeof this[fnName] === 'function') {

        if (typeof match[2] !== 'undefined') {
          return this[fnName](match[2].trim());
        }

        return this[fnName](match[1].trim());
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
    const account = this.options.mock.accounts.filter((account, index) => {
      return account.username === this.socket.username;
    });

    if (account.length > 0 && account[0].password === password) {
      this.socket.logged = true;

      return Response.loginCorrect(this.socket.username);
    }

    this.socket.username = null;

    return Response.loginIncorrect();
  }

  list(target) {
    return Response.noImplemented();

    // this.socket.dataTransfer((dataSocket, finish) => {
    //   this.socket.fs.list(target || this.socket.fs.pwd(), (result) => {
    //     dataSocket.write(result + '\r\n', finish);
    //   });
    // });
  }

  help() {
    return Response.help();
  }

};
