var global = {};

const winston = require("winston");
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

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
    return new winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.printf(options => {
                    return `[${getLabel(module)}] ${options.level}: ${options.message}$`;
                })
            })
        ]
    });
}

const getLabel = function(callingModule) {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
};

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