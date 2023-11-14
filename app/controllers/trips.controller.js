const db = require("..");
const Trips = db.Trips;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const dotenv = require('dotenv');

// Create and Save a NEW Trip
exports.createTrip = async (req, res) => {

    const trip = {
        name: req.body.name,
        fk_users_id: req.body.user,
        destination: req.body.destination,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        photo: req.body.photo,
    };

    Trips.create(trip)
        .then(data => {
            res.status(201).send({ success: true, message: 'Trip created Successfully' });
        })
        .catch(err => {
            res.status(500).send({ success: false, message: 'Error creating Trip' });
        })
}

// Retrieve all Trips from the database.
exports.findAllTrips = (req, res) => {

    Trips.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({ success: false, message: 'No Trips Found' });
            } else {
                res.status(200).send({ success: true, message: 'Trips Found Successfully', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving Trips' });
        })

};

// Retrieve all Trips by USER from the database.
exports.findAllTripsByUser = (req, res) => {

    Trips.findAll({ where: { fk_users_id: req.params.id } })
        .then(data => {
            if (data.length === 0) {
                res.status(404).send({ success: false, message: 'No Trips Found' });
            } else {
                res.status(200).send({ success: true, message: 'Trips Found Successfully', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving Trips' });
        })

};


// Retrieve One trip by ID.
exports.findOneTrip = (req, res) => {

    Trips.findOne({ where: { id: req.params.id } })
        .then(data => {
            if (data === null) {
                res.status(404).send({ success: false, message: 'No Trips Found' });
            } else {
                res.status(200).send({ success: true, message: 'Trips Found Successfully', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving Trips' });
        })

};

//update Trip
exports.updateTrip = async (req, res) => {
    let eventId = req.params.id;
    let updatedField = req.body.field;
    let updatedValue = req.body.value;

    await Trips.update({ [updatedField]: updatedValue }, {
        where: {
            id: eventId,
        },
    })
        .then(data => {
            if (data[0] === 0) {
                res.status(404).send({ success: false, message: 'Trip Not Found' });
            } else {
                res.status(200).send({ success: true, message: 'Trip updated successfully' });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error Updating Trip' });
        })
};

//delete Trip by ID
exports.deleteTrip = async (req, res) => {
    let tripId = req.params.id;
    await Trips.destroy({
        where: {
            id: tripId,
        },
    })
        .then(data => {
            if (data === 0) {
                res.status(404).send({ success: false, message: 'Trip Not Found' });
            } else {
                res.status(200).send({ success: true, message: 'Trip deleted successfully' });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error Deleting Trip' });
        })

};