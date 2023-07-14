const { ObjectId } = require('mongodb');
const mongo = require('../mongo');
const {response} = require("express");



const listReadings = async (req, res) => {
    const readings = await mongo.getDb().collection('readings');
    const results = await readings.find()
        .toArray();
    res.send(results).status(200);
}

const listContacts = async (req, res) => {
    const contacts = await mongo.getDb().collection('contacts');
    const results = await contacts.find()
        .toArray();
    res.send(results).status(200);
}

const getContact = async (req, res) => {
    const id = new ObjectId(req.params.id);
    const contacts = await mongo.getDb().collection('contacts');
    const results = await contacts.findOne({_id:id});
    res.send(results).status(200);
}

const createContact = async (req, res) => {
    console.log(req);
    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongo.getDb().collection('contacts').insertOne(contact);
    if (response.acknowledged) {
        res.status(201).json(response);
    } else {
        res.status(500).json(response.error || 'something went wrong while creating the contact!');
    }
}

const updateContact = async (req, res) => {
    const userId = new ObjectId(req.params.id);

    const contact = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongo.getDb().collection('contacts').replaceOne({ _id: userId }, contact);
    console.log(response);
    if (response.modifiedCount > 0) {
        res.status(201).send(response);
    } else {
        res.status(500).json(response.error || 'Something went wrong while updating the contact!');
    }
}

const deleteContact = async (req, res) => {
    const id  = new ObjectId(req.params.id);
    const response = await mongo.getDb().collection('contacts').remove({ _id: id }, true);
    console.log(response);
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Something went wrong while deleting the contact!');
    }
}


module.exports = {
    listContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
}












