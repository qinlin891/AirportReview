const Joi = require('joi');

module.exports.airportSchema = Joi.object({
    airport: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});