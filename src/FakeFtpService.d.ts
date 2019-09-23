/// <reference path="Server/Server.d.ts" />
/// <reference types="node" />

/**
* Implementation of a Faker FTP Server.
*/
declare module "FakeFtpService" {
  import * as net from 'net';
  import * as Server from 'Server';

  export interface IFakeFtp {
    config: Server.IServerConfig;
    storage: Server.IServerStorage;

    // constructor(config: object, storage: object);
    start(): Promise<net.Server>;
    defaultConfig(): Server.IServerConfig;
    defaultStorage(): Server.IServerStorage;
  }
}
