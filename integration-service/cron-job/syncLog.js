const global = require("../utils/globalFunction");
const constants = require("../utils/constants");
const scada = require("../scada-apis");

function deleteLogDatabase() {
    scada.deleteLog().then(data => {
    })
}
module.exports = { deleteLogDatabase }