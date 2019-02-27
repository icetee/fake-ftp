module.exports = class SocketMessage {
  constructor(code, message, preMessage) {
    this.code = code;
    this.message = message.replace(/(\r\n\t|\n|\r\t)/gm, '');

    if (typeof preMessage !== 'undefined') {
      this.preMessage = preMessage;
    }
  }

  toString() {
    if (this.preMessage) {
      return `${this.preMessage}\r\n${this.code} ${this.message}\r\n`;
    }

    return `${this.code} ${this.message}\r\n`;
  }
};
