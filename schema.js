const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
    })
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
})

// const mongoose = require('mongoose');

// const propertySchema = new mongoose.Schema({
//     name: String,
//     location: String,
//     price: Number
// });

// const Property = mongoose.model('Property', propertySchema);
// module.exports = Property;
