const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Project 2',
        description: 'My second project',
    },
    // host: 'localhost:3000',
    // schemes: ['http'],

    host: 'project-2-hj5f.onrender.com',
    schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
