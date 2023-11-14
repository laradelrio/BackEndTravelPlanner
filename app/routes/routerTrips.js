const express = require('express');
const controllers = require('../controllers/trips.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const tripsDto = require('../validators/dto/trip');



// router.get('/', (req, res) => res.send('This is root!'));

//GET

//get all trips
router.get('/' , controllers.findAllTrips);

//get all trips by one user
router.get('/user/:id' , controllers.findAllTripsByUser);

//get Trip by ID
router.get('/:id', controllers.findOneTrip)


//POST
router.post('/', validateDto(tripsDto.registerTrip), controllers.createTrip);

//PUT 
router.put('/update/:id', controllers.updateTrip);

/* CREATE user without checking for registered email:
    router.post('/', validateDto(registerUser), controllers.create); */


module.exports = router;
