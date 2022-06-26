const express = require('express');
const router = express.Router({mergeParams: true});
const Airport = require('../models/airport');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post('/',  validateReview, catchAsync(async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    const review = new Review(req.body.review);
    airport.reviews.push(review);
    await review.save();
    await airport.save();
    res.redirect(`/airports/${airport._id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Airport.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/airports/${id}`);
}));

module.exports = router;