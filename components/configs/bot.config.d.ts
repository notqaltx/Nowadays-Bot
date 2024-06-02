interface BotConfig {
   token: string;
   guildId: string;
   clientId: string;
   clientSecret: string;

   channels: {
       reportsChannel: string;
       verificationChannel: string;
   };
   moderation: {
       messageLimit: number;
       timeLimit: number;
       swearFilter: boolean;
       commandTimeout: number;
   };
   developer: {
       debug: boolean;
       debugging: {
          show_loaded_commands: boolean;
          show_loaded_components: boolean;
          show_loaded_events: boolean;
       };
       oauth: {
          port: string;
          domain: string;
          secret: string;
          redirectURL: string;
          robloxCacheURL: string;
       };
   };
}
declare module './bot.config' {  
   const config: BotConfig;
   export default config;
}
