const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const db = require('./config/db/index');
const cookieParser = require('cookie-parser');
const { auth } = require('./app/middlewares/auth');

const app = express();
const port = 3000;

// Connect to DB
db.connect();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(auth);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './resources/views'));

// Routes
const route = require('./app/routes');
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
