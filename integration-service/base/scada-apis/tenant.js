const axios = require("axios");

const config = require("../../config/config");
const constants = require("../../utils/constants");
const global = require('../../utils/globalFunction');
const log = global.getLogger(module);

function deleteGoogleTenant(token) {
    getTenantInfos(token, 'gmail.com').then(data => {
        if(data.length > 0){
            axios({
                url: config.scada.baseUrl + constants.SCADA_DELETE_TENANT.replace('tenantId', data[0].id.id),
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
                .then(function (response) {
                })
                .catch(function (error) {
                    if (error.response?.status != 401) {
                        log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                    }                })
        }
    });
}
function getTenantInfos(token, tenantName) {
    return new Promise(function(resolve, reject) {
        let tenantInfos = constants.SCADA_TENANT_INFO;
        if (tenantName) {
            tenantInfos += '&textSearch=' + tenantName;
        }
        if(token){
            axios({
                url: config.scada.baseUrl + tenantInfos,
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
                .then(function (response) {
                    resolve(response.data.data);
                })
                .catch(function (error) {
                    if (error.response?.status != 401) {
                        log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                    }                });
        } else {
            require('./token').getToken(config.scada.sysadmin, config.scada.sysadminPassword).then(token => {
                axios({
                    url: config.scada.baseUrl + tenantInfos,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
                })
                    .then(function (response) {
                        resolve(response.data.data);
                    })
                    .catch(function (error) {
                        if (error.response?.status != 401) {
                            log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                        }                    });
            });
        }
    });
}
module.exports = { deleteGoogleTenant, getTenantInfos };