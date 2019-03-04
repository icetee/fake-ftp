import { assert } from 'chai';
import { SocketClientMessage } from '../../src/Delivery';

describe('FakeFtp - SocketClientMessage', () => {
  it('return simple command property', () => {
    const message = new SocketClientMessage('quit');

    assert.equal(message.command, 'quit');
  });

  it('return command with CR newline', () => {
    const message = new SocketClientMessage('quit\r');

    assert.equal(message.command, 'quit');
  });

  it('return command with LF newline', () => {
    const message = new SocketClientMessage('quit\n');

    assert.equal(message.command, 'quit');
  });

  it('return command with CRLF newline', () => {
    const message = new SocketClientMessage('quit\r\n');

    assert.equal(message.command, 'quit');
  });

  it('return command with TAB', () => {
    const message = new SocketClientMessage('quit\t');

    assert.equal(message.command, 'quit');
  });

  it('return command and value property', () => {
    const message = new SocketClientMessage('user MB1234');

    assert.equal(message.command, 'user');
    assert.equal(message.value, 'MB1234');
  });
});
