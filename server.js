if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const router = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', './layouts/layout')
app.use(expressLayouts);
app.use(express.static('/public'));

// connect to database
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('Connected to database');
});



app.use('/', router);

// listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listens on port ${PORT}`);
})
