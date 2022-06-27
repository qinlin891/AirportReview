const express = require('express');
const router = express.Router();
const Airport = require('../models/airport');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {airportSchema} = require('../schemas');
const {isLoggedIn} = require('../middleware');

const validateAirport = (req, res, next) => {
    const {error} = airportSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async(req, res) => {
    const airports = await Airport.find({});
    res.render('airports/index', {airports});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('airports/new');
});

router.post('/', isLoggedIn, validateAirport, catchAsync(async(req, res) => {
    const airport = new Airport(req.body.airport);
    await airport.save();
    req.flash('success', 'Successfully made a new airport!');
    res.redirect(`/airports/${airport._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const {id} = req.params;
    const airport = await Airport.findById(id).populate('reviews');
    if(!airport) {
        req.flash('error', 'Airport not found');
        return res.redirect('/airports');
    }
    res.render('airports/show', {airport});
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    if(!airport) {
        req.flash('error', 'Airport not found');
        return res.redirect('/airports');
    }
    res.render('airports/edit', {airport});
}));

router.put('/:id', isLoggedIn, validateAirport, catchAsync(async(req, res) => {
    const {id} = req.params;
    const airport = await Airport.findByIdAndUpdate(id, {...req.body.airport});
    req.flash('success', 'Successfully updated airport!');
    res.redirect(`/airports/${airport._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const {id} = req.params;
    await Airport.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted airport !');
    res.redirect('/airports');
}));

module.exports = router;