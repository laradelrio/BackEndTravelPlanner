const db = require("..");
const Trips = db.Trips;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const dotenv = require('dotenv');

// Create and Save a NEW Trip
exports.createTrip = async (req, res) => {

    console.log(req.body.user)
    //Create User
    const trip = {
        name: req.body.name,
        fk_users_id: req.body.user,
        destination: req.body.destination,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        photo: req.body.photo,
    };

    //Save User in the DB
    Trips.create(trip)
        .then(data => {
            res.status(201).send({ success: true, message: 'Trip created Successfully' });
        })
        .catch(err => {
            res.status(500).send({ success: false, message: 'Error creating Trip' });
        })
}



