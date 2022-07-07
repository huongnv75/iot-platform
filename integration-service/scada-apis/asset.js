const axios = require("axios");

const config = require("../config/config");
const constants = require("../utils/constants");
const global = require('../utils/globalFunction');
const log = global.getLogger(module);

function getAssetIdByName(token, name) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_GET_ASSET_ID_BY_NAME.replace('name', name),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                const data = response.data.data[0];
                resolve(data.id.id);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

function getAssetAttributesById(token, assetId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_GET_ASSET_ATTRIBUTES_BY_ID.replace('assetId', assetId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                const data = response.data[0];
                resolve(data.value);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '@' + error.message);
                //reject(null);
            })
    });
}

module.exports = { getAssetIdByName, getAssetAttributesById };