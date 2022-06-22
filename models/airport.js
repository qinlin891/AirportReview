const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AirportSchema = new Schema({
    name: String,
    location: String,
    description: String,
    image: String
});

module.exports = mongoose.model('Airport', AirportSchema);