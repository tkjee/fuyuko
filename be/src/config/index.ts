import {i, e} from "../logger";

const regexp = /--(.*)=(.*)/;
const SelfReloadJson = require('self-reload-json');

const overrideWithProcessArgv = (config: any) => {
    const args: string[] = process.argv.slice(2);
    for (const arg of args) {
        const match: string[] = arg.match(regexp);
        if (match && match.length == 3) {
            try {
                config[match[1]] = JSON.parse(match[2]);
            } catch (err) {
                config[match[1]] = (match[2]);
                e(`failed to parse value ${match[2]} for overriding property ${match[1]} using value as is`, err);
            }
            i(`Command line arguments ${match[1]}=${match[2]} will override the one in config.json`);
        }
    }
};

const config = new SelfReloadJson(require('path').resolve(__dirname, './config.json'));
overrideWithProcessArgv(config);
config.on('updated', function(json: any) {
    overrideWithProcessArgv(config);
});

export default config;
