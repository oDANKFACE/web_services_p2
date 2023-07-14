const { ObjectId } = require('mongodb');
const mongo = require('../mongo');
const {response} = require("express");


const listClients = async (req, res) => {
    try {
        const clients = await mongo.getDb().collection('clients');
        const results = await clients.find()
            .toArray();
        res.send(results).status(200);
    } catch (err) {
        res.send(err).status(500);
    }
}


const createClient = async (req, res) => {
    console.log(req);
    const client = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        diagnosisDate: req.body.diagnosisDate,
        highLimit: req.body.highLimit,
        lowLimit: req.body.lowLimit,
        readings: req.body.readings
    };
    const response = await mongo.getDb().collection('clients').insertOne(client);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'client creation failed');
    }
};

const updateClient = async (req, res) => {
    const clientId = ObjectId(req.params.id);
    const newInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        diagnosisDate: req.body.diagnosisDate,
        highLimit: req.body.highLimit,
        lowLimit: req.body.lowLimit,
        readings: req.body.readings
    };
    const response = await mongo.getDb().collection('clients').replaceOne({ _id: clientId }, newInfo);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'client update failed');
    }
};

module.exports = {
    listClients,
    createClient,
    updateClient
}