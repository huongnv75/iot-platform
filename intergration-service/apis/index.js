var router = require('express').Router();

router.use('/error', require('./error'));

module.exports = router;