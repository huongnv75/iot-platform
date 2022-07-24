const func = require('./function');


var router = require('express').Router();

router.get('/', (req, res) => {
    func.getRoles(req.query.user).then((data) => {
        res.status(200).send(data);
    }).catch((error) => { res.status(400).send(error); });
});
module.exports = router;