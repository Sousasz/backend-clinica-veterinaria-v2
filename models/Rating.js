const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({});

module.exports = mongoose.model('Rating', RatingSchema);

