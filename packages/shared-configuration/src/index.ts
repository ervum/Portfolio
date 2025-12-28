let Secrets: { Database: DatabaseConfiguration } = {
    Database: {
        Host: 'localhost',
        Port: 5432,
        User: '',
        Password: '',
        Name: 'portfolio_database'
    }
};



try {
  Secrets = (((await import('./secrets')).Secrets) ?? Secrets);
} catch (e: any) {}



const ServerSidePort: number = 6900;
const ClientSidePort: number = 4200;

const ProxyURL: string = 'api';
const SlashedProxyURL: string = `/${ProxyURL}`;



export type ConfigurationType = {
    URL: string,
    Port: number,

    ProxyURL: string,
    SlashedProxyURL: string
};

export type DatabaseConfiguration = {
  Host: string;
  Port: number;
  User: string;
  Password: string;
  Name: string;
};



export const ServerSideConfiguration: ConfigurationType & { Database: DatabaseConfiguration } = {
    URL: `http://localhost:${ServerSidePort}`,
    Port: ServerSidePort,

    ProxyURL: ProxyURL,
    SlashedProxyURL: SlashedProxyURL,

    Database: {
      Host: (Secrets.Database.Host),
      Port: (Secrets.Database.Port),
      User: (Secrets.Database.User),
      Password: (Secrets.Database.Password),
      Name: (Secrets.Database.Name)
    }
};

export const ClientSideConfiguration: ConfigurationType = {
    URL: `http://localhost:${ClientSidePort}`,
    Port: ClientSidePort,
    
    ProxyURL: ProxyURL,
    SlashedProxyURL: SlashedProxyURL
};