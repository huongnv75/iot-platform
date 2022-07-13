const scada = require('../scada-apis');
const keycloak = require('../keycloak-apis');

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
module.exports = { getPublicAsset };