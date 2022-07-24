var router = require('express').Router();

router.use('/plugins/telemetry', require('./telemetry'));
module.exports = router;