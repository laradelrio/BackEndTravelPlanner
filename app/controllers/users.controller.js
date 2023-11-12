const db = require("..");
const Users = db.Users;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const bcryptjs = require('bcryptjs');

// Create and Save a NEW User WITHOUT CHECKING IF THEIR EMAIL IS ALREADY REGISTERED
exports.create = async (req, res) => {

    let hashedPassword = await bcryptjs.hash(req.body.password, 8);

    //Create User
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
    };

    //Save User in the DB
    Users.create(user)
        .then(data => {
            res.status(201).send({ success: true, message: 'User created Successfully' });
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error creating User' });
        })
}

//Create user if their email is NOT registered
exports.findOrCreate = async (req, res) => {

    let hashedPassword = await bcryptjs.hash(req.body.password, 8);
    
    Users.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            photo: req.body.photo,
        }
    })
    .then((result) => {
        let user = result[0];
        let created = result[1];

        if (!created) {
            res.status(409).send({ success: created, message: 'Email already registered' });
        } else {
            res.status(201).send({ success: true, message: 'User created Successfully' });
        }
    })
    .catch(err => {
        res.status(500).send({ success: false, message: err.message || 'Error creating User' });
    })
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {

    Users.findAll()
        .then(data => {
            if (data === null) {
                res.status(404).send({ success: false, message: 'No Users Found' });
            } else {
                res.status(200).send({ success: true, message: 'Users Found Successfully', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving Users' });
        })

};

//find single User by id
exports.findByPk = (req, res) => {

    const id = req.params.id;

    Users.findByPk(id, { attributes: ['id', 'name', 'email', 'photo'] })
        .then(data => {
            if (data === null) {
                res.status(404).send({ success: false, message: 'User Not Found'});
            } else {
                res.status(200).send({ success: true, message: 'User Found Successfully by ID', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving User' });
        })

};

// Find a single User by email
exports.findOne = async (req, res) => {

    Users.findOne({ where: { email: req.body.email } }, { attributes: ['id', 'name', 'email', 'photo'] })
        .then(data => {
            if (data === null) {
                res.status(404).send({ success: false, message: 'User Not Found'});
            } else {
                res.status(200).send({ success: true, message: 'User Found Successfully by Email', data: data });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving User' });
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