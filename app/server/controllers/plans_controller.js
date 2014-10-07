var crypto = require('crypto');
var stripe = require('../lib/stripe');
var handleError = require('../lib/error');
var planPermissions = require('../middleware/plan_permissions');
var Plan = require('../models/plan');

var ID_POSSIBILITIES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';

module.exports = {
  index: function *(next) {
    try {
      var plans = yield getPlans(this.params.product);
      var ret = [];

      for (var i = 0, l = plans.length; i < l; i++) {
        var plan = plans[i];

        ret.push({
          name: plan.name,
          stripe_id: plan.stripe_id,
          product_id: plan.product_id,
          amount: plan.amount
        });
      }

      this.body = ret;
    } catch (e) {
      handleError.call(this, e);
    }
  },

  create: [planPermissions, function *(next) {
    var body = this.request.body;

    body.id = this.params.product + '_' + (body.id || createId());
    body.currency = body.currency || 'usd';
    body.interval = body.interval || 'month';

    try {
      var stripePlan = yield createStripePlan(body);
      var plan = yield savePlan(stripePlan, this.params.product);

      this.body = { stripe_plan_id: plan.stripe_id };
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  show: function *(next) {
    try {
      this.body = yield retrieveStripePlan(this.params.plan);
    } catch (e) {
      handleError.call(this, e);
    }
  },

  /**
   * @method update()
   * @body { name: String }
   * Stripe: "Other plan details (price, interval, etc.) are, by design, not editable."
   */

  update: [planPermissions, function *(next) {
    try {
      var stripePlan = yield updateStripePlan(this.params.plan, this.request.body);

      this.body = yield updatePlan(stripePlan);
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  destroy: [planPermissions, function *(next) {
    try {
      var stripeId = this.params.plan;

      deletePlan(stripeId);

      this.body = yield deleteStripePlan(stripeId);
    } catch (e) {
      handleError.call(this, e);
    }
  }]
};

function *retrieveStripePlan(id) {
  return yield stripe.plans.retrieve(id);
}

function *createStripePlan(body) {
  return yield stripe.plans.create(body);
}

function *updateStripePlan(id, body) {
  return yield stripe.plans.update(id, body);
}

function *deleteStripePlan(id) {
  return yield stripe.plans.del(id);
}

function *getPlans(product) {
  return yield Plan.find({ product_id: product }).exec();
}

function *savePlan(stripePlan, product) {
  return yield Plan.create({
    amount: stripePlan.amount,
    name: stripePlan.name,
    product_id: product,
    stripe_id: stripePlan.id
  });
}

function *updatePlan(stripePlan) {
  return yield Plan.update(
    {
      stripe_id: stripePlan.id
    },

    {
      name: stripePlan.name
    },

    {
      amount: stripePlan.amount
    }
  ).exec();
}

function deletePlan(id) {
  Plan.find({ stripe_id: id }).remove().exec();
}

function createId() {
  var id = '';

  for (var i = 0; i < 10; i++) {
    id += ID_POSSIBILITIES.charAt(Math.floor(Math.random() * ID_POSSIBILITIES.length));
  }

  return id;
}
