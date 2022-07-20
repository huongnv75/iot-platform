const scada = require('../scada-apis');
const keycloak = require('../keycloak-apis');

function getAssets(pageSize, page, textSearch, type) {
    return new Promise(function(resolve, reject) {
        scada.getToken().then((token)=>{
            scada.getAssets(token, pageSize, page, textSearch, type).then((data)=>{
                resolve(data);
            })
        })
    });
}


function getPublicAsset(name) {
    return new Promise(function(resolve, reject) {
        scada.getToken().then((token)=>{
            scada.getAssetIdByName(token, name || "COMMON").then((id)=>{
                scada.getAssetAttributesById(token, id).then((data)=>{
                    resolve(data);
                })
            })
        })
    });
}
module.exports = { getAssets, getPublicAsset };