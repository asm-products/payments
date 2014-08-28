var render = require('../lib/render');

exports.index = function *(next) {
  this.body = yield render('index', this.locals);
};

exports.products = require('./products_controller');
exports.plans = require('./plans_controller');
exports.customers = require('./customers_controller');
