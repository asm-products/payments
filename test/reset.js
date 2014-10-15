var mongoose = require('mongoose');

exports.dropDatabase = function(done) {
  setup(function() {
    mongoose.connection.db.dropDatabase(done);
  });
};

function setup(done) {
  if (mongoose.connection.db._state === 'connected') {
    return done();
  }

  mongoose.connection.on('connected', function() {
    mongoose.connection.db.dropDatabase(done);
  });
}
