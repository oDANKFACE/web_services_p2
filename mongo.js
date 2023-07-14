const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.6snw68f.mongodb.net/?retryWrites=true&w=majority`;

let _client;

const initDb = (callback) => {
    if (_client) {
        console.log('Db is already initialized!');
        return callback(null);
    }
    mongoClient.connect(uri)
        .then((client) => {
            _client = client;
            callback(null);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDb = () => {
    if (!_client) {
        throw Error('Db not initialized');
    }
    return _client.db('project2');
};

module.exports = {
    initDb,
    getDb,
};