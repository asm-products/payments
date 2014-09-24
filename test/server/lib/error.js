var expect = require('chai').expect;
var error = require('../../../app/server/lib/error');

describe('error', function() {
  it('returns a function', function() {
    expect(typeof error).to.equal('function');
  });

  it('sets the status and body of its context', function() {
    var context = {};

    error.call(context, new Error('test error'));

    expect(context.status).to.equal(500);
    expect(context.body).to.equal('test error');
  });
});
