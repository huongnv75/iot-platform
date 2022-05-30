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

function getCustomers(token) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_GET_CUSTOMERS,
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                const data = response.data.data;
                resolve(data.map(function(a) { return { name: a.name, id: a.id.id } }));
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

function createCustomer(token, name) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_CREATE_CUSTOMER,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
                data: {
                    title: name
                }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
            })
    });
}

function getUsers(token, customerId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_GET_USERS.replace('customerId', customerId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                resolve(response.data.data);
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

function createUser(token, customer, email) {
    return new Promise(function(resolve, reject) {
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
                        defaultDashboardFullscreen: true,
                        homeDashboardId: null,
                        homeDashboardHideToolbar: true
                    },
                }
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
            })
    });
}

function updateDefaultDashboardUser(token, user, defaultDashboardId) {
    return new Promise(function(resolve, reject) {
        user.additionalInfo.defaultDashboardId = defaultDashboardId;
        user.additionalInfo.defaultDashboardFullscreen = true;
        user.additionalInfo.homeDashboardHideToolbar = true;
        axios({
                url: config.scada.baseUrl + constants.SCADA_CREATE_AND_UPDATE_USER,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
                data: user
            })
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
            })
    });
}

function activeUser(token, user) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_ACTIVE_USER.replace('userId', user.id.id),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
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

function deleteUser(token, userId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_UPDATE_DASHBOARD.replace('userId', userId),
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
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

function deleteGoogleTenant() {
    getToken(config.scada.sysadmin, config.scada.sysadminPassword).then(token => {
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
                        })
                }
            })
            .catch(function(error) {
                log.error(error.message);
            });
    });
}

function getAllDashboards(token) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_ALL_DASHBOARDS,
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                const data = response.data.data;
                resolve(data.map(function(a) { return { name: a.name, id: a.id.id } }));
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

function getCustomerDashboards(token, customerId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_CUSTOMER_DASHBOARDS.replace('customerId', customerId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                const data = response.data.data;
                resolve(data.map(function(a) { return { name: a.name, id: a.id.id } }));
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

function assignDashboard(token, customerId, dashboardId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_UPDATE_DASHBOARD.replace('customerId', customerId).replace('dashboardId', dashboardId),
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
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

function unAssignDashboard(token, customerId, dashboardId) {
    console.log('aa--->', constants.SCADA_UPDATE_DASHBOARD.replace('customerId', customerId).replace('dashboardId', dashboardId));
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_UPDATE_DASHBOARD.replace('customerId', customerId).replace('dashboardId', dashboardId),
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
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

function redirectOauth2() {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_OAUTH2,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(function(response) {
                console.log(response.data);
                resolve(response.data);
            })
            .catch(function(error) {
                log.error(error.message);
                reject(null);
            })
    });
}

module.exports = {
    getToken: getToken,
    getCustomers: getCustomers,
    createCustomer: createCustomer,
    getUsers: getUsers,
    createUser: createUser,
    updateDefaultDashboardUser: updateDefaultDashboardUser,
    activeUser: activeUser,
    deleteUser: deleteUser,
    deleteGoogleTenant: deleteGoogleTenant,
    getAllDashboards: getAllDashboards,
    getCustomerDashboards: getCustomerDashboards,
    assignDashboard: assignDashboard,
    unAssignDashboard: unAssignDashboard,
    redirectOauth2: redirectOauth2
}