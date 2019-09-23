/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import { SocketServerMessage } from '../Delivery';

export default class NotUnderstood implements Commands.ICommand {
  code = 500;
  name = 'nu';
  defaultMessage = ':command: not understood';
  clientMessage: Delivery.SocketClientMessage | null;

  constructor(clientMessage: Delivery.SocketClientMessage | null = null) {
    this.clientMessage = clientMessage;
  }

  /**
   * The error message is sent when an unknown command is sent.
   *
   * @param  {string} message
   * @return SocketServerMessage
   **/
  getSocketMessage(message?: string): Delivery.SocketServerMessage {
    let text = message ? message : this.defaultMessage;

    if (this.clientMessage && this.clientMessage.value) {
      text = text.replace(':command:', this.clientMessage.value);
    }

    return new SocketServerMessage(this.code, text);
  }
}
