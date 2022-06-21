const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AirportSchema = new Schema({
    name: String,
    location: String,
    description: String
});

module.exports = mongoose.model('Airport', AirportSchema);