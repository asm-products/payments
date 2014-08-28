/** @jsx React.DOM */

var React = require('react');

var CONSTANTS = require('../constants');
var Dispatcher = require('../dispatcher');
var BaseForm = require('../components/base_form.jsx');
var Flash = require('./payment_form_flash.jsx');
var FormGroup = require('../components/form_group.jsx');
var HomeStore = require('../stores/home_store');

module.exports = React.createClass({
  componentDidMount: function() {
    HomeStore.addChangeListener(this.handleStoreResponse);

    Dispatcher.dispatch({
      action: CONSTANTS.HOME.PLANS,
      data: document.location + '/plans'
    });
  },

  formData: function() {
    return {
      plan: this.state.plan || this.state.plans[0].stripe_id,
      email: this.state.email,
      cardNumber: this.state.cardNumber,
      expirationMonth: this.state.expirationMonth,
      expirationYear: this.state.expirationYear,
      cvc: this.state.cvc
    };
  },

  getInitialState: function() {
    return {
      errors: {}
    };
  },

  handleStoreResponse: function(response) {
    this.setState({
      plans: HomeStore.getPlans()
    });

    this.plans();
  },

  onChange: function(property) {
    return function handleChange(e) {
      var state = {};

      state[property] = e.target.value;

      this.setState(state);
    }.bind(this);
  },

  onSubmit: function(e) {
    e.preventDefault();

    Dispatcher.dispatch({
      action: CONSTANTS.HOME.SUBMIT,
      data: this.formData()
    });
  },

  plans: function() {
    var plans = this.state.plans;

    if (!plans || plans.length === 0) {
      return;
    }

    var ret = [];

    for (var i = 0, l = plans.length; i < l; i++) {
      var plan = plans[i];

      ret.push(
        <option value={plan.stripe_id} key={'plan-' + i}>
          {document.getElementById('product-name').innerHTML + ' - ' +plan.name}
        </option>
      );
    }

    return ret;
  },

  render: function() {
    return (
      <div style={{ 'margin-right': 'auto' }} className="col-xs-12">
        <div style={{'margin-bottom': '10px'}}>
          <Flash message={this.state.message} />
        </div>
        <BaseForm onSubmit={this.onSubmit} buttonText="Submit">
          <FormGroup error={this.state.errors.plan}>
            <label className="control-label">Plan</label>
            <select
                className="form-control"
                value={this.state.plan}
                onChange={this.onChange('plan')}>
              {this.plans()}
            </select>
          </FormGroup>

          <FormGroup error={this.state.errors.email}>
            <label className="control-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={this.state.email}
              placeholder="Email address"
              onChange={this.onChange('email')} />
          </FormGroup>

          <FormGroup error={this.state.errors.cardNumber}>
            <label className="control-label">Card number</label>
            <input
              type="text"
              className="form-control"
              value={this.state.cardNumber}
              placeholder="Card number"
              onChange={this.onChange('cardNumber')} />
          </FormGroup>

          <div className="row">
            <div className="col-xs-8 col-md-8">
              <FormGroup error={this.state.errors.expiration}>
                <label>Expiration</label>
                <div className="row">
                  <div className="col-xs-6 col-xl-2">
                    <input
                      type="text"
                      size="2"
                      className="form-control"
                      value={this.state.expirationMonth}
                      placeholder="MM"
                      onChange={this.onChange('expirationMonth')} />
                  </div>

                  <div className="col-xs-6 col-xl-2" style={{ 'padding-left': '0px' }}>
                    <input
                      type="text" size="4"
                      className="form-control"
                      value={this.state.expirationYear}
                      placeholder="YYYY"
                      onChange={this.onChange('expirationYear')} />
                  </div>
                </div>
              </FormGroup>
            </div>

            <div className="col-xs-4 col-md-4 pull-right">
              <FormGroup error={this.state.errors.cvc}>
                <label className="control-label">CVC</label>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.cvc}
                  placeholder="CVC"
                  onChange={this.onChange('cvc')} />
              </FormGroup>
            </div>
          </div>
        </BaseForm>
      </div>
    );
  }
});
