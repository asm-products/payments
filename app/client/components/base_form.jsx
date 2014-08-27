/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <form role="form" onSubmit={this.props.onSubmit}>
        {this.props.children}
        <a className="btn btn-primary btn-block" onClick={this.props.onSubmit}>{this.props.buttonText}</a>
      </form>
    );
  }
});
