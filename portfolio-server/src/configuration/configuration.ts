const Port: number = 6900;



export const Configuration: {
    ServerSideURL: string,
    ClientSideURL: string,

    ProxyURLPrefix: string,

    Port: number
} = {
    ServerSideURL: `http://localhost:${Port}`,
    ClientSideURL: 'http://localhost:4200',

    ProxyURLPrefix: 'api',

    Port: Port
};