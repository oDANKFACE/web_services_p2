const express = require('express');
const router = express.Router();

// router.use('/readings', require('./readings'));
router.use('/clients', require('./clients'));
router.use('/', require('./swagger'));


module.exports = router;


