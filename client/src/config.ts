let backendUrl;
if (location.hostname.includes('cloudshell')) {
  backendUrl = 'https://mongodb.loca.lt';
} else {
  backendUrl = 'http://localhost:8080';
}

export const config = {
    backendUrl
};

