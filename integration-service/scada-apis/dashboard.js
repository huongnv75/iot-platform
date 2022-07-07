const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

function getHomeDashboard(token) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_HOME_DASHBOARD,
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

function getTenantDashboards(token, tenantId) {
    return new Promise(function(resolve, reject) {
        axios({
                url: config.scada.baseUrl + constants.SCADA_TENANT_DASHBOARDS.replace('tenantId', tenantId),
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
            })
            .then(function(response) {
                const data = response.data.data;
                resolve(data.map(function(a) { return { name: a.name, id: a.id.id } }));
            })
            .catch(function(error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

function unAssignDashboard(token, customerId, dashboardId) {
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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

function updateDefaultDashboardUser(token, user, defaultDashboardId) {
    return new Promise(function(resolve, reject) {
        user.additionalInfo.defaultDashboardId = defaultDashboardId;
        user.additionalInfo.defaultDashboardFullscreen = false;
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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
            })
    });
}

module.exports = { getAllDashboards, getHomeDashboard, getCustomerDashboards, getTenantDashboards, assignDashboard, unAssignDashboard, updateDefaultDashboardUser };