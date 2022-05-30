module.exports = (sequelize, Sequelize) => {
    return sequelize.define("product", {
        camera_name: {
            type: Sequelize.STRING
        },
        source_url: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.STRING
        },
        lng: {
            type: Sequelize.STRING
        },
        configs: {
            type: Sequelize.STRING(10000)
        },
        infomations: {
            type: Sequelize.STRING(10000)
        },
        createdBy: {
            type: Sequelize.INTEGER
        }
    }, {
        tableName: 'i_product'
    });
};