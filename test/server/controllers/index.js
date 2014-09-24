var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var controllers = require('../../../app/server/controllers');

describe('controllers', function() {
  it('exposes the controllers', function() {
    var keys = Object.keys(controllers);

    keys.forEach(function(key) {
      if (key !== 'index') {
        var filepath = path.resolve(
          __dirname, '../../../app/server/controllers/' + key + '_controller.js'
        );

        expect(fs.existsSync(filepath)).to.be.true;
      }
    });
  });
});
