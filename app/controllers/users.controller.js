const db = require("..");
const Users = db.Users;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const bcryptjs = require('bcryptjs');

// Create and Save a NEW User
exports.create = async (req, res) => {

    let hashedPassword = await bcryptjs.hash(req.body.password, 8);

     //Create User
    const user = {
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
    };

    //Save User in the DB
    Users.create(user)
        .then(data => {
            res.status(201).send({success: true, message: 'User created Successfully'});
        })
        .catch(err => {
            res.status(500).send({success: false, message: err.message || 'Error creating User'});
        })
}



// Retrieve all Users from the database.
exports.findAll = (req, res) => {

};

//find user by id
exports.findByPk = (req, res) => {

    const id = req.params.id;

    Users.findByPk(id, {attributes: ['id', 'name', 'email', 'photo']})
        .then(data => {
            if(data === null){
                res.status(404).send({success: false, message: 'User Not Found', data: data});
            }else{
                res.status(200).send({success: true, message: 'User Found Successfully by ID', data: data});
            }
        })
        .catch(err => {
            res.status(500).send({success: false, message: err.message || 'Error retrieving User'});
        })
    

};

// Find a single User by email
exports.findOne = async (req, res) => {

    Users.findOne({ where: { email: req.body.email } }, {attributes: ['id','name', 'email', 'photo']})
        .then(data => {
            if(data === null){
                res.status(404).send({success: false, message: 'User Not Found', data: data});
            }else{
                res.status(200).send({success: true, message: 'User Found Successfully by Email', data: data});
            }
        })
        .catch(err => {
            res.status(500).send({success: false, message: err.message || 'Error retrieving User'});
        })
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