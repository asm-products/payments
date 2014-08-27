var copyProperties = require('react/lib/copyProperties');

var CONSTANTS = require('../constants').HOME_STORE;
var Dispatcher = require('../dispatcher');
var Store = require('./store');

function _submitPaymentForm(formData) {

};

var HomeStore = copyProperties(Store, {

});

HomeStore.dispatchToken = Dispatcher.register(function(payload) {
  switch (action) {
    case CONSTANTS.SUBMIT:
      _submitPaymentForm(payload.data);
    default:
      // fall through
  }
});
