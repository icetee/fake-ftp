const SocketMessage = require('./SocketMessage.js');

module.exports = class Response {
  static welcomeMessage(version, address) {
    return (new SocketMessage(200, `FTP Mock ${version} Server [${address}]`)).toString();
  }

  static notUnderstood(command) {
    return (new SocketMessage(500, `${command} not understood`)).toString();
  }

  static noImplemented() {
    return (new SocketMessage(500, `No implemented`)).toString();
  }

  static help(command) {
    return (new SocketMessage(200, `Help...`)).toString();
  }

  static userRequire() {
    return (new SocketMessage(530, `Please login with USER and PASS`)).toString();
  }

  static passwordRequire(username) {
    return (new SocketMessage(331, `Password required for ${username}`)).toString();
  }

  static loginCorrect(username) {
    return (new SocketMessage(230, `User ${username} logged in`)).toString();
  }

  static loginIncorrect() {
    return (new SocketMessage(530, `Login incorrect.`)).toString();
  }
};
