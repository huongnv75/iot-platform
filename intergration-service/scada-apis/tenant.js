const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

function deleteGoogleTenant() {
    require('./token').getToken(config.scada.sysadmin, config.scada.sysadminPassword).then(token => {
        axios({
                url: config.scada.baseUrl + constants.SCADA_TENANT_INFO.replace('defaultTenant', 'gmail.com'),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                const data = response.data.data;
                if (data.length > 0) {
                    axios({
                            url: config.scada.baseUrl + constants.SCADA_DELETE_TENANT.replace('tenantId', data[0].id.id),
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
                        })
                        .then(function(response) {
                            log.info(response);
                        })
                        .catch(function(error) {
                            log.error(error.message);
                            console.log(new Error().stack.split('\n')[1].slice(7));
                        })
                }
            })
            .catch(function(error) {
                log.error(error.message);
                console.log(new Error().stack.split('\n')[1].slice(7));
            });
    });
}

module.exports = { deleteGoogleTenant };