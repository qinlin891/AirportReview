const Airport = require('../models/airport');

module.exports.index = async(req, res) => {
    const airports = await Airport.find({});
    res.render('airports/index', {airports});
};

module.exports.renderNewForm = (req, res) => {
    res.render('airports/new');
};

module.exports.createAirport = async(req, res) => {
    const airport = new Airport(req.body.airport);
    airport.author = req.user._id;
    await airport.save();
    req.flash('success', 'Successfully made a new airport!');
    res.redirect(`/airports/${airport._id}`);
};

module.exports.showAirport = async(req, res) => {
    const {id} = req.params;
    const airport = await Airport.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    
    if(!airport) {
        req.flash('error', 'Airport not found');
        return res.redirect('/airports');
    }
    res.render('airports/show', {airport});
};

module.exports.renderEditForm = async(req, res) => {
    const airport = await Airport.findById(req.params.id);
    if(!airport) {
        req.flash('error', 'Airport not found');
        return res.redirect('/airports');
    }
    res.render('airports/edit', {airport});
};

module.exports.updateAirport = async(req, res) => {
    const {id} = req.params;
    const airport = await Airport.findByIdAndUpdate(id, {...req.body.airport});
    req.flash('success', 'Successfully updated airport!');
    res.redirect(`/airports/${airport._id}`);
};

module.exports.deleteAirport = async(req, res) => {
    const {id} = req.params;
    await Airport.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted airport !');
    res.redirect('/airports');
};