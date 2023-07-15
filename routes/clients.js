const express = require('express');
const router = express.Router();
const {listClients, getClient, createClient, updateClient} = require('../controllers/clients');


router.get('/', listClients);
router.get('/:id', getClient);
router.post('/', createClient);



module.exports = router;