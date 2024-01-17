const express = require('express');
const controllers = require('../controllers/users.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const validateUserAuth = require('../validators/middleware/validate-user-auth');
const usersDto = require('../validators/dto/user');




// router.get('/', (req, res) => res.send('This is root!'));

//GET
//get all users
router.get('/', validateUserAuth.validateUserAuth(), controllers.findAll);

//get user by email
router.post('/byEmail', validateDto(usersDto.loginUser),  controllers.findOne);

//send reset password email
router.post('/sendResetPasswordEmail', controllers.sendResetPasswordEmail);

//reset password 
router.post('/resetPassword', controllers.updatePassword);

//check is email is registered
router.post('/isRegisteredEmail', controllers.isEmailRegistered);

//get user by id
router.get('/:id', validateUserAuth.validateUserAuth(), controllers.findByPk);

//POST
router.post('/', validateDto(usersDto.registerUser), controllers.findOrCreate);

router.post('/token', validateUserAuth.validateUserAuth(), controllers.validateToken);

router.post('/logout', validateUserAuth.validateUserAuth(), controllers.logOut);

//PUT
router.put('/update/:id', validateUserAuth.validateUserAuth(), controllers.update);

//DELETE
router.delete('/delete/:id', validateUserAuth.validateUserAuth(), controllers.delete);



/* CREATE user without checking for registered email:
    router.post('/', validateDto(registerUser), controllers.create); */


module.exports = router;
