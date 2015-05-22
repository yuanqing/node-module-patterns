'use strict';

var foo = function(opts) {
  opts = opts || {};
  var bar = opts.bar || 42;
  return function() {
    return bar;
  };
};

module.exports = foo;
