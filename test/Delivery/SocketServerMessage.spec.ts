import { assert } from 'chai';
import { SocketServerMessage } from '../../src/Delivery';

describe('FakeFtp - SocketServerMessage', () => {
  it('return properties with simple parameters', () => {
    const message = new SocketServerMessage(221, 'Goodbye.');

    assert.equal(message.code, 221);
    assert.equal(message.text, 'Goodbye.');
  });

  it('return properties with parameters and CR newline', () => {
    const message = new SocketServerMessage(221, 'Goodbye.\r');

    assert.equal(message.code, 221);
    assert.equal(message.text, 'Goodbye.');
  });

  it('return properties with parameters and LF newline', () => {
    const message = new SocketServerMessage(221, 'Goodbye.\n');

    assert.equal(message.code, 221);
    assert.equal(message.text, 'Goodbye.');
  });

  it('return properties with parameters and CRLF newline', () => {
    const message = new SocketServerMessage(221, 'Goodbye.\r\n');

    assert.equal(message.code, 221);
    assert.equal(message.text, 'Goodbye.');
  });

  it('return properties with parameters and TAB char', () => {
    const message = new SocketServerMessage(221, 'Goodbye.\t');

    assert.equal(message.code, 221);
    assert.equal(message.text, 'Goodbye.');
  });

  it('return standard format', () => {
    const message = new SocketServerMessage(221, 'Goodbye.\t');

    assert.equal(message.getMessage(), '221 Goodbye.\r\n');
  });
});
