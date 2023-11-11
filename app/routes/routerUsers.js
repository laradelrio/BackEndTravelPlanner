const express = require('express');
const controllers = require('../controllers/users.controller');
const router = express.Router();


router.get('/', (req, res) => res.send('This is root!'));

router.post('/', controllers.create);

module.exports = router;
