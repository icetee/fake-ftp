const Response = require('./Response.js');
const { commandRegexp } = require('./expressions.js');

module.exports = class Commands {
  static commandsWithoutAuth() {
    return [
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
    return command.replace(/\r?\n|\r/g, '').match(commandRegexp);
  }

  run(command) {
    const match = Commands.parse(command);
    const fnName = (match === null) ? command.toLowerCase().trim() : match[1].toLowerCase().trim();

    if (Commands.commandsWithoutAuth().indexOf(fnName) === -1 && this.options.mock.authentication && !this.socket.logged) {
      return this.auth(match);
    }

    if (typeof this[fnName] === 'function') {
      if (match !== null && match.length > 1) {
        if (typeof match[2] !== 'undefined') {
          return this[fnName](match[2].trim());
        }

        return this[fnName](match[1].trim());
      } else {
        return this[fnName]();
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

  feat() {
    return Response.features([
      'UTF8',
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
