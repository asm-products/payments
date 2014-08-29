/** @jsx React.DOM */

var React = require('react');
var FlashMixin = require('../mixins/flash_mixin.jsx');
var HomeStore = require('../stores/home_store');

module.exports = React.createClass({
  mixins: [FlashMixin],

  componentDidMount: function() {
    HomeStore.addChangeListener(this.handleChange);
  },

  handleChange: function() {
    var errors = HomeStore.getErrors();

    if (errors.length > 0) {
      return this.setState({
        alertClass: 'danger',
        message: errors[0].message,
        style: {
          visibility: 'visible'
        }
      });
    }

    if (HomeStore.paymentSubmitted()) {
      this.setState({
        alertClass: 'success',
        message: 'Payment sent for processing',
        style: {
          visibility: 'visible'
        }
      });
    }
  }
});
