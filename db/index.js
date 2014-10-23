var mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGOHQ_URL || '127.0.0.1');

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

console.log('connected to', process.env.MONGOHQ_URL);
