var Customer = require('../models/customer');
var planPermissions = require('../middleware/plan_permissions');
var handleError = require('../lib/error');
var stripe = require('../lib/stripe');

module.exports = {
  create: [planPermissions, function *(next) {
    var body = this.request.body;
    var customer = yield Customer.findOne({ email: body.email }).exec();

    try {
      if (customer) {
        return (this.body = yield updateStripeCustomer(customer.stripe_id, body));
      }

      var stripeCustomer = yield createStripeCustomer(body);
      customer = yield saveCustomer(stripeCustomer, this.params.product);

      this.status = 201;
      this.body = stripeCustomer;
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  index: [planPermissions, function *(next) {
    try {
      this.body = yield Customer.find({ product_id: this.params.product }).exec();
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  show: [planPermissions, function *(next) {
    try {
      this.body = yield retrieveStripeCustomer(this.params.customer);
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  update: [planPermissions, function *(next) {
    var customerId = body.customer_id;

    delete body.customer_id;

    try {
      this.body = yield updateStripeCustomer(customerId, body);
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  destroy: [planPermissions, function *(next) {
    try {
      deleteCustomer(customerId);
      this.body = yield deleteStripeCustomer(this.params.customer);
    } catch (e) {
      handleError.call(this, e);
    }
  }]
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
