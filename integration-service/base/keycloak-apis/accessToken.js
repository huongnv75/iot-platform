const axios = require("axios");

const config = require("../../config/config");
const constants = require("../../utils/constants");
const global = require('../../utils/globalFunction');
const log = global.getLogger(module);

function getAccessToken() {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.keycloak.baseUrl + constants.KEYCLOAK_ACCESS_TOKEN,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: global.formUrlEncoded({
                    username: config.keycloak.admin,
                    password: config.keycloak.password,
                    client_id: 'admin-cli',
                    grant_type: 'password'
                })
            })
            .then(function(response) {
                resolve(response.data.access_token);
            })
            .catch(function(error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
            })
    });
}
module.exports = { getAccessToken };