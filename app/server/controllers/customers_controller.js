var stripe = require('stripe')(process.env.STRIPE_SECRET);
var Customer = require('../models/customer');
var handleError = require('../lib/error');

module.exports = {
  create: function *(next) {
    this.accepts('application/json');
    var body = this.request.body;

    var customer = yield Customer.findOne({ email: body.email }).exec();

    if (customer) {
      // updateCustomer
    }

    try {
      var stripeCustomer = yield createStripeCustomer(body);

      this.body = yield saveCustomer(stripeCustomer, this.params.product);
    } catch (e) {
      console.error(e);
      handleError.call(this, e);
    }
  },

  show: function *(next) {

  },

  update: function *(next) {
    this.accepts('application/json');

  },

  destroy: function *(next) {

  }
};

function *createStripeCustomer(body) {
  return yield stripe.customers.create(body);
}

function *saveCustomer(stripeCustomer, product) {
  return yield Customer.create({
    email: stripeCustomer.email,
    product_id: product,
    stripe_id: stripeCustomer.id
  });
}
