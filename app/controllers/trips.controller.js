const db = require("..");
const Trips = db.Trips;
const Sights = db.Sights;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const dotenv = require('dotenv');
const { deleteSight } = require("./sights.controller");

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
                res.status(204).send({ success: false, message: 'No Trips Found' });
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

exports.findAllTripMatches = (req, res) => {
    
    const tripStartDate = req.body.startDate;
    const tripEndDate = req.body.endDate;

    Trips.findAll({
        where: {
            destination: req.body.destination,
            [Op.and]: [
                {
                    [Op.or]: [
                        { 
                            [Op.and]: [
                            {startDate: { [Op.lte]: tripStartDate }},
                            {endDate: { [Op.gte]: tripStartDate } }
                            ]
                        },
                        { 
                            [Op.and]: [
                                { 
                                    [Op.and]:[
                                    {
                                        [Op.and]: [
                                            {startDate: { [Op.gte]: tripStartDate }},
                                            {startDate: { [Op.lte]: tripEndDate } }
                                        ]
                                    },
                                    { endDate: {[Op.gte]: tripEndDate} }
                                ]}
                            ]
                        },
                        { 
                            [Op.and]: [
                                { 
                                    [Op.and]:[
                                    {
                                        [Op.and]: [
                                            {startDate: { [Op.gte]: tripStartDate }},
                                            {startDate: { [Op.lte]: tripEndDate } }
                                        ]
                                    },
                                    { endDate: {[Op.lte]: tripEndDate} }
                                ]}
                            ]
                        },
                        {
                            [Op.and]: [
                                {startDate: { [Op.gte]: tripStartDate }},
                                {endDate: { [Op.lte]: tripEndDate } }
                                ]  
                        },
                        {
                            [Op.and]: [
                                {startDate: { [Op.lte]: tripStartDate }},
                                {endDate: { [Op.gte]: tripEndDate } }
                                ]  
                        }
                    ]
                },
                { fk_users_id: { [Op.ne]: req.params.id } },
            ]
        }})
        .then(users => {
            if (users.length === 0) {
                res.status(200).send({ success: false, message: 'No Matches Found' });
            } else {
                res.status(200).send({ success: true, message: 'Matches Found Successfully', data: users});
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving Matches' });
        })
}

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
    await deleteSights(tripId, res);
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

function deleteSights(tripId, res){ 
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