const {ObjectId} = require('mongodb');
const mongo = require('../mongo');
const {response} = require("express");


const listClients = async (req, res) => {
    try {
        const clients = await mongo.getDb().collection('clients');
        const results = await clients.find().toArray();
        if (results.length === 0) {
            res.status(404).json({message: 'No clients were found'});
        } else {
            res.status(200).json(results);
        }
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err});
    }
};

const getClient = async (req, res) => {
    try {
        const clientId = new ObjectId(req.params.id);

        // Not working
        // if (!ObjectId.isValid(clientId)) {
        //     return res.status(400).json({message: 'Invalid client ID format.'});
        // }
        const clients = await mongo.getDb().collection('clients');
        const result = await clients.findOne({_id: clientId});
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({message: 'Client not found'});
        }
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err});
    }
};


const createClient = async (req, res) => {
    try {
        const client = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            birthday: req.body.birthday,
            diagnosisDate: req.body.diagnosisDate,
            highLimit: req.body.highLimit,
            lowLimit: req.body.lowLimit
        };
        const response = await mongo.getDb().collection('clients').insertOne(client);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json({
                message: 'Error: Server did not acknowledge client creation operation.',
                error: response.error
            });
        }
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err});
    }
};

const updateClient = async (req, res) => {
    try {
        const clientId = new ObjectId(req.params.id);

        // Not working
        // if (!ObjectId.isValid(clientId)) {
        //     return res.status(400).json({message: 'Invalid client ID format.'});
        // }

        // const newInfo = {
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     email: req.body.email,
        //     birthday: req.body.birthday,
        //     diagnosisDate: req.body.diagnosisDate,
        //     highLimit: req.body.highLimit,
        //     lowLimit: req.body.lowLimit
        // }
        //
        // const response = await mongo.getDb().collection('clients').replaceOne({ _id: clientId }, newInfo);

        const newInfo = ['firstName', 'lastName', 'email', 'birthday', 'diagnosisDate', 'highLimit', 'lowLimit']
            .reduce((obj, key) => (req.body[key] ? { ...obj, [key]: req.body[key] } : obj), {});

        const response = await mongo.getDb().collection('clients').updateOne({ _id: clientId }, { $set: newInfo });

        if (response.acknowledged && response.modifiedCount > 0) {
            res.status(204).json(response);
        } else if (response.acknowledged) {
            res.status(404).json({message: 'Error: could not find the client'});
        } else {
            res.status(500).json({message: 'Error: Update not acknowledged by the server'});
        }
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err}); // Server error
    }
};

const deleteClient = async (req, res) => {
    try {
        const clientId = new ObjectId(req.params.id);

        // Not working
        // if (!ObjectId.isValid(clientId)) {
        //     return res.status(400).json({message: 'Invalid client ID format.'});
        // }

        const response = await mongo.getDb().collection('clients').deleteOne({_id: clientId});
        if (response.acknowledged && response.deletedCount > 0) {
            res.status(200).json({message: 'Client successfully deleted'});
        } else if (response.acknowledged) {
            res.status(404).json({message: 'Error: could not find the client'});
        } else {
            res.status(500).json({message: 'Error: Deletion not acknowledged by the server'});
        }
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err});
    }
};


module.exports = {
    listClients,
    getClient,
    createClient,
    updateClient,
    deleteClient
}