import SocketClientMessage from './SocketClientMessage';

const RE_RES_END = /((\w*)\s(.*)|(\w*))(\r\n|\n\r|\r|\n|\t)/;

export default class SocketParse {
  constructor(public chuck: Buffer | string) { }

  getCommands(): SocketClientMessage[] {
    const commands = [];

    let buffer = this.chuck.toString();

    while (RE_RES_END.exec(buffer) !== null) {
      const m = RE_RES_END.exec(buffer);

      if (m !== null) {
        const rest = buffer.substring(m.index + m[0].length);

        commands.push(new SocketClientMessage(m[0]));

        buffer = rest;
      }
    }

    return commands;
  }
}
