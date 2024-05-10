import localtunnel from 'localtunnel';
import { readFileSync, writeFileSync } from 'node:fs';

(async () => {
 const tunnel = await localtunnel({ port: 8080 });

 const url = tunnel.url;

 const configFileClient = readFileSync('./client/src/config.ts');

 const configFileClientString = configFileClient.toString();

 const updatedFile = configFileClientString.replace('https://mongodb.loca.lt', url);

 writeFileSync('./client/src/config.ts', updatedFile);

 console.log('API Tunnel open!');

 tunnel.on('close', () => {
		 // tunnels are closed
		 });
 })();
