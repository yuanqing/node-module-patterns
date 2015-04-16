'use strict';

var foo = function() {
  return 42;
};
foo.fn = function() {
  return true;
};

module.exports = foo;
