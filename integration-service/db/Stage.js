module.exports = (sequelize, Sequelize) => {
    return sequelize.define("stage", {
        name: {
            type: Sequelize.STRING
        },
        index: {
            type: Sequelize.STRING       
        },
        code: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        createdBy: {
            type: Sequelize.INTEGER
        },
        updatedBy: {
            type: Sequelize.INTEGER
        }
    });
};