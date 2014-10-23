var mongoose = require('mongoose');
var dbUrl = process.env.MONGOHQ_URL || '127.0.0.1';

module.exports = mongoose.connect(dbUrl);

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

console.log('connected to', dbUrl);
