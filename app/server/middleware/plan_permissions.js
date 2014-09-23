var request = require('co-request');
var handleError = require('../lib/error');

module.exports = function *planPermissions(next) {
  var slug = this.params.product;
  var token = this.get('Authorization');
  var result = yield request({
    uri: process.env.ASSEMBLY_API + '/products/' + slug + '/core_team?token=' + token,
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    }
  });

  try {
    var authorized = JSON.parse(result.body).authorized;
  } catch (e) {
    handleError.call(this, e);
  }

  if (!authorized) {
    this.response.status = 401;
    return this.body = "401 Unauthorized";
  }

  yield next;
};
