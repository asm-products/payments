var path = require('path');
var controllers = require(path.resolve(__dirname, '..', 'controllers'));

module.exports = function(app) {
  app.get('/', controllers.index);
};
