module.exports = function *(next) {
  this.accepts('application/json');

  yield next;
};
