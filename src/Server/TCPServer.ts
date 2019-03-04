/// <reference path="Server.d.ts" />

import * as net from 'net';
import * as Server from 'Server';

/**
 * TCP server for communication
 *
 * @param {Server.IServerConfig} config TCP server config
 *
 * @return Promise<TCPServer>
 **/
export default (config: Server.IServerConfig) => {
  return new Promise<net.Server>((resolve, reject) => {
    const server = net.createServer();

    server.on('error', (err) => reject(err));

    server.listen(config.port, config.host, () => {
      resolve(server);
    });
  });
};
