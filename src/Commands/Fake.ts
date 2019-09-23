/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="./Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import FakeCommand from './FakeCommand';
import { SocketServerMessage } from '../Delivery';

export default class Fake extends FakeCommand implements Commands.ICommand {
  code = 220;
  name = 'fake';
  defaultMessage = 'FAKE';

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
