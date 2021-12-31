// add application performance monitoring 
//  var apm = require('elastic-apm-node').start({
//     serviceName: 'admin-service',
//     secretToken: 'K1dPeS59y0hO980e9d0ed4pI',
//     serverUrl: 'https://apm-server-apm-http.default.svc.cluster.local:8200',
//     environment: process.env.NODE_ENV,
//     verifyServerCert: false
//     })

const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
var cors = require('cors');
const app = express();
const config = require('./config');
const router = require('./router');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: "1.0.0",
            title: "admin-service API",
            description: "This is a REST API application made with Express. It retrieves admin service information related to CBI.",
            contact: {
                name: 'API Support',
                url: 'https://cbiglobal.io',
                email: 'support@cbiglobal.io'
            },
            servers: [
                {
                    url: 'http://dev.cbiglobal.io/v1/admin',
                    description: 'Development server',
                },
                {
                    url: 'http://dev.qa.cbiglobal.io/v1/admin',
                    description: 'QA server',
                },
                {
                    url: 'http://dev.release.cbiglobal.io/v1/admin',
                    description: 'Staging server',
                },
                {
                    url: 'http://api.cbiglobal.io/v1/admin',
                    description: 'Production server',
                },
            ]
        }
    },
    apis: ["router.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(express.static('client'));
app.use(cors());

router.set(app);

app.listen(config.port, () => console.log(`App listening on port ${config.port}`));
