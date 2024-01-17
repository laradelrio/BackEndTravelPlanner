const db = require("..");
const Users = db.Users;
const Trips = db.Trips;
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");
const bcryptjs = require('bcryptjs');
const tokenFunc = require('../helperFunctions/tokenFunctions');
const sightsController = require('./sights.controller');
const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');
const { urlencoded } = require("express");


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

// login user - by email and password and return token
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
                    tokenFunc.createToken(data.id, res);
                    res.status(200).send({ success: true, message: 'User Found Successfully by Email', data: { id: data.id, } });
                }
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error retrieving User' });
        })

};

// Valid token message
exports.validateToken = (req, res) => {
    res.status(200).send({ status: true, message: "Authorized" });
};

// logout
exports.logOut = (req, res) => {
    tokenFunc.logout(res);
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

    if (updatedField === "email") {
        const existingUser = await Users.findOne({ where: { email: req.body.value } });
        if (existingUser !== null) {
            res.status(403).send({ success: false, message: 'Email Taken' });
            // Stop execution by using return or throwing an error
            return;
        }
    }

    await Users.update({ [updatedField]: updatedValue }, {
        where: {
            id: userId,
        },
    })
        .then(data => {
            if (data[0] === 0) {
                res.status(204).send({ success: false, message: 'User Not Found' });
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

    await deleteTrips(userId, res)

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

function deleteTrips(userId, res) {
    return new Promise(async (resolve, reject) => {
        let trips = await getUserTrips(userId, res)
        if (trips.length != 0) {

            trips.forEach(async (trip) => {
                sightsController.deleteSights(trip.id, res);
                return await Trips.destroy({
                    where: {
                        id: trip.id,
                    },
                })
                    .then(data => { return data, resolve() })
                    .catch(err => {
                        return res.status(500).send({ success: false, message: err.message || 'Error Deleting User TripSights' }, resolve());
                    })

            })
        } else {
            resolve();
        }
    })
}

function getUserTrips(userId, res) {
    return new Promise(async (resolve, reject) => {
        await Trips.findAll({ where: { fk_users_id: userId } })
            .then(data => { resolve(data) })
            .catch(err => {
                resolve(res.status(500).send({ success: false, message: err.message || 'Error Deleting User Trips' }));
            })
    })
}

exports.isEmailRegistered = (req, res) => {
    Users.findOne({ where: { email: req.body.email } })
        .then(async data => {
            if (data === null) {
                res.status(200).send({ success: true, message: 'Email register check successful', data: { emailRegistered: false } });
            } else {
                res.status(200).send({ success: true, message: 'Email register check successful', data: { emailRegistered: true } });
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err.message || 'Error checking if email is registered' });
        })
};

//send reset password email
exports.sendResetPasswordEmail = async (req, res) => {
    console.log('IN SEND EMAIL FUNC')
    let email = req.body.email;
    let user = await getUserNameId(email, res);
    let hashedUserId = await bcryptjs.hash((user.id).toString(), 8);
    let encodedHash = encodeURIComponent(hashedUserId);
    console.log(encodedHash);
    let url = `https://travel-mates.vercel.app/password/reset/${encodedHash}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: email, // Change to your recipient
        from: process.env.SENDER_EMAIL, // Change to your verified sender
        subject: 'Reset your Travel Mates Password',
        text: 're',
        html: `<p> Dear ${user.name}, </p> <br>

            <p> To reset your password, click on the following link: 
                <a href='https://travel-mates.vercel.app/password/reset/${encodedHash}'> Reset Password  </a>
                <a href='${url}'> Reset Password 2  </a>
            </p>
            <p>If you didn't request this, please disregard.</p> <br>

            <p>Best, </p>
            <p>Travel Mates</p>`,
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
};

function getUserNameId(email, res) {
    return new Promise(async (resolve, reject) => {
        Users.findOne({ where: { email: email } }, { attributes: ['id', 'name'] })
            .then(async data => {
                console.log('here')
                resolve({ name: data.name, id: data.id });
            })
            .catch(err => {
                console.log('here3', email)
                res.status(500).send({ success: false, message: err.message || 'Error' });
            })
    })
}

exports.updatePassword = async (req, res) => {
    console.log('here', req.body.email)
    let user = await getUserNameId(req.body.email, res);
    console.log(user)
    let sameUserId = await bcryptjs.compare((user.id).toString(), req.body.encryptedUserId);
    console.log(sameUserId)
    if (!sameUserId) {
        res.status(204).send({ success: false, message: 'Email not associated to this account' });
    } else {
        if (req.body.password !== req.body.passwordConfirmed) {
            res.status(204).send({ success: false, message: 'Passwords are different' });
        } else {
            let newHashedPassword = await bcryptjs.hash(req.body.password, 8);
            await Users.update({ ['password']: newHashedPassword }, {
                where: {
                    email: req.body.email,
                },
            })
                .then(data => {
                    if (data[0] === 0) {
                        res.status(204).send({ success: false, message: 'User Not Found' });
                    } else {
                        res.status(200).send({ success: true, message: 'Password updated successfully' });
                    }
                })
                .catch(err => {
                    res.status(500).send({ success: false, message: err.message || 'Error Updating Password' });
                })
        }
    }
}
