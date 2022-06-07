const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

function redirectOauth2() {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_OAUTH2,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}
module.exports = { redirectOauth2 };