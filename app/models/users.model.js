module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        photo: {
            type: Sequelize.STRING
        }
    });

    return Users;
};