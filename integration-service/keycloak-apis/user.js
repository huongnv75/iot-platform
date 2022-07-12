const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

function getUsers(token, search) {
    let url = config.keycloak.baseUrl + constants.KEYCLOAK_USERS.replace('master', config.keycloak.realmName);
    if(search){
        url += '&search=' + search;
    }
    return new Promise(function(resolve, reject) {
        axios({
                url: url,
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                if (error.response?.status != 401) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }                //reject(null);
            })
    });
}

function getUserRoleMappings(token, userId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.keycloak.baseUrl + constants.KEYCLOAK_USER_ROLE_MAPPINGS.replace('master', config.keycloak.realmName).replace('userId', userId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data.map(function(a) { return a.name; }));
            })
            .catch(function(error) {
                if (error.response?.status != 401) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }                //reject(null);
            })
    });
}
module.exports = { getUsers, getUserRoleMappings };