/** @jsx React.DOM */

var React = require('react');
var Home = require('./views/home.jsx');

module.exports = {
  init: function() {
    var self = window.app = this;

    React.renderComponent(
      <Home />,
      document.getElementById('main')
    );
  }
};

module.exports.init();
