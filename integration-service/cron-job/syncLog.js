const scada = require("../base/scada-apis");

function deleteLogDatabase() {
    scada.deleteLog().then(data => {
    })
}
module.exports = { deleteLogDatabase }