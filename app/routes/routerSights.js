const express = require('express');
const controllers = require('../controllers/sights.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const sightsDto = require('../validators/dto/sight');




router.get('/trip/:id', controllers.findAllSightsByTrip);

router.post('/', validateDto(sightsDto.registerSight), controllers.createSight);

router.put('/update/:id', controllers.updateSight);

router.delete('/delete/:id', controllers.deleteSight);

module.exports = router;
