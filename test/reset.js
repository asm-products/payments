var mongoose = require('mongoose');

exports.setup = function(done) {
  if (mongoose.connection.db._state === 'connected') {
    return done();
  }

  mongoose.connection.on('connected', function() {
    mongoose.connection.db.dropDatabase(done);
  });
};

exports.dropDatabase = function(done) {
  exports.setup(function() {
    mongoose.connection.db.dropDatabase(done)
  });
};
