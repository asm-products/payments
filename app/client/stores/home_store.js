var copyProperties = require('react/lib/copyProperties');

var HOME = require('../constants').HOME;
var Dispatcher = require('../dispatcher');
var Store = require('./store');
var xhr = require('../lib/xhr');

var errors = [];

var HomeStore = copyProperties(Store, {
  getErrors: function() {
    var ret = errors;

    errors = [];

    return ret;
  }
});

HomeStore.dispatchToken = Dispatcher.register(function(payload) {
  switch (payload.action) {
    case HOME.SUBMIT:
      _submitPaymentForm(payload.data);
    default:
      // fall through
  }
});

function _submitPaymentForm(formData) {
  global.Stripe.card.createToken({
    number: formData.cardNumber,
    exp_month: formData.expirationMonth,
    exp_year: formData.expirationYear,
    cvc: formData.cvc
  }, _handleStripeToken);
}

function _handleStripeToken(status, response) {
  if (response.error) {
    errors.push(response.error.message);

    return HomeStore.emitChange();
  }

  _processPayment(response.id);
}

function _processPayment(token) {
  xhr.post()
}

module.exports = HomeStore;
