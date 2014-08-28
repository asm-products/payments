module.exports = {
  get: function(path, callback) {
    this.request('GET', path, null, callback);
  },

  patch: function(path, data, callback) {
    this.request('PATCH', path, data, callback);
  },

  put: function(path, data, callback) {
    this.request('PUT', path, data, callback);
  },

  post: function(path, data, callback) {
    this.request('POST', path, data, callback);
  },

  request: function(method, path, data, callback) {
    if (!callback) {
      callback = function() {};
    }

    var tokenEl = document.getElementsByName('csrf-token')[0];
    var token = tokenEl && tokenEl.content;
    var request = new XMLHttpRequest();

    request.open(method, path, true);
    request.setRequestHeader('X-CSRF-Token', token);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        return callback(null, JSON.parse(request.responseText));
      }

      callback(new Error(request.responseText));
    }

    request.send(JSON.stringify(data));
  }
};
