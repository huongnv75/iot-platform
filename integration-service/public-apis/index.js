var router = require('express').Router();

router.use('/role', require('./role'));
router.use('/asset', require('./asset'));

module.exports = router;