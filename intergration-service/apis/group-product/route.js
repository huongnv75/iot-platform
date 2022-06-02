const controller = require("./controller");
var router = require('express').Router();

router.get('/', controller.list)
    .get('/:id', controller.getById)
    .post('/', controller.add)
    .put('/:id', controller.update)
    .delete('/:id', controller.delete)
    .post('/add-with-stages', controller.addWithStages)
    .put('/add-stage', controller.addStage)
    .put('/remove-stage', controller.removeStage)
    ;
module.exports = router;