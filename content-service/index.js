// add application performance monitoring 
var apm = require('elastic-apm-node').start({
    serviceName: 'content-service',
    secretToken: 'K1dPeS59y0hO980e9d0ed4pI',
    serverUrl: 'https://apm-server-apm-http.default.svc.cluster.local:8200',
    environment: (NODE_ENV === 'production') ? 'production' : 'development',
    verifyServerCert: false
    })

const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const config = require('./config');
const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(express.static('client'));
app.use(cors());

router.set(app);

app.listen(config.port, () => console.log(`App listening on port ${config.port}`));
