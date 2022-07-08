const Airport = require('../models/airport');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req, res) => {
    const airports = await Airport.find({});
    res.render('airports/index', {airports});
};

module.exports.renderNewForm = (req, res) => {
    res.render('airports/new');
};

module.exports.createAirport = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.airport.location,
        limit: 1
    }).send()
    const airport = new Airport(req.body.airport);
    airport.geometry = geoData.body.features[0].geometry;
    airport.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    airport.author = req.user._id;
    await airport.save();
    console.log(airport);
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    airport.images.push(...imgs);
    await airport.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await airport.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated airport!');
    res.redirect(`/airports/${airport._id}`);
};

module.exports.deleteAirport = async(req, res) => {
    const {id} = req.params;
    await Airport.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted airport !');
    res.redirect('/airports');
};