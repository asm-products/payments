/** @jsx React.DOM */

var React = require('react');

module.exports = {
  getInitialState: function() {
    return {
      style: {
        visibility: 'hidden'
      }
    };
  },

  onClick: function(e) {
    e.preventDefault();

    this.setState({
      message: '',
      style: {
        visibility: 'hidden'
      }
    });
  },

  render: function() {
    return (
      <div className={"alert alert-" + this.state.alertClass} role="alert" style={this.state.style}>
        <button type="button" className="close" onClick={this.onClick}>
          <span className="fa fa-times" aria-hidden="true"></span>
        </button>
        {this.state.message}
      </div>
    );
  }
};
