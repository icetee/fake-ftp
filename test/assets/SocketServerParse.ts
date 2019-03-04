import SocketServerMessage from '../../src/Delivery/SocketServerMessage';

const RE_RES_END = /((\w*)\s(.*)|(\w*))(\r\n|\n\r|\r|\n|\t)/;

export default class SocketServerParse {
  constructor(public chuck: Buffer | String) { }

  getServerCommands(): SocketServerMessage[] {
    const commands = [];

    let buffer = this.chuck.toString();

    while (RE_RES_END.exec(buffer) !== null) {
      const m = RE_RES_END.exec(buffer);

      if (m !== null) {
        const rest = buffer.substring(m.index + m[0].length);

        commands.push(new SocketServerMessage(parseInt(m[1], 10), m[3]));

        buffer = rest;
      }
    }

    return commands;
  }
}
