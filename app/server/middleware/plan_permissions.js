var request = require('co-request');
var handleError = require('./error');

module.exports = function *planPermissions(next) {
  var slug = this.params.product;
  var token = this.request.header['authentication-token'];
  var result = yield request(
    process.env.ASSEMBLY_API + 'products/' + slug + '/core_team.json?token=' + token
  );

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
