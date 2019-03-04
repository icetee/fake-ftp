/// <reference path="Delivery.d.ts" />

import * as Delivery from "Delivery";

export default class SocketServerMessage implements Delivery.SocketServerMessage {
  constructor(public code: number, public text: string) {
    this.text = text.replace(/(\r|\n|\t)/gm, '');
  };

  getMessage(): string {
    return `${this.code} ${this.text}\r\n`;
  }
}
