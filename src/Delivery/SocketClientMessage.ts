/// <reference path="Delivery.d.ts" />

import * as Delivery from "Delivery";

export default class SocketClientMessage implements Delivery.SocketClientMessage {
  command: string = '';
  value: string = '';

  constructor(public text: Buffer | string) {
    const msg = text.toString().replace(/(\r|\n|\t)/gm, '');
    const message = msg.match(/^(?<command>\w*)\s(?<value>.*)|(?<single>\w*)$/);

    if (message && message.groups) {
      if (message.groups.single) {
        this.command = message.groups.single.toLowerCase();
      } else {
        this.command = message.groups.command.toLowerCase();
        this.value = message.groups.value;
      }
    }
  };

  getMessage(): string {
    if (!this.value) {
      return `${this.command}\r\n`;
    }

    return `${this.command} ${this.value}\r\n`;
  }
}
