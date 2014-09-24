module.exports = function handleError(e) {
  this.status = e.status || 500;
  this.body = e.message;
};
