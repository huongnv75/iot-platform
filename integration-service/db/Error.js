module.exports = (sequelize, Sequelize) => {
    return sequelize.define("error", {
        name: {
            type: Sequelize.STRING
        },
        label: {
            type: Sequelize.STRING
        },
        checked: {
            type: Sequelize.BOOLEAN
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