const express = require('express');
const router = express.Router();
const {listClients, createClient, updateClient} = require('../controllers/clients');


router.get('/', listClients);


module.exports = router;