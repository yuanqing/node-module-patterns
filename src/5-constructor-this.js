'use strict';

var foo = function(opts) {
  if (!(this instanceof foo)) {
    return new foo(opts);
  }
  opts = opts || {};
  var bar = opts.bar || 42;
  this.fn = function() {
    return bar;
  };
};

module.exports = foo;
