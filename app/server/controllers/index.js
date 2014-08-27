module.exports.index = function * index(next) {
  this.body = yield this.render('index', { title: 'Assembly Payments' });
};
