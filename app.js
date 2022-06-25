const express = require('express');
const app = express();
const engine = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Airport = require('./models/airport');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {airportSchema} = require('./schemas');

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


mongoose.connect('mongodb://localhost:27017/airport-review');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected");
});

const validateAirport = (req, res, next) => {
    const {error} = airportSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/airports', catchAsync(async(req, res) => {
    const airports = await Airport.find({});
    res.render('airports/index', {airports});
}));

app.get('/airports/new', (req, res) => {
    res.render('airports/new');
});

app.post('/airports', validateAirport, catchAsync(async(req, res) => {
    const airport = new Airport(req.body.airport);
    await airport.save();
    res.redirect(`/airports/${airport._id}`);
}));

app.get('/airports/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    const airport = await Airport.findById(id);
    res.render('airports/show', {airport});
}));

app.get('/airports/:id/edit', catchAsync(async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    res.render('airports/edit', {airport});
}));

app.put('/airports/:id', validateAirport, catchAsync(async(req, res) => {
    const {id} = req.params;
    const airport = await Airport.findByIdAndUpdate(id, {...req.body.airport});
    res.redirect(`/airports/${airport._id}`);
}));

app.delete('/airports/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    await Airport.findByIdAndDelete(id);
    res.redirect('/airports');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) {
        err.message = 'Oh no, something went wrong';
    }
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Sering on port 3000');
});