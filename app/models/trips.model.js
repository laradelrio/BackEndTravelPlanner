module.exports = (sequelize, Sequelize) => {
    const Trips = sequelize.define("trips", {
        name: {
            type: Sequelize.STRING
        },
        fk_users_id: {
            type: Sequelize.INTEGER,
            references: {         // User belongsTo Company 1:1
                model: 'users',
                key: 'id'
            }
        },
        destination: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATE
        },
        endDate: {
            type: Sequelize.DATE
        },
        photo: {
            type: Sequelize.STRING
        },
    });

    return Trips;
};