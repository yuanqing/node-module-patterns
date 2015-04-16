'use strict';

var foo = function(opts) {
  if (!(this instanceof foo)) {
    return new foo(opts);
  }
  opts = opts || {};
  opts.bar = opts.bar || 42;
  this.opts = opts;
};
foo.prototype.fn = function() {
  return this.opts.bar;
};

module.exports = foo;
