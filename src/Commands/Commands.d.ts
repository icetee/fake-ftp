/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="../FakeFtpService.d.ts" />

declare module "Commands" {
  import * as FakeFtpService from 'FakeFtpService';
  import * as Delivery from 'Delivery'

  export interface IFakeCommand {
    fakeFtp: FakeFtpService.IFakeFtp;

    clientMessage: Delivery.SocketClientMessage | null;
    serverMessage: Delivery.SocketServerMessage | null;

    setFakeFtp(fakeFtp: FakeFtpService.IFakeFtp): this;

    setClientMessage(clientMessage: Delivery.SocketClientMessage): this;
    setServerMessage(serverMessage: Delivery.SocketServerMessage): this;
  }

  export interface ICommand extends IFakeCommand {
    code: number;
    name: string;
    defaultMessage: string;

    getSocketMessage(): Delivery.SocketServerMessage;
  }
}
