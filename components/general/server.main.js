const path = require('node:path');
const express = require("express");
const app = express();

const bot = require('../configs/bot.config');
const Logger = require('../utils/log.util');
const log = new Logger();

const MAIN_PORT = bot.developer.oauth.port || 2222
app.get('/', async ({ query }, response) => {
   const { code } = query;
   if (code) {
     try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
         method: 'POST',
         body: new URLSearchParams({
            client_id: bot.clientId,
            client_secret: bot.clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `http://localhost:${MAIN_PORT}`,
            scope: 'identify',
         }).toString(),
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
       });
       const oauthData = await tokenResponseData.body.json();
       const userResult = await request('https://discord.com/api/users/@me', {
         headers: {
           authorization: `${oauthData.token_type} ${oauthData.access_token}`,
         },
       });
       console.log(await userResult.body.json());
     } catch (error) { console.error(error); }
   }
	  return response.sendFile(path.join('server', 'build', 'index.html'), { root: '.' });
});
app.get('/ping', (request, response) => { response.sendStatus(200); });
app.listen(MAIN_PORT, () => { log.info(`Server is running on port ${MAIN_PORT}!`); });
