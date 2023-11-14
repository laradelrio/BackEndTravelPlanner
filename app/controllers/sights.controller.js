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
