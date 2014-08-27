var render = require('../lib/render');

exports.index = function *(next) {
  this.body = yield render('index', this.locals);
};
