const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);


function getCustomerUsers(token, customerId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_GET_CUSTOMER_USERS.replace('customerId', customerId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data.data);
            })
            .catch(function (error) {
                if (error.response?.status != 401) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }                //reject(null);
            })
    });
}

function createCustomerUser(token, customer, email) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_CREATE_AND_UPDATE_USER,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
            data: {
                customerId: customer.id,
                tenantId: customer.tenantId,
                email: email,
                authority: "CUSTOMER_USER",
                additionalInfo: {
                    description: "",
                    defaultDashboardId: null,
                    defaultDashboardFullscreen: false,
                    homeDashboardId: null,
                    homeDashboardHideToolbar: true
                },
            }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                if (error.response?.status != 401 && error.response?.status != 400) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }            })
    });
}

function getTenantUsers(token, tenantId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_GET_TENANT_USERS.replace('tenantId', tenantId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data.data);
            })
            .catch(function (error) {
                if (error.response?.status != 401) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }                //reject(null);
            })
    });
}

function createTenantUser(token, tenantId, email) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_CREATE_AND_UPDATE_USER,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
            data: {
                tenantId: tenantId,
                email: email,
                authority: "TENANT_ADMIN",
                additionalInfo: {
                    description: "",
                    defaultDashboardId: null,
                    defaultDashboardFullscreen: false,
                    homeDashboardId: null,
                    homeDashboardHideToolbar: true
                },
            }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                if (error.response?.status != 401) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }            })
    });
}

function deleteUser(token, userId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_UPDATE_DASHBOARD.replace('userId', userId),
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                if (error.response?.status != 401) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                }                //reject(null);
            })
    });
}

function activeUser(token, user) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_ACTIVE_USER.replace('userId', user.id.id),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);

            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

module.exports = { getCustomerUsers, createCustomerUser, getTenantUsers, createTenantUser, deleteUser, activeUser };