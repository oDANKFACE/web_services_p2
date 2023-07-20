const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');
const mongodb = require('./mongo');
const session = require('express-session');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const {auth, requiresAuth} = require('express-openid-connect');
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(auth(config));

app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'User logged in' : 'User logged out');
});

app.get('/logout', (req, res) => {
    req.oidc.logout({ returnTo: process.env.BASE_URL });
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', router);

process.on('uncaughtException', (error, origin) => {
    console.log(process.stderr.fd, `Error thrown: ${error} with origin: ${origin}`);
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log('Web Server is listening at port ' + port);
            console.log('Connected to db');
        });
    }
});
