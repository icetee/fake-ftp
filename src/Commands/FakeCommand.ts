/// <reference path="../Delivery/Delivery.d.ts" />
/// <reference path="../Server/Server.d.ts" />
/// <reference path="../FakeFtpService.d.ts" />
/// <reference path="Commands.d.ts" />

import * as Delivery from "Delivery";
import * as Commands from "Commands";
import FakeFtp from "../FakeFtp";

export default class FakeCommand implements Commands.IFakeCommand {
  fakeFtp: FakeFtp;
  clientMessage: Delivery.SocketClientMessage | null = null;
  serverMessage: Delivery.SocketServerMessage | null = null;

  setFakeFtp(fakeFtp: FakeFtp): this {
    this.fakeFtp = fakeFtp;

    return this;
  }

  setClientMessage(clientMessage: Delivery.SocketClientMessage | null = null): this {
    this.clientMessage = clientMessage;

    return this;
  }

  setServerMessage(serverMessage: Delivery.SocketServerMessage | null = null): this {
    this.serverMessage = serverMessage;

    return this;
  }
}
