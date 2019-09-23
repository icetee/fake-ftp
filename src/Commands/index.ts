import Fake from './Fake';
import Hello from './Hello';
import Quit from './Quit';
import NoImplemented from './NoImplemented';
import NotUnderstood from './NotUnderstood';
import Opts from './Opts';
import User from './User';

export enum Feats {
  Fake = 'fake',
  Hello = 'hello',
  Quit = 'quit',
  NoImplemented = 'ni',
  NotUnderstood = 'nu',
  Opts = 'opts',
  User = 'user',
}

export {
  Fake,
  Hello,
  Quit,
  NoImplemented,
  NotUnderstood,
  Opts,
  User,
}
