var request = require('co-request');
var handleError = require('../lib/error');
var render = require('../lib/render');

module.exports = {
  show: function *(next) {
    var info = yield request({
      uri: process.env.ASSEMBLY_API + '/products/' + this.params.product + '/info',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    });

    try {
      info = JSON.parse(info.body);

      this.locals.info = info;
      this.body = yield render('index', this.locals);
    } catch (e) {
      this.app.emit('error', e, this);

      handleError.call(this, e);
    }
  }
};
