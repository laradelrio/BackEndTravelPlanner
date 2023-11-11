const db = require("..");
const Users = db.Users;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

// Create and Save a NEW User
exports.create = (req, res) => {

       //Validate request
    if (!req.body.username) {
        res.status(400).send({
            message: 'User content can not be empty'
        });
        return
    }

    //Create User
    const user = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        photo: req.body.photo,
    };

    //Save User in the DB
    Users.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || 'Error creating User'
            })
        })
}



// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};