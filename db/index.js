var mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
