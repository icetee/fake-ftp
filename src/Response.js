const SocketMessage = require('./SocketMessage.js');

class ResponseMessage {
  static welcomeMessage(version, address) {
    return new SocketMessage(200, `FTP Mock ${version} Server [${address}]`);
  }

  static notUnderstood(command) {
    return new SocketMessage(500, `${command} not understood`);
  }

  static noImplemented() {
    return new SocketMessage(500, `No implemented`);
  }

  static help(command) {
    return new SocketMessage(200, `Help...`);
  }

  static userRequire() {
    return new SocketMessage(530, `Please login with USER and PASS`);
  }

  static passwordRequire(username) {
    return new SocketMessage(331, `Password required for ${username}`);
  }

  static loginCorrect(username) {
    return new SocketMessage(230, `User ${username} logged in`);
  }

  static loginIncorrect() {
    return new SocketMessage(530, `Login incorrect.`);
  }

  static features(features) {
    const feat = features.join('\r\n');
    return new SocketMessage(211, 'End', `211-Features:\r\n${feat}`);
  }

  static unixType() {
    return new SocketMessage(215, `UNIX Type: L8`);
  }

  static portSuccess() {
    return new SocketMessage(200, `PORT command successful`);
  }

  static portFail() {
    return new SocketMessage(500, `PORT command failed`);
  }

  static pasvSuccess(passivAddress) {
    return new SocketMessage(227, `Entering Passive Mode (${passivAddress})`);
  }

  static pasvtFail(passivAddress) {
    return new SocketMessage(227, `Passive Mode unavailable`);
  }

  static transferComplete() {
    return new SocketMessage(226, `Transfer complete.`);
  }

  static pwd(path) {
    return new SocketMessage(257, `"${path}" is the current directory`);
  }

  static cwdSuccess(path) {
    return new SocketMessage(250, `CWD command successful`);
  }

  static typeSuccess(type) {
    return new SocketMessage(200, `Type set to ${type}`);
  }

  static quit() {
    return new SocketMessage(221, `Goodbye.`);
  }
}

class Response {
  static welcomeMessage(version, address) {
    return ResponseMessage.welcomeMessage(...arguments).toString();
  }

  static notUnderstood(command) {
    return ResponseMessage.notUnderstood(...arguments).toString();
  }

  static noImplemented() {
    return ResponseMessage.noImplemented(...arguments).toString();
  }

  static help(command) {
    return ResponseMessage.help(...arguments).toString();
  }

  static userRequire() {
    return ResponseMessage.userRequire(...arguments).toString();
  }

  static passwordRequire(username) {
    return ResponseMessage.passwordRequire(...arguments).toString();
  }

  static loginCorrect(username) {
    return ResponseMessage.loginCorrect(...arguments).toString();
  }

  static loginIncorrect() {
    return ResponseMessage.loginIncorrect(...arguments).toString();
  }

  static features(features) {
    return ResponseMessage.features(...arguments).toString();
  }

  static unixType() {
    return ResponseMessage.unixType(...arguments).toString();
  }

  static portSuccess() {
    return ResponseMessage.portSuccess(...arguments).toString();
  }

  static portFail() {
    return ResponseMessage.portFail(...arguments).toString();
  }

  static pasvSuccess() {
    return ResponseMessage.pasvSuccess(...arguments).toString();
  }

  static pasvtFail() {
    return ResponseMessage.pasvtFail(...arguments).toString();
  }

  static transferComplete() {
    return ResponseMessage.transferComplete(...arguments).toString();
  }

  static pwd(path) {
    return ResponseMessage.pwd(...arguments).toString();
  }

  static cwdSuccess(path) {
    return ResponseMessage.cwdSuccess(...arguments).toString();
  }

  static typeSuccess(type) {
    return ResponseMessage.typeSuccess(...arguments).toString();
  }

  static quit() {
    return ResponseMessage.quit(...arguments).toString();
  }
}

module.exports = {
  ResponseMessage,
  Response
};
