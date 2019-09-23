/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import FakeCommand from './FakeCommand';
import { SocketServerMessage } from '../Delivery';

export default class NotUnderstood extends FakeCommand implements Commands.ICommand {
  code = 500;
  name = 'nu';
  defaultMessage = ':command: not understood';

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
