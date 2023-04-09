export const environment = {
  production: true,
  //apiUri : 'http://localhost:3000',
  apiUri: 'https://osd2023backend.up.railway.app',
  //jwtDecoderUri: 'https://localhost:4200',
  jwtDecoderUri: 'https://localhost:4200',
  auth0:
  {
    domain: 'dev-slwtm6bdvggyj45g.us.auth0.com',
    clientId: 'oGcxKCa3ImHiZHzQhwSXIeELHSghKEvT',
    callback_URL: 'localhost:4200/callback',
    audience: 'recipies'
  }
};
