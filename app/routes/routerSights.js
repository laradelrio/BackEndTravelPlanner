const express = require('express');
const controllers = require('../controllers/sights.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const sightsDto = require('../validators/dto/sight');



router.get('/', (req, res) => res.send('This is root sights!'));

//POST
router.post('/', validateDto(sightsDto.registerSight), controllers.createSight);

router.put('/update/:id', controllers.updateSight);

module.exports = router;
