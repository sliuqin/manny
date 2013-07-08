exports.views = {
    all: require('./views/all.js')
};
exports.listeners = {
    server_run: require('./listeners/server_run')
};
exports.uri = require('./uri.js');

var errors = {}
function NotFound(message) {
    this.name = '404';
    this.message = message;
}
errors.NotFound = NotFound;
NotFound.prototype = new Error();
NotFound.prototype.constructor = NotFound;

exports.errors = errors;
