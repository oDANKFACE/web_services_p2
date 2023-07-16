const express = require('express');
const router = express.Router();
const {clientValidate} = require('../middleware/validator');
const {listClients, getClient, createClient, updateClient, deleteClient} = require('../controllers/clients');


router.get('/', listClients);
router.get('/:id', getClient);
router.post('/', clientValidate, createClient);
router.put('/:id', clientValidate, updateClient);
router.delete('/:id', deleteClient);



module.exports = router;