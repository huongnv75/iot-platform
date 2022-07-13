const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

function getGroups(token) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.keycloak.baseUrl + constants.KEYCLOAK_GROUPS.replace('master', config.keycloak.realmName),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response.data?.message);

                //reject(null);
            })
    });
}

function getGroupRoleMappings(token, groupId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.keycloak.baseUrl + constants.KEYCLOAK_GROUP_ROLE_MAPPINGS.replace('master', config.keycloak.realmName).replace('groupId', groupId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data.map(function (a) { return a.name; }));
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response.data?.message);

                                //reject(null);
            })
    });
}

function getGroupMembers(token, groupId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.keycloak.baseUrl + constants.KEYCLOAK_GROUP_MEMBERS.replace('master', config.keycloak.realmName).replace('groupId', groupId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response.data?.message);
                //reject(null);
            })
    });
}

module.exports = { getGroups, getGroupRoleMappings, getGroupMembers };