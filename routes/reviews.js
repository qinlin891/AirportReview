const express = require('express');
const router = express.Router({mergeParams: true});
const Airport = require('../models/airport');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')


router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    airport.reviews.push(review);
    await review.save();
    await airport.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/airports/${airport._id}`);
}));

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Airport.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/airports/${id}`);
}));

module.exports = router;