declare module "Delivery" {
  export interface IMessage {
    getMessage(): string;
  }

  export interface SocketServerMessage {
    code: number;
    text: string;

    getMessage(): string;
  }

  export interface SocketClientMessage {
    command: string;
    value: string;

    getMessage(): string;
  }
}
