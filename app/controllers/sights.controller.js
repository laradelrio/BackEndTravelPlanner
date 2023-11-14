const db = require("..");
const Sights = db.Sights;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const dotenv = require('dotenv');


// Create and Save a NEW Trip
exports.createSight = async (req, res) => {

    //Create User
    const sight = {
        name: req.body.name,
        fk_trips_id: req.body.fk_trips_id,
        longitude: req.body.longitude, 
        latitude: req.body.latitude,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        photo: req.body.photo,
    };

    //Save User in the DB
    Sights.create(sight)
        .then(data => {
            res.status(201).send({ success: true, message: 'Sight created Successfully' });
        })
        .catch(err => {
            res.status(500).send({ success: false, message: 'Error creating Sight' });
        })
}