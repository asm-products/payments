var mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGOHQ_URL);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

console.log('connected to ', process.env.MONGOHQ_URL);
