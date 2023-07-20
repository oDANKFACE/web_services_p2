const { ObjectId } = require('mongodb');
const mongo = require('../mongo');
const {response} = require("express");



const listReadings = async (req, res) => {
    try {
        const clients = await mongo.getDb().collection('readings');
        const results = await clients.find().toArray();
        if (results.length === 0) {
            res.status(404).json({ message: 'No readings were found' });
        } else {
            res.status(200).json(results);
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

const getReading = async (req, res) => {
    try {
        const readingId = new ObjectId(req.params.id);

        // Not working
        // if (!ObjectId.isValid(readingId)) {
        //     return res.status(400).json({ message: 'Invalid reading ID format.' });
        // }

        const readings = await mongo.getDb().collection('readings');
        const result = await readings.findOne({_id: readingId});
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Reading not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


const createReading = async (req, res) => {
    try {
        const clientId = new ObjectId(req.body.clientId);
        const clientExists = await mongo.getDb().collection('clients').findOne({_id: clientId});
        if (!clientExists) {
            res.status(400).json({ message: 'Invalid client ID' });
            return;
        }
        const reading = {
            bg: req.body.bg,
            readingTime: req.body.readingTime,
            clientId: clientId
        };
        const response = await mongo.getDb().collection('readings').insertOne(reading);
        if (response.acknowledged) {
            res.status(201).json(response);
        } else {
            res.status(500).json({ message: 'Error: Server did not acknowledge reading creation operation.', error: response.error });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error. Ensure you are using a valid clientId.', error: err });
    }
};


const updateReading = async (req, res) => {
    try {
        const readingId = new ObjectId(req.params.id);

        // Not working
        // if (!ObjectId.isValid(readingId)) {
        //     return res.status(400).json({ message: 'Invalid reading ID format.' });
        // }

        const clientId = new ObjectId(req.body.clientId);
        const clientExists = await mongo.getDb().collection('clients').findOne({_id: clientId});
        if (!clientExists) {
            res.status(400).json({ message: 'Invalid client ID' });
            return;
        }

        // const newReading = {
        //     bg: req.body.bg,
        //     readingTime: req.body.readingTime,
        //     clientId: clientId
        // }
        //
        // const response = await mongo.getDb().collection('readings').replaceOne({ _id: readingId }, newReading);

        const newReading = ['bg', 'time']
            .reduce((obj, key) => (req.body[key] ? { ...obj, [key]: req.body[key] } : obj), {});
        const response = await mongo.getDb().collection('readings').updateOne(
            { _id: readingId },
            { $set: newReading }
        );
        if (response.acknowledged && response.modifiedCount > 0) {
            res.status(204).json(response);
        } else if (response.acknowledged) {
            res.status(404).json({ message: 'Error: Reading not found' });
        } else {
            res.status(500).json({ message: 'Error: Update not acknowledged by the server' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


const deleteReading = async (req, res) => {


    try {
        // Not working
        // if (!ObjectId.isValid(readingId)) {
        //     return res.status(400).json({ message: 'Invalid reading ID format.' });
        // }

        const readingId = req.params.id;
        const response = await mongo.getDb().collection('readings').deleteOne({ _id: readingId });
        if (response.deletedCount === 0) {
            res.status(404).json({ message: 'Reading not found.' });
        } else {
            res.status(200).json({ message: 'Reading successfully deleted.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};


module.exports = {
    listReadings,
    getReading,
    createReading,
    updateReading,
    deleteReading
}












