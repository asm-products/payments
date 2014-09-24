var expect = require('chai').expect;
var render = require('../../../app/server/lib/render');

describe('render', function() {
  it('sets up and returns the template rendering function', function() {
    expect(typeof render).to.equal('function');
  });
});
