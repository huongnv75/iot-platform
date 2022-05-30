const controller = require("./controller");
var router = require('express').Router();

router.get('/', controller.getAllUsers)
    .get('/:id', controller.getAllUsers)
    .post('/', controller.createUser);
module.exports = router;