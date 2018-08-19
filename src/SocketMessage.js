module.exports = class SocketMessage {
  constructor(code, message) {
    this.code = code;
    this.message = message.replace(/(\r\n\t|\n|\r\t)/gm, '');
  }

  toString() {
    return `${this.code} ${this.message}\r\n`;
  }
};
