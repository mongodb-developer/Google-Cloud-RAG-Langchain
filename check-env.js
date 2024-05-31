import { readFileSync, writeFileSync } from 'fs';

const serverEnv = readFileMaybe('server/.env');
if (serverEnv?.includes('ATLAS_URI')) {
    console.info('ATLAS_URI found in server/.env');
    process.exit(0);
}

const rootEnv = readFileMaybe('.env');
if (rootEnv?.includes('ATLAS_URI')) {
    writeFileSync('server/.env', rootEnv);

    console.info('ATLAS_URI found in .env');
    process.exit(0);
}

throwEnvError();

function readFileMaybe(path) {
    try {
        return readFileSync(path, 'utf8');
    } catch (_e) {
    }
}

function throwEnvError() {
    const errorMessage = `
####### ######  ######  ####### ######  
#       #     # #     # #     # #     # 
#       #     # #     # #     # #     # 
#####   ######  ######  #     # ######  
#       #   #   #   #   #     # #   #   
#       #    #  #    #  #     # #    #  
####### #     # #     # ####### #     # 

Missing database connection string!
Create a .env file and add an ATLAS_URI variable with your MongoDB connection string.

Example:
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
`;

    console.error(errorMessage);
    process.exit(1);
}