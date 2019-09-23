/// <reference path="../Delivery/Delivery.d.ts" />

declare module "Commands" {
  import * as Delivery from 'Delivery'

  export interface ICommand {
    code: number;
    name: string;
    defaultMessage: string;
    clientMessage: Delivery.SocketClientMessage | null;

    getSocketMessage(): Delivery.SocketServerMessage;
  }
}
