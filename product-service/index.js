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
