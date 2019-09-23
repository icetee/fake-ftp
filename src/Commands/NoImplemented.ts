/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import { SocketServerMessage } from '../Delivery';

export default class NoImplemented implements Commands.ICommand {
  code = 500;
  name = 'ni';
  defaultMessage = 'No implemented';
  clientMessage: Delivery.SocketClientMessage | null;

  constructor(clientMessage: Delivery.SocketClientMessage | null = null) {
    this.clientMessage = clientMessage;
  }

  /**
   * The error message is sent when the command exists but is not implemented.
   *
   * @param  {string} message
   * @return SocketServerMessage
   **/
  getSocketMessage(message?: string): Delivery.SocketServerMessage {
    const text = message ? message : this.defaultMessage;

    return new SocketServerMessage(this.code, text);
  }
}
