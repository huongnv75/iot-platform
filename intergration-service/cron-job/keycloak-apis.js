const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
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
                log.error(error.message);
                reject(null);
            })
    });
}

function getUsers(token) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.keycloak.baseUrl + constants.KEYCLOAK_USERS.replace('master', config.keycloak.realmName),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
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
                log.error(error.message);
                reject(null);
            })
    });
}

function getGroups(token) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.keycloak.baseUrl + constants.KEYCLOAK_GROUPS.replace('master', config.keycloak.realmName),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

function getGroupRoleMappings(token, groupId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.keycloak.baseUrl + constants.KEYCLOAK_GROUP_ROLE_MAPPINGS.replace('master', config.keycloak.realmName).replace('groupId', groupId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data.map(function(a) { return a.name; }));
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

function getGroupMembers(token, groupId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.keycloak.baseUrl + constants.KEYCLOAK_GROUP_MEMBERS.replace('master', config.keycloak.realmName).replace('groupId', groupId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}



module.exports = {
    getAccessToken: getAccessToken,
    getUsers: getUsers,
    getUserRoleMappings: getUserRoleMappings,
    getGroups: getGroups,
    getGroupRoleMappings: getGroupRoleMappings,
    getGroupMembers: getGroupMembers
}