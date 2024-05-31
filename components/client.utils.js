let client;
module.exports = {
    setClient: (newClient) => { client = newClient; },
    getClient: () => client,
};
