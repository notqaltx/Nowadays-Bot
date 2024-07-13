interface BotConfig {
   token: string;
   guildId: string;
   clientId: string;
   clientSecret: string;

   server: {
       reportsChannel: string;
       verificationChannel: string;
       roleId: number;
   };
   moderation: {
       messageLimit: number;
       timeLimit: number;
       swearFilter: boolean;
       commandTimeout: number;
   };
   developer: {
       debug: boolean;
       id: number;
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
          robloxVerificationURL: string;
       };
   };
}
declare module './bot.config' {  
   const config: BotConfig;
   export default config;
}
