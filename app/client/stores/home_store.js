var merge = require('react/lib/merge');
var EventEmitter = require('events').EventEmitter;

var CONSTANTS = require('../constants');
var CHANGE_EVENT = CONSTANTS.CHANGE_EVENT;
var HOME = CONSTANTS.HOME;
var Dispatcher = require('../dispatcher');
var xhr = require('../lib/xhr');

var errors = [];
var plans = [];
var paymentSubmitted = false;

var HomeStore = merge(EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getErrors: function() {
    var ret = errors;

    errors = [];

    return ret;
  },

  getPlans: function() {
    return plans;
  },

  paymentSubmitted: function() {
    var ret = paymentSubmitted;

    paymentSubmitted = false;

    return ret;
  }
});

HomeStore.dispatchToken = Dispatcher.register(function(payload) {
  switch (payload.action) {
    case HOME.SUBMIT:
      _submitPaymentForm(payload.data);
      break;
    case HOME.PLANS:
      _fetchPlans(payload.data);
      break;
    default:
      // fall through
  }
});

function _fetchPlans(url) {
  xhr.get(url, function(err, _plans) {
    if (err) {
      errors.push(err);
    }

    if (_plans.length === 0) {
      errors.push(new Error("This product hasn't registered any plans yet."));
    } else {
      plans = _plans;
    }

    HomeStore.emitChange();
  });
}

function _submitPaymentForm(formData) {
  global.Stripe.card.createToken({
    number: formData.cardNumber,
    exp_month: formData.expirationMonth,
    exp_year: formData.expirationYear,
    cvc: formData.cvc
  }, _handleStripeToken(formData));
}

function _handleStripeToken(formData) {
  return function stripeCallback(status, response) {
    if (response.error) {
      errors.push(response.error.message);

      return HomeStore.emitChange();
    }

    formData.token = response.id;

    _processPayment(formData);
  }
}

function _processPayment(formData) {
  var data = {
    email: formData.email,
    card: formData.token
  };

  paymentSubmitted = true;
  xhr.post(document.location.pathname + '/customers', data, HomeStore.emitChange.bind(HomeStore));
}

module.exports = HomeStore;
