const db = require("..");
const Sights = db.Sights;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const dotenv = require('dotenv');


exports.createSight = async (req, res) => {

    const sight = {
        name: req.body.name,
        fk_trips_id: req.body.fk_trips_id,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        photo: req.body.photo,
    };

    Sights.create(sight)
        .then(data => {
            res.status(201).send({ success: true, message: 'Sight created Successfully' });
        })
        .catch(err => {
            res.status(500).send({ success: false, message: 'Error creating Sight' });
        })
}

exports.findAllSightsByTrip = (req, res) => {

    Sights.findAll({ where: { fk_trips_id: req.params.id } })
        .then(data => {
            if (data.length === 0) {
                res.status(200).send({ success: false, message: 'No Sights Found' });
            } else {
                res.status(200).send({ success: true, message: 'Sights Found Successfully', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving Sights' });
        })

};

exports.updateSight = async (req, res) => {
    let sightId = req.params.id;
    let updatedField = req.body.field;
    let updatedValue = req.body.value;

    await Sights.update({ [updatedField]: updatedValue }, {
        where: {
            id: sightId,
        },
    })
        .then(data => {
            if (data[0] === 0) {
                res.status(404).send({ success: false, message: 'Sight Not Found' });
            } else {
                res.status(200).send({ success: true, message: 'Sight updated successfully' });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error Updating Sight' });
        })
};

exports.deleteSight = async (req, res) => {
    let sightId = req.params.id;
    await Sights.destroy({
        where: {
            id: sightId,
        },
    })
        .then(data => {
            if (data === 0) {
                res.status(404).send({ success: false, message: 'Sight Not Found' });
            } else {
                res.status(200).send({ success: true, message: 'Sight deleted successfully' });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error Deleting Sight' });
        })

};

exports.percentageSightMatch = async (req, res) => {
    let trip1 = req.body.trip1
    let trip2 = req.body.trip2

    const sqlQuery = `
    SELECT
        (SUM(CASE WHEN sight_count = 2 THEN 1 ELSE 0 END) * 100) / COUNT(DISTINCT name) AS match_percentage
    FROM (
        SELECT
            name,
            COUNT(name) AS sight_count
        FROM sights
        WHERE fk_trips_id IN (?, ?)
        GROUP BY name
    ) AS sight_counts`;

    try {
        const [data] = await Sights.sequelize.query(sqlQuery, {
            replacements: [trip1, trip2],
            type: Sights.sequelize.QueryTypes.SELECT
        });

        if (!data || data.length === 0) {
            res.status(404).send({ success: false, message: 'Sights Not Found' });
        } else {
            res.status(200).send({ success: true, message: 'Match Calculated Successfully', data: { matchPercentage: data.match_percentage } });
        }
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || 'Error Calculating Match' });
    }
};

//delete all the sights in one trip
exports.deleteSights = (tripId, res) =>{ 
    return new Promise (async (resolve, reject) => {
        await Sights.destroy({
            where: {
                fk_trips_id: tripId,
            },
        })
            .then(data => {
                    resolve();
            })
            .catch(err => {
                resolve(res.status(500).send({ success: false, message: err.message || 'Error Deleting Trip and Sights' }));
            })
    })
}