const axios = require("axios");

const config = require("../../config/config");
const constants = require("../../utils/constants");
const global = require('../../utils/globalFunction');
const log = global.getLogger(module);

function deleteAsset(token, assetId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_DELETE_ASSET.replace('assetId', assetId),
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
            })
    });
}

function updateAsset(token, id, name, type, label, description) {
    return new Promise(function (resolve, reject) {
        detailAsset(token, id).then((data) => {
            data.name = name;
            data.type = type;
            data.label = label;
            data.additionalInfo.description = description;
            axios({
                url: config.scada.baseUrl + constants.SCADA_CREATE_AND_UPDATE_ASSET,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
                data: data
            })
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(function (error) {
                    log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
                })
        })
    });
}
function detailAsset(token, assetId) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_DETAIL_ASSET.replace('assetId', assetId),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error.message);
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
            })
    });
}

function creatAsset(token, name, type, label, description) {
    return new Promise(function (resolve, reject) {
        let data = { "name": name, "type": type, "label": label, "additionalInfo": { "description": description } }
        axios({
            url: config.scada.baseUrl + constants.SCADA_CREATE_AND_UPDATE_ASSET,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
            data: data
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
            })
    });
}

function getAssets(token, _pageSize_, _page_, _textSearch_, _type_) {
    return new Promise(function (resolve, reject) {
        axios({
            url: config.scada.baseUrl + constants.SCADA_GET_ASSETS.replace('_pageSize_', _pageSize_).replace('_page_', _page_).replace('_textSearch_', _textSearch_).replace('_type_', _type_),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token }
        })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
            })
    });
}


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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
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
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
            })
    });
}

module.exports = { getAssets, detailAsset, creatAsset, updateAsset, deleteAsset, getAssetIdByName, getAssetAttributesById };