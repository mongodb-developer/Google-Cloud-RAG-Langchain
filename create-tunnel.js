import ngrok from '@ngrok/ngrok';
import { readFileSync, writeFileSync } from 'node:fs';

(async () => {
  const listener = await ngrok.connect({ addr: 8080, authtoken_from_env: true })
  const url = listener.url();


  const configFileClient = readFileSync('./client/src/config.ts');
  const configFileClientString = configFileClient.toString();

  const updatedFile = configFileClientString.replace(/(backendUrl = )(.*?)\;/g, `$1'${url}';`);

  writeFileSync('./client/src/config.ts', updatedFile);

  console.log(`API Tunnel open at ${url}`);

  while(true){}
})();
