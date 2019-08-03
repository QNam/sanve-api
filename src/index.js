const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');

const app = express();


dotenv.config();

app.use(express.json());

mongoose.connect(
    process.env.DB_CONNECT, 
    {useNewUrlParser: true}
);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use('/api/webs',require('./routes/web'));
app.use('/api/web_users',require('./routes/web_user'));
app.use('/api/apps',require('./routes/app'));

app.listen(process.env.PORT || 3000);