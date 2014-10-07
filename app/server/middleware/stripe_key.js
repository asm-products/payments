var stripe = require('../lib/stripe');
var handleError = require('../lib/error');

module.exports = function *stripeSandbox(next) {
  var sandbox = this.get('Sandbox');

  if (sandbox === 'true') {
    stripe.setApiKey(process.env.STRIPE_TEST_KEY);
  } else {
    stripe.setApiKey(process.env.STRIPE_SECRET);
  }

  yield next;
};
