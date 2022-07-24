const func = require('./function');


var router = require('express').Router();

//api publicAsset là để show thông tin của Attributes Asset trên scada
router.get('/publicAsset', (req, res) => {
    func.getPublicAsset(req.query.name).then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});

router.get('/asset', (req, res) => {
    func.getAssets(req.query.pageSize || 10, req.query.page || 0, req.query.textSearch || '', req.query.type || '').then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});
router.get('/asset/:assetId', (req, res) => {
    func.detailAsset(req.params.assetId).then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});
router.post('/asset', (req, res) => {
    func.createAsset(req.body).then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});
router.put('/asset', (req, res) => {
    func.updateAsset(req.body).then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});
router.delete('/asset/:assetId', (req, res) => {
    func.deleteAsset(req.params.assetId).then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});
module.exports = router;