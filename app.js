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
})


app.listen(port, () => {
    console.log('Web Server is listening at port ' + port);
})

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to db');
    }
})

