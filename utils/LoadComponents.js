const fs = require('node:fs');
const path = require('node:path');
const Logger = require('./log');
const log = new Logger();

module.exports = (client, moderation) => {
    const componentsPath = path.join(__dirname, '../components');
    const componentFolders = fs.readdirSync(componentsPath).filter(file => fs.lstatSync(path.join(componentsPath, file)).isDirectory());

    for (const folder of componentFolders) {
        const files = fs.readdirSync(path.join(componentsPath, folder)).filter(file => file.endsWith('.js'));
        for (const file of files) {
            const filePath = path.join(componentsPath, folder, file);
            try {
                const component = require(filePath);
                component(client, log, moderation);
                log.info(`Loaded component: ${file}`);
            } catch (error) {
                log.error(`Error loading component ${file}: ${error.message}`);
            }
        }
    }
};
