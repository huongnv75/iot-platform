const scada = require('../scada-apis');
const keycloak = require('../keycloak-apis');

function getAssets(pageSize, page, textSearch, type) {
    return new Promise(function (resolve, reject) {
        scada.getToken().then((token) => {
            scada.getAssets(token, pageSize, page, textSearch, type).then((data) => {
                resolve(data);
            })
        })
    });
}
function createAsset(info) {
    return new Promise(function (resolve, reject) {
        scada.getToken().then((token) => {
            scada.creatAsset(token, info.name, info.type, info.label || '', info.description || '').then((data) => {
                resolve(data);
            })
        })
    });
}

function updateAsset(info) {
    return new Promise(function (resolve, reject) {
        scada.getToken().then((token) => {
            scada.updateAsset(token, info.id, info.name, info.type, info.label, info.description).then((data) => {
                resolve(data);
            })
        })
    });
}
function deleteAsset(id) {
    return new Promise(function (resolve, reject) {
        scada.getToken().then((token) => {
            scada.deleteAsset(token, id).then((data) => {
                resolve(data);
            })
        })
    });
}

function detailAsset(id) {
    return new Promise(function (resolve, reject) {
        scada.getToken().then((token) => {
            scada.detailAsset(token, id).then((data) => {
                resolve(data);
            })
        })
    });
}

function getPublicAsset(name) {
    return new Promise(function (resolve, reject) {
        scada.getToken().then((token) => {
            scada.getAssetIdByName(token, name || "COMMON").then((id) => {
                scada.getAssetAttributesById(token, id).then((data) => {
                    resolve(data);
                })
            })
        })
    });
}
module.exports = { getAssets, createAsset, updateAsset, deleteAsset, detailAsset, getPublicAsset };