var stripe = require('stripe')(process.env.STRIPE_SECRET);
var Customer = require('../models/customer');
var handleError = require('../lib/error');

module.exports = {
  create: function *(next) {
    var body = this.request.body;
    var customer = yield Customer.findOne({ email: body.email }).exec();

    if (customer) {
      return this.body = yield updateStripeCustomer(customer.stripe_id, body);
    }

    try {
      var stripeCustomer = yield createStripeCustomer(body);

      this.body = yield saveCustomer(stripeCustomer, this.params.product);
    } catch (e) {
      handleError.call(this, e);
    }
  },

  show: function *(next) {
    try {
      this.body = yield retrieveStripeCustomer(this.params.customer);
    } catch (e) {
      handleError.call(this, e);
    }
  },

  update: function *(next) {
    var customerId = body.customer_id;

    delete body.customer_id;

    try {
      this.body = yield updateStripeCustomer(customerId, body);
    } catch (e) {
      handleError.call(this, e);
    }
  },

  destroy: function *(next) {
    try {
      deleteCustomer(customerId);
      this.body = yield deleteStripeCustomer(this.params.customer);
    } catch (e) {
      handleError.call(this, e);
    }
  }
};

function *createStripeCustomer(body) {
  return yield stripe.customers.create(body);
}

function *updateStripeCustomer(id, body) {
  return yield stripe.customers.update(id, body);
}

function *saveCustomer(stripeCustomer, product) {
  return yield Customer.create({
    email: stripeCustomer.email,
    product_id: product,
    stripe_id: stripeCustomer.id
  });
}

function *retrieveStripeCustomer(customerId) {
  return yield stripe.customers.retrieve(customerId);
}

function deleteCustomer(customerId) {
  Customer.find({ stripe_id: customerId }).remove().exec();
}

function *deleteStripeCustomer(customerId) {
  return yield stripe.customers.del(customerId);
}
