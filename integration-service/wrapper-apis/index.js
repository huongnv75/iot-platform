var router = require('express').Router();

router.use('/plugins/telemetry', require('./telemetry'));
router.use('/widgetType', require('./widget-type'));

module.exports = router;