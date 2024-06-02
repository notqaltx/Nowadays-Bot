require('dotenv').config();
var config = {
   token: process.env.TOKEN,
   guildId: process.env.GUILD_ID,
   clientId: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,

   channels: {
       reportsChannel: process.env.REPORTS_CHANNEL_ID,
       verificationChannel: process.env.VERIFICATION_CHANNEL_ID
   },
   moderation: {
       messageLimit: 5,
       timeLimit: 5000,
       swearFilter: true,
       commandTimeout: 2500
   },
   developer: {
       debug: true,
       debugging: {
          show_loaded_commands: false,
          show_loaded_components: false,
          show_loaded_events: false
       },
       oauth: {
          port: process.env.PORT || 2222,
          domain: `localhost:${process.env.PORT}` || `127.0.0.1:${process.env.PORT}`,
          secret: process.env.OAUTH_SECRET,
          redirectURL: process.env.REDIRECT_URL,
          robloxCacheURL: process.env.CACHE_LINK
       }
   },
};
module.exports = config;
