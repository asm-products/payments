var path = require('path');
var Resource = require('koa-resource-router');
var controllers = require(path.resolve(__dirname, '..', 'controllers'));

module.exports = function(app) {
  app.get('/', controllers.index);

  var products = new Resource('products', controllers.products);
  app.use(products.middleware());
};
