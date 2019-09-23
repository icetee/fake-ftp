/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import { SocketServerMessage } from '../Delivery';

export default class Quit implements Commands.ICommand {
  code = 221;
  name = 'quit';
  defaultMessage = 'Goodbye.';
  clientMessage: Delivery.SocketClientMessage | null;

  constructor(clientMessage: Delivery.SocketClientMessage | null = null) {
    this.clientMessage = clientMessage;
  }

  /**
   * When the command is received, it stops the connection between the server and
   * the client
   *
   * @param  {string} message
   * @return SocketServerMessage
   **/
  getSocketMessage(message?: string): Delivery.SocketServerMessage {
    const text = message ? message : this.defaultMessage;

    return new SocketServerMessage(this.code, text);
  }
}
