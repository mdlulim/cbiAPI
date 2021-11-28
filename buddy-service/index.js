const express = require('express');
const keys = require('./config/keys');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'));


require('./routes/appRoutes')(app);

app.listen(8080);