const express = require('express');
const controllers = require('../controllers/users.controller');
const router = express.Router();
const validateDto = require('../validators/middleware/validate-dto');
const usersDto = require('../validators/dto/user')
const registerUser = require('../validators/dto/user');


router.get('/', (req, res) => res.send('This is root!'));

router.post('/', validateDto(registerUser), controllers.create);

module.exports = router;
