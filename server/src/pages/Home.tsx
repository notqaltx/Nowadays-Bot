import React from 'react';
import { Link } from 'react-router-dom';

const redirectUrl = 'https://discord.com/oauth2/authorize?client_id=1041354129479565342&permissions=8&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A2222%2F&scope=identify+bot+applications.commands+dm_channels.messages.read+dm_channels.messages.write';
function Home() {
  const handleStartClick = () => {
     if (redirectUrl) {
       window.location.replace(redirectUrl);
     } else {
       alert("Error: OAuth2 URL not found. Please check your environment variables.");
       console.error("OAuth2 URL is undefined in .env file.");
     }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#1E447D] from-0% via-[#3A3369] via-50% to-[#4F2074] text-[#EEE6E6] p-20">
      <h1 className="text-5xl font-semibold font-['Fira_Code'] mb-2 bottom-[37.5rem] absolute">LetsBeSocial</h1>
      <p className="text-2xl font-light font-['Fira_Code'] bottom-[35.75rem] absolute">Discord Bot</p>
      <p className="text-[0.75em] font-light font-['Fira_Code'] opacity-20 bottom-[34rem] absolute">Developed by Alex & Trey</p>
      <button 
        onClick={handleStartClick}
        className="text-xl font-['Fira_Code'] bg-transparent border-2 border-[#EEE6E6] rounded-2xl px-20 py-3 mt-40 top-[35rem] absolute hover:border-4 transition-all duration-300 ease-out"
      >
        Start
      </button>
    </div>
  );
}

export default Home;
