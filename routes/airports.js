const express = require('express');
const router = express.Router();
const Airport = require('../models/airport');
const airports = require('../controllers/airports');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateAirport} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});

router.route('/')
    .get(catchAsync(airports.index))
    .post(isLoggedIn, upload.array('image'), validateAirport, catchAsync(airports.createAirport));

router.get('/new', isLoggedIn, airports.renderNewForm);

router.route('/:id')
    .get(catchAsync(airports.showAirport))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateAirport, catchAsync(airports.updateAirport))
    .delete(isLoggedIn, isAuthor, catchAsync(airports.deleteAirport))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(airports.renderEditForm));

module.exports = router;