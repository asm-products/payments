/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
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
      style: {
        visibility: 'hidden'
      }
    });
  },

  render: function() {
    return (
      <div className="alert alert-success" role="alert" style={this.state.style}>
        <button type="button" className="close" onClick={this.onClick}>
          <span className="fa fa-times" aria-hidden="true"></span>
        </button>
        {this.props.message}
      </div>
    );
  }
});
