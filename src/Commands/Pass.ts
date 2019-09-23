/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="../Server/Server.d.ts" />
/// <reference path="../FakeFtp.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import FakeCommand from './FakeCommand';
import { SocketServerMessage } from '../Delivery';

export default class Pass extends FakeCommand implements Commands.ICommand {
  code = 530;
  name = 'pass';
  defaultMessage = 'Login incorrect.';

  /**
   * The error message is sent when the command exists but is not implemented.
   *
   * @param  {string} message
   * @return SocketServerMessage
   **/
  getSocketMessage(message?: string): Delivery.SocketServerMessage {
    const text = message ? message : this.defaultMessage;

    if (this.clientMessage && this.clientMessage.value) {
      this.fakeFtp.storage.password = this.clientMessage.value;
    }

    if (this.fakeFtp.storage.password) {
      return new SocketServerMessage(230, `User ${this.fakeFtp.storage.user} logged in`);
    }

    return new SocketServerMessage(this.code, text);
  }
}
