const config = require("../../config/config");
const global = require('../../utils/globalFunction');
const log = global.getLogger(module);
const Sequelize = require("sequelize");


const sequelize = new Sequelize(config.database.schemal, config.database.user, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

function deleteLog() {
    return new Promise(function (resolve, reject) {
        sequelize.query('truncate event, audit_log', {
            logging: false
        })
            .then(function (data) {
                resolve(data);
            })
            .catch(function (error) {
                log.error(new Error().stack.split('\n')[1].slice(7).split(":")[1] + '###' + error.message);                //reject(null);
            })
    });
}
module.exports = { deleteLog };