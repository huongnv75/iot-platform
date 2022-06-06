var global = {};

const winston = require("winston");
const yaml = require('js-yaml');
const fs = require('fs');

global.formUrlEncoded = function formUrlEncoded(x) {
    return Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');
}

global.contain = function contain(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}

global.getLogger = function getLogger(module) {
    let path = module.filename.split('/').slice(-2).join('/');

    return new winston.createLogger({
        transports: [
            new winston.transports.Console({
                timestamp: () => {
                    return new Date().toLocaleTimeString();
                },
                colorize: true,
                level: 'debug',
                label: path
            })
        ]
    });
}

global.yamlToJson = function yamlToJson(fileLink) {
    try {
        const doc = yaml.load(fs.readFileSync(fileLink, 'utf8'));
        return doc;
    } catch (e) {
        return null;
    }
}

global.jsonToYaml = function jsonToYaml(jsonData, fileLink) {
    fs.writeFile(fileLink, yaml.dump(jsonData), (err) => {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = global;
