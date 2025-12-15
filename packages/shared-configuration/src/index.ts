const ServerSidePort: number = 6900;
const ClientSidePort: number = 4200;

const ProxyURL: string = 'api';
const SlashedProxyURL: string = `/${ProxyURL}`;


type ConfigurationType = {
    URL: string,
    Port: number,

    ProxyURL: string,
    SlashedProxyURL: string
};



export const ServerSideConfiguration: ConfigurationType = {
    URL: `http://localhost:${ServerSidePort}`,
    Port: ServerSidePort,

    ProxyURL: ProxyURL,
    SlashedProxyURL: SlashedProxyURL
};

export const ClientSideConfiguration: ConfigurationType = {
    URL: `http://localhost:${ClientSidePort}`,
    Port: ClientSidePort,
    
    ProxyURL: ProxyURL,
    SlashedProxyURL: SlashedProxyURL
};