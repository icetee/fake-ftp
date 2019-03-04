import { assert } from 'chai';
import { SocketParse, SocketClientMessage } from '../../src/Delivery';

describe('FakeFtp - SocketParse', () => {
  it('return simple command with CR newline', () => {
    const chuck = Buffer.from('quit\r');
    const message = new SocketParse(chuck);

    assert.deepEqual(message.getCommands(), [
      new SocketClientMessage('quit\r')
    ]);
  });

  it('return simple command with LF newline', () => {
    const chuck = Buffer.from('quit\n');
    const message = new SocketParse(chuck);

    assert.deepEqual(message.getCommands(), [
      new SocketClientMessage('quit\n')
    ]);
  });

  it('return simple command with CRLF newline', () => {
    const chuck = Buffer.from('quit\r\n');
    const message = new SocketParse(chuck);

    assert.deepEqual(message.getCommands(), [
      new SocketClientMessage('quit\r\n')
    ]);
  });

  it('return simple command with TAB', () => {
    const chuck = Buffer.from('quit\t');
    const message = new SocketParse(chuck);

    assert.deepEqual(message.getCommands(), [
      new SocketClientMessage('quit\t')
    ]);
  });

  it('return simple command with multiline', () => {
    const chuck = Buffer.from('fake\r\nquit\r\n');
    const message = new SocketParse(chuck);

    assert.deepEqual(message.getCommands(), [
      new SocketClientMessage('fake\r\n'),
      new SocketClientMessage('quit\r\n')
    ]);
  });
});
