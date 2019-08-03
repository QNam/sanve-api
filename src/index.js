const express  = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv   = require('dotenv');

const app = express();


dotenv.config();
console.log(process.env.DB_CONNECT);

app.use(express.json());

mongoose.connect(
    process.env.DB_CONNECT, 
    {useNewUrlParser: true}
);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api/webs', require('./routes/web'));
app.use('/api/user', require('./routes/webUser'));
app.use('/api/apps', require('./routes/app'));

app.use(function (err, req, res, next) {
    console.error(err.stack);

    res.status(500).send(err.message);
});

app.listen(process.env.PORT || 3000);