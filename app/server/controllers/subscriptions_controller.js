var crypto = require('crypto');
var stripe = require('../lib/stripe');
var handleError = require('../lib/error');
var planPermissions = require('../middleware/plan_permissions');
var Plan = require('../models/plan');
var Subscription = require('../models/subscription');

module.exports = {
  create: [planPermissions, function *(next) {
    try {
      var result = yield createStripeSubscription(this.params.customer, this.request.body);
      var plan = yield Plan.findOne({ stripe_id: result.plan.id }).exec();

      var subscription = yield Subscription.create({
        plan: plan._id,
        product_id: this.params.product,
        stripe_customer_id: result.customer,
        stripe_id: result.id
      });

      // TODO: Implement proper logging
      console.log('Subscription created:', subscription);

      this.body = result;
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  destroy: [planPermissions, function *(next) {
    try {
      var result = yield destroyStripeSubscription(this.params.customer, this.params.subscription);
      var subscription = yield Subscription.update({ stripe_id: result.id }, { ended_at: Date.now() }).exec();

      console.log('Subscription destroyed:', subscription);

      this.body = result;
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  show: [planPermissions, function *(next) {
    try {
      this.body = yield getStripeSubscription(this.params.customer, this.params.subscription);
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  update: [planPermissions, function *(next) {
    try {
      this.body = yield updateStripeSubscription(this.params.customer, this.params.subscription, this.request.body);
    } catch (e) {
      handleError.call(this, e);
    }
  }]
};

function *createStripeSubscription(customer, body) {
  return yield stripe.customers.createSubscription(customer, body);
}

function *destroyStripeSubscription(customer, subscription) {
  return yield stripe.customers.cancelSubscription(customer, subscription);
}

function *getStripeSubscription(customer, subscription) {
  return yield stripe.customers.retrieveSubscription(customer, subscription);
}

function *updateStripeSubscription(customer, subscription, body) {
  return yield stripe.customers.updateSubscription(customer, subscription, body);
}
