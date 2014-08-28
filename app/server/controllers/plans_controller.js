var request = require('co-request');
var thunk = require('thunkify');
var render = require('../lib/render');
var Plan = require('../models/plan');

module.exports = {
  create: function *(next) {
    this.accepts('application/json');

    var plan = new Plan(this.request.body);

    plan.save = thunk(plan.save);

    try {
      this.body = yield plan.save();
    } catch (e) {
      console.error(e);
      this.body = e;
    }

  },

  show: function *(next) {

  },

  update: function *(next) {

  },

  destroy: function *(next) {

  }
};
