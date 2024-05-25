// utils/logger.js
const log = (message) => {
 const timestamp = new Date().toLocaleString();
 console.log(`[${timestamp}] ${message}`);
};

module.exports = log; 
