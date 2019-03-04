/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import { SocketServerMessage } from '../Delivery';

export default class Hello implements Commands.ICommand {
  code = 220;
  name = 'hello';
  defaultMessage = 'Fake FTP 1.0.0 Server [127.0.0.1]';

  /**
   * Configuration dependent, but default message to be send when client
   * successfully joins
   *
   * @param  {string} message
   * @return SocketServerMessage
   **/
  getSocketMessage(message?: string): Delivery.SocketServerMessage {
    const text = message ? message : this.defaultMessage;

    return new SocketServerMessage(this.code, text);
  }
}
