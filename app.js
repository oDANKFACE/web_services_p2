const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
const mongodb = require('./mongo');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;


app.use('/', router);

process.on('uncaughtException', (error, origin) => {
    console.log(process.stderr.fd, `Error thrown: ${error} with origin: ${origin}`);
});


app.listen(port, () => {
    console.log('Web Server is listening at port ' + port);
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to db');
    }
});


const { auth, requiresAuth } = require('express-openid-connect');
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'User logged in' : 'User logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

