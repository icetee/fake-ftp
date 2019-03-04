/// <reference path="../Delivery/Delivery.d.ts" />

declare module "Commands" {
  import * as Delivery from 'Delivery'

  export interface ICommand {
    code: number;
    name: string;
    defaultMessage: string;

    getSocketMessage(): Delivery.SocketServerMessage;
  }
}
