'use strict';

var foo = function(opts) {
  if (!(this instanceof foo)) {
    return new foo(opts);
  }
  opts = opts || {};
  var bar = opts.bar || 42;
  this.bar = bar;
};
foo.prototype.fn = function() {
  return this.bar;
};

module.exports = foo;
