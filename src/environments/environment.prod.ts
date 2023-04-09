export const environment = {
  production: true,
  //apiUri : 'http://localhost:3000',
  apiUri: 'https://osd2023backend.up.railway.app',
  //jwtDecoderUri: 'https://localhost:4200',
  jwtDecoderUri: 'https://osd2023frontend.up.railway.app',
  auth0:
  {
    domain: 'dev-slwtm6bdvggyj45g.us.auth0.com',
    clientId: 'oGcxKCa3ImHiZHzQhwSXIeELHSghKEvT',
    callback_URL: 'https://osd2023frontend.up.railway.app/callback',
    audience: 'recipies'
  }
};
