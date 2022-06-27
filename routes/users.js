const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Successfully logged in');
            res.redirect('/airports');
        })
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true}), 
        (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/airports';
    delete req.session.returnTo;
    res.redirect(`${redirectUrl}`);
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Successfully logged out");
      res.redirect('/airports');
    });
  });

module.exports = router;