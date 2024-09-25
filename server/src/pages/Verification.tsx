import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const Verification: React.FC = () => {
  const [robloxUsername, setRobloxUsername] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!robloxUsername || !discordUsername || !code) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://nowadays.glitch.me/bot/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountdata: {
            Discord: discordUsername,
            Roblox: robloxUsername,
            Code: code, Verified: true
          }
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Verification successful!\n You can now close this page.' });
        setRobloxUsername('');
        setDiscordUsername('');
        setCode('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Verification failed.\n Please try again.' });
        setRobloxUsername('');
        setDiscordUsername('');
        setCode('');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-900 flex items-center justify-center font-sans p-4">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-500">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Nowadays Account Verification</h1>
        <p className="mb-6 text-gray-600 text-center">
          Join our Roblox game to receive your verification code. With Verified Account, you can get Multiplier in our games!
        </p>
        <a
          href="https://www.roblox.com/games/start?launchData=%7B%22From%22%3A%22Verify%22%7D&placeId=18288789431"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 text-white bg-green-600 hover:bg-green-700 transition-colors py-3 px-4 rounded-lg mb-8 shadow-lg"
        >
          <span>Join Roblox Game</span>
        </a>
        {message && (
          <Transition
            show={!!message}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {message.text}
            </div>
          </Transition>
        )}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div>
            <label htmlFor="robloxUsername" className="block mb-2 text-gray-700">
              Roblox Username
            </label>
            <input
              type="text"
              id="robloxUsername"
              value={robloxUsername}
              onChange={(e) => setRobloxUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Example: JohnDoe"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="discordUsername" className="block mb-2 text-gray-700">
              Discord Username
            </label>
            <input
              type="text"
              id="discordUsername"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Example: Buffy"
              required
            />
          </div>
          <div>
            <label htmlFor="code" className="block mb-2 text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
