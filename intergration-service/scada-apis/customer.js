const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
            })
    });
}

module.exports = { getCustomers, createCustomer };