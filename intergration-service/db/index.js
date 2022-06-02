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

// mỗi sản phẩm thuộc về một nhóm sản phẩm
// một nhóm sản phẩm có thể chứa nhiều sản phẩm
//1-N
db.GroupProduct.hasMany(db.Product);
db.Product.belongsTo(db.GroupProduct);

// mỗi nhóm sản phẩm chứa nhiều công đoạn
// mỗi công đoạn có thể nằm trong nhiều nhóm sản phẩm
//N-N
db.GroupProduct.belongsToMany(db.Stage, { through: 'GroupProductStages' });
db.Stage.belongsToMany(db.GroupProduct, { through: 'GroupProductStages' });

//mỗi công đoạn chứa nhiều lỗi
// mỗi lỗi có thể nằm trong nhiều công đoạn
//N-N
db.Stage.belongsToMany(db.Error, { through: 'StageErrors' });
db.Error.belongsToMany(db.Stage, { through: 'StageErrors' });

module.exports = db;