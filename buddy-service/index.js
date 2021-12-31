// add application performance monitoring 
// var apm = require('elastic-apm-node').start({
//     serviceName: 'buddy-service',
//     secretToken: 'K1dPeS59y0hO980e9d0ed4pI',
//     serverUrl: 'https://apm-server-apm-http.default.svc.cluster.local:8200',
//     environment: process.env.NODE_ENV,
//     verifyServerCert: false
//     })

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const logger = require('morgan');
const app = express();
const config = require('./config');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const buddyRouter = require('./routes/index');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Buddy API',
        version: '1.0.0',
        description:
        'This is a REST API application made with Express. It retrieves Buddy information related to CBI.',
        ternsOfService: "http://cbiglobal.io/terms/",
        contact: {
            name: 'API Support',
            url: 'https://cbiglobal.io',
            email: 'support@cbiglobal.io'
        },
    },
    servers: [
        {
            url: 'http://staging.buddy.cbiglobal.io/v1',
            description: 'Development server',
        },
        {
            url: 'http://buddy.cbiglobal.io/v1',
            description: 'Production server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(express.static('client'));
app.use(cors());
app.use(logger('dev'));

app.use('/', buddyRouter);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(config.port, () => console.log(`App listening on port ${config.port}`));
