const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

function getToken(username, password) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_LOGIN,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: {
                    username: username || config.scada.tenant,
                    password: password || config.scada.tenantPassword
                }
            })
            .then(function(response) {
                resolve(response.data.token);
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}
module.exports = {getToken};