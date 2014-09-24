var expect = require('chai').expect;
var server = require('../../app/server');

describe('index', function() {
  it('starts', function() {
    expect(server.env).to.equal('test');
  });
});
