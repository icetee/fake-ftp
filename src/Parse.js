const debug = require('./debug.js');
const SocketMessage = require('./SocketMessage.js');
const { RE_RES_END } = require('./expressions.js');
const EventEmitter = require('events');

module.exports = class Parse {
  constructor() {
    this.emitter = new EventEmitter();
  }

  read(chunk) {
    let buffer = chunk.toString('binary');

    const message = [];

    while (RE_RES_END.exec(buffer) !== null) {
      const m = RE_RES_END.exec(buffer);
      const rest = buffer.substring(m.index + m[0].length);

      debug(`[parser] < ${buffer}`);

      const reRmLeadCode = new RegExp(`(^|\\r?\\n)${m[1]}(?: |\\-)`, 'g');
      const text = buffer.replace(reRmLeadCode, '$1').trim();

      this.emitter.emit('response', new SocketMessage(parseInt(m[1], 10), text));
      message.push(new SocketMessage(parseInt(m[1], 10), text))

      buffer = rest;
    }

    return message;
  }
}
