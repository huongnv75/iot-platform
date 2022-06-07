var router = require('express').Router();

router.use('/error', require('./error'));
router.use('/group-product', require('./group-product'));
router.use('/product', require('./product'));
router.use('/stage', require('./stage'));

module.exports = router;