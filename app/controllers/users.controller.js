const db = require("..");
const Users = db.Users;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookie = require('cookie');


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
                res.status(404).send({ success: false, message: 'User Not Found' });
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

    Users.findOne({ where: { email: req.body.email } }, { attributes: ['id', 'password'] })
        .then(async data => {
            if (data === null) {
                res.status(404).send({ success: false, message: 'User Not Found' });
            } else {

                let isPasswordValid = await bcryptjs.compare(req.body.password, data.password);

                if (!isPasswordValid) {
                    res.status(401).send({ success: false, message: 'Invalid Password' });
                } else {
                    const token = jwt.sign({
                        id_user: data.id,
                    }, process.env.TOKEN_SECRET, { expiresIn: '15min' })


                    const serialized = cookie.serialize('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict', //prevents the cookie from being sent with cross-site requests
                        maxAge: 60 * 60 * 24 * 30,  // sets the maximum age of the cookie in seconds. here: 30 days
                        path: '/', // cookie is valid for the entire website
                    });
                    res.setHeader('Set-Cookie', serialized); 
                    res.status(200).send({ success: true, message: 'User Found Successfully by Email'});
                    }
            }
            })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving User' });
        })

};

// Validate Token.
exports.validateToken = (req, res) => {
    let token = req.body.token;

    if (token === null) {
        res.status(401).send({ success: false, message: 'Access Denied' });
    } else {
        let secretJWT = process.env.TOKEN_SECRET;
        const verified = jwt.verify(token, secretJWT, (err, decoded) => {
            if (err) {
                res.status(500).send({ success: false, message: 'Access Denied', data: err });
            } else {
                res.status(200).send({ status: true, message: "JWT verified" });
            }
        });
    }
};

// logout
exports.logOut = (req, res) => {

    const  token = req.cookies.token;

    const serialized = cookie.serialize('token', null, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
    });

    res.setHeader('Set-Cookie', serialized);
    res.status(200).send({ status: true, message: "Logged out" });

};



// Update a User field by the id in the request
exports.update = async (req, res) => {
    let userId = req.params.id;
    let updatedField = req.body.field;
    let updatedValue = req.body.value;

    if (updatedField === "password") {
        updatedValue = await bcryptjs.hash(updatedValue, 8);
    }

    await Users.update({ [updatedField]: updatedValue }, {
        where: {
            id: userId,
        },
    })
        .then(data => {
            if (data[0] === 0) {
                res.status(404).send({ success: false, message: 'User Not Found' });
            } else {
                res.status(200).send({ success: true, message: 'User updated successfully' });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error Updating User' });
        })
};

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    let userId = req.params.id;
    await Users.destroy({
        where: {
            id: userId,
        },
    })
        .then(data => {
            if (data === 0) {
                res.status(404).send({ success: false, message: 'User Not Found' });
            } else {
                res.status(200).send({ success: true, message: 'User deleted successfully' });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error Deleting User' });
        })

};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Users
exports.findAllPublished = (req, res) => {

};