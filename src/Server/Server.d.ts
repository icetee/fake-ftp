declare module "Server" {
  export interface IServerConfig {
    host: string;
    port: number;
    welcome: boolean;
    autoAuth: boolean;
  }

  export interface IServerStorage {
    user: string | null;
    password: string | null;
  }
}
