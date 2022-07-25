var router = require('express').Router();
const scada = require('../../base/scada-apis');

const axios = require("axios");

const config = require("../../config/config");
const constants = require("../../utils/constants");
const global = require('../../utils/globalFunction');
const log = global.getLogger(module);

//GET /api/plugins/telemetry/{entityType}/{entityId}/values/attributes/{scope}{?keys}
router.get('/:entityType/:entityId/values/attributes/:scope', (req, res) => {
    scada.getToken().then(token=>{
        axios({
            url: global.addParamsUrl(config.scada.baseUrl + constants.SCADA_TELEMETRY_GET_ATTRIBUTES_BY_SCOPE, req.params),
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
            params: req.query
        })
            .then(function (response) {
                res.status(200).send(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
                res.status(400).send(error); 
            })

    }).catch((error) => { res.status(400).send(error); });
});
//POST /api/plugins/telemetry/{entityType}/{entityId}/{scope}
router.post('/:entityType/:entityId/:scope', (req, res) => {
    scada.getToken().then(token=>{
        axios({
            url: global.addParamsUrl(config.scada.baseUrl + constants.SCADA_TELEMETRY_POST_ATTRIBUTES_BY_SCOPE_V1, req.params),
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Authorization': 'Bearer ' + token },
            data: req.body
        })
            .then(function (response) {
                res.status(200).send(response.data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.response?.data?.message);                //reject(null);
                res.status(400).send(error); 
            })

    }).catch((error) => { res.status(400).send(error); });
});
module.exports = router;