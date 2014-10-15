var Resource = require('koa-resource-router');

var controllers = require('../controllers');
var acceptJson = require('../middleware/accept_json');

module.exports = function(app) {
  app.get('/', controllers.index);

  // /products[/:product]
  var products = new Resource('products', controllers.products);

  // /products/:product/plans[/:plan]
  var plans = new Resource('plans', acceptJson, controllers.plans);

  // /products/:product/customers[/:customer]
  var customers = new Resource('customers', acceptJson, controllers.customers);

  // /products/:product/customers/:customer/subscriptions[/:subscription]
  var subscriptions = new Resource('subscriptions', acceptJson, controllers.subscriptions);

  // /products/:product/charges
  var charges = new Resource('charges', acceptJson, controllers.charges);

  products.add(plans);
  products.add(customers);
  products.add(charges);
  customers.add(subscriptions);

  app.use(products.middleware());
  app.use(plans.middleware());
  app.use(charges.middleware());
  app.use(customers.middleware());
  app.use(subscriptions.middleware());
};
