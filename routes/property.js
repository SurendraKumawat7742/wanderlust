const express = require('express');
const router = express.Router();
const propertyController = require('../Controller/listings.js');

// Search route
router.get('/search', propertyController.search);

module.exports = router;
