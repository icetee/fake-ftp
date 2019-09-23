/// <reference path="../../src/Commands/Commands.d.ts" />

import { assert } from 'chai';
import * as Commands from '../../src/Commands';
import { SocketClientMessage, CommandRunner } from '../../src/Delivery';

describe('FakeFtp - CommandRunner', () => {
  it('return understood message with bad client command', () => {
    const cmd = CommandRunner.getServerResponse(
      new SocketClientMessage('bad 1')
    );

    assert.deepEqual(cmd, (new Commands.NotUnderstood()).setServerMessage(cmd).getSocketMessage());
  });

  it('return no implemented message with NoImplemented command', () => {
    const cmd = CommandRunner.getServerResponse(
      new SocketClientMessage('ni')
    );

    assert.deepEqual(cmd, (new Commands.NoImplemented()).setServerMessage(cmd).getSocketMessage());
  });

  it('return no implemented message with noimplemented command (uppercase)', () => {
    const cmd = CommandRunner.getServerResponse(
      new SocketClientMessage('NI')
    );

    assert.deepEqual(cmd, (new Commands.NoImplemented()).setServerMessage(cmd).getSocketMessage());
  });
});
