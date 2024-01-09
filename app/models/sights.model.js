module.exports = (sequelize, Sequelize) => {
    const Sights = sequelize.define("sight", {
        name: {
            type: Sequelize.STRING
        },
        fk_trips_id: {
            type: Sequelize.INTEGER,
            references: {    
                model: 'trips',
                key: 'id'
            }
        },
        longitude: {
            type: Sequelize.DECIMAL(8,5)
        },
        latitude: {
            type: Sequelize.DECIMAL(8,5)
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

    return Sights;
};