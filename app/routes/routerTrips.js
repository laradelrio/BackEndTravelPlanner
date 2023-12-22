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


//get all users same place and time
router.post('/matches/:id', controllers.findAllTripMatches);
// router.get('/users-trip/:id', async(req, res)=>{
//     let tripId = req.params.id;
//     let response = await controllers.findAllUsersSameTripTime;
//     res.send(response);
// })


//get Trip by ID
router.get('/:id', controllers.findOneTrip);

//POST
router.post('/', validateDto(tripsDto.registerTrip), controllers.createTrip);

//PUT 
router.put('/update/:id', controllers.updateTrip);

//DELETE
router.delete('/delete/:id', controllers.deleteTrip);

/* CREATE user without checking for registered email:
    router.post('/', validateDto(registerUser), controllers.create); */


module.exports = router;
