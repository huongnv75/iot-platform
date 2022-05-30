module.exports = (sequelize, Sequelize) => {
    return sequelize.define("group_product", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        personId: {
            type: Sequelize.INTEGER
        },
        faceTokens: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        imageUrls: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        facesetId: {
            type: Sequelize.INTEGER
        },
        createdBy: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'i_group_product'
    });
};