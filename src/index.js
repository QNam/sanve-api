const dotenv   = require('dotenv');
const express  = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exceptionHandler = require('./middlewares/exceptionHandler');

const app = express();

dotenv.config();

console.log(process.env.DB_CONNECT);

app.use(bodyParser.json());

mongoose.connect(
    process.env.DB_CONNECT, 
    {useNewUrlParser: true}
);

mongoose.Promise = require('bluebird');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/webs', require('./routes/web'));
app.use('/api/user', require('./routes/webUser'));

app.use('*', (req, res) => {
    res.status(404).send({ status: 404, code: 1001, err: '404 Not Found'});
});

app.use(exceptionHandler.handleException);

app.listen(process.env.PORT || 3000);