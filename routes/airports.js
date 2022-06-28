const express = require('express');
const router = express.Router();
const Airport = require('../models/airport');
const airports = require('../controllers/airports');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateAirport} = require('../middleware');


router.get('/', catchAsync(airports.index));

router.get('/new', isLoggedIn, airports.renderNewForm);

router.post('/', isLoggedIn, validateAirport, catchAsync(airports.createAirport));

router.get('/:id', catchAsync(airports.showAirport));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(airports.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateAirport, catchAsync(airports.updateAirport));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(airports.deleteAirport));

module.exports = router;