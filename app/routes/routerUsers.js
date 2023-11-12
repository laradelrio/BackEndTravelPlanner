const express = require('express');
const controllers = require('../controllers/users.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const usersDto = require('../validators/dto/user')
const registerUser = require('../validators/dto/user');


// router.get('/', (req, res) => res.send('This is root!'));

//GET
//get all users
router.get('/' , controllers.findAll);

//get user by email
router.get('/byEmail', controllers.findOne);

//get user by id
router.get('/:id' , controllers.findByPk);



//POST
router.post('/', validateDto(registerUser), controllers.findOrCreate);

//POST
router.put('/update/:id', controllers.update);

/* CREATE user without checking for registered email:
    router.post('/', validateDto(registerUser), controllers.create); */


module.exports = router;
