/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="../Server/Server.d.ts" />
/// <reference path="../FakeFtp.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import FakeCommand from './FakeCommand';
import { SocketServerMessage } from '../Delivery';

export default class User extends FakeCommand implements Commands.ICommand {
  code = 257;
  name = 'user';
  defaultMessage = 'User:';

  /**
   * The error message is sent when the command exists but is not implemented.
   *
   * @param  {string} message
   * @return SocketServerMessage
   **/
  getSocketMessage(message?: string): Delivery.SocketServerMessage {
    const text = message ? message : this.defaultMessage;

    if (this.clientMessage && this.clientMessage.value) {
      this.fakeFtp.storage.user = this.clientMessage.value;
    }

    if (this.fakeFtp && this.fakeFtp.storage && this.fakeFtp.storage.user) {
      return new SocketServerMessage(331, 'Password required for :user:');
    }

    return new SocketServerMessage(this.code, text);
  }
}
