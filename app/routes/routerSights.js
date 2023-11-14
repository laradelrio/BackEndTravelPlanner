const express = require('express');
const controllers = require('../controllers/trips.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const sightsDto = require('../validators/dto/sight');



router.get('/', (req, res) => res.send('This is root!'));


module.exports = router;
