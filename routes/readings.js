const express = require('express');
const router = express.Router();
const {readingValidate} = require('../middleware/validator');
const {listReadings, getReading, createReading, updateReading, deleteReading} = require('../controllers/readings');


router.get('/', listReadings);
router.get('/:id', getReading);
router.post('/', readingValidate, createReading);
router.put('/:id', readingValidate, updateReading);
router.delete('/:id', deleteReading);



module.exports = router;