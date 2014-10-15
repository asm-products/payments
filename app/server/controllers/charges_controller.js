var planPermissions = require('../middleware/plan_permissions');
var handleError = require('../lib/error');
var stripe = require('../lib/stripe');

var Charge = require('../models/charge');
var Customer = require('../models/customer');

module.exports = {
  // Stripe lets you create a charge on a card, we require a customer to be created
  create: [planPermissions, function *(next) {
    var body = this.request.body;
    var customer = yield Customer.findOne({ product_id: this.params.product, stripe_id: body.customer }).exec();

    if (!customer) {
      return handleError.call(this, { status: 400, type: 'InvalidCustomer'});
    }

    try {
      var stripeCharge = yield createStripeCharge(body);
      var charge = yield saveCharge(this.params.product, customer.id, stripeCharge);

      this.status = 201;
      this.body = stripeCharge;
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  index: [planPermissions, function *(next) {
    try {
      this.body = yield getCharges(this.params.product);
    } catch (e) {
      handleError.call(this, e);
    }
  }],

  show: [planPermissions, function *(next) {
    try {
      var charge = yield Charge.findOne({ product_id: this.params.product, stripe_id: this.params.charge }).exec();

      if (!charge) {
        return handleError.call(this, { status: 400, type: 'InvalidCharge'});
      }

      this.body = yield getStripeCharge(this.params.charge);
    } catch (e) {
      handleError.call(this, e);
    }
  }]
};

function *getCharges(productId) {
  var charges = yield Charge.aggregate([
    { $match: { product_id: productId } },
    { $project: {_id: 0, id: "$stripe_id"}}
  ]).exec();

  return {
    "object": "list",
    "url": "/products/" + productId + "/charges",
    "has_more": "false",
    "data": charges
  };
}

function *getStripeCharge(charge_id) {
  return yield stripe.charges.retrieve(charge_id);
}


function *createStripeCharge(params) {
  return yield stripe.charges.create(params);
}

function *saveCharge(product_id, customer_id, stripeCharge) {
  return yield Charge.create({
    product_id: product_id,
    customer_id: customer_id,
    stripe_id: stripeCharge.id,
    amount: stripeCharge.amount,
    currency: stripeCharge.currency
  });
}
