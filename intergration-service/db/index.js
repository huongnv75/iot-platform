const Sequelize = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.database.schemal, config.database.user, config.database.password, {
    host: config.database.ip,
    port: config.database.port,
    dialect: config.database.user,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Error = require("./Error")(sequelize, Sequelize);
db.GroupProduct = require("./GroupProduct")(sequelize, Sequelize);
db.Product = require("./Product")(sequelize, Sequelize);
db.Stage = require("./Stage")(sequelize, Sequelize);
module.exports = db;