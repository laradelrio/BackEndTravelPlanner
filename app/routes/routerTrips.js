const express = require('express');
const controllers = require('../controllers/trips.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const tripsDto = require('../validators/dto/trip');



// router.get('/', (req, res) => res.send('This is root!'));



//POST
router.post('/', validateDto(tripsDto.registerTrip), controllers.createTrip);

/* CREATE user without checking for registered email:
    router.post('/', validateDto(registerUser), controllers.create); */


module.exports = router;
