const db = require("..");
const Users = db.Users;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

// Create and Save a NEW User
exports.create = (req, res) => {

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
            res.status(201).send({success: true, message: 'User created Successfully', data: data});
        })
        .catch(err => {
            res.status(500).send({success: false, message: err.message || 'Error creating User'})
        })
}



// Retrieve all Users from the database.
exports.findAll = (req, res) => {

};

// Find a single Users with an id
exports.findOne = (req, res) => {

};

// Update a User by the id in the request
exports.update = (req, res) => {

};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Users
exports.findAllPublished = (req, res) => {

};