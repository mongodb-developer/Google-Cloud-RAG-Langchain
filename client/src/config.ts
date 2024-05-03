const backendPort = '8080';
const backendUrl = `${location.protocol}//${location.hostname.replace('4200', `${backendPort}`)}${location.port ? `:${backendPort}` : ""}`;

console.log(backendUrl);

export const config = {
    backendUrl
};

