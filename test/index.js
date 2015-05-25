'use strict';

var test = require('tape');

test('function', function(t) {
  t.plan(1);
  var foo = require('../examples/1-function.js');
  t.equals(foo(), 42);
});

test('object literal', function(t) {
  t.plan(1);
  var foo = require('../examples/2-object-literal.js');
  t.equals(foo.fn(), true);
});

test('function with members', function(t) {
  t.plan(2);
  var foo = require('../examples/3-function-with-members.js');
  t.equals(foo(), 42);
  t.equals(foo.fn(), true);
});

test('function returning a function', function(t) {
  t.plan(2);
  var foo = require('../examples/4-function-returning-a-function.js');
  var x = foo();
  t.equals(x(), 42);
  var y = foo({ bar: true });
  t.equals(y(), true);
});

test('constructor', function(t) {
  t.test('members on `this`', function(t) {
    t.plan(4);
    var foo = require('../examples/5-constructor-this.js');
    var x = foo();
    t.equals(x.fn(), 42);
    t.equals(x.bar, undefined);
    var y = foo({ bar: true });
    t.equals(y.fn(), true);
    t.equals(y.bar, undefined);
  });
  t.test('members on `prototype`', function(t) {
    t.plan(5);
    var foo = require('../examples/5-constructor-prototype.js');
    var x = foo();
    t.equals(x.fn(), 42);
    t.equals(x.bar, 42);
    var y = foo({ bar: true });
    t.equals(y.fn(), true);
    t.equals(y.bar, true);
    y.bar = 'no privacy';
    t.equals(y.fn(), 'no privacy');
  });
});

test('pitfall', function(t) {
  t.plan(4);
  var foo = require('../examples/5-constructor-this.js');
  var opts = {
    bar: {
      baz: true
    }
  };
  var y = foo(opts);
  t.equals(y.fn(), opts.bar);
  t.looseEquals(y.fn(), { baz: true });
  delete opts.bar.baz;
  t.equals(y.fn(), opts.bar);
  t.looseEquals(y.fn(), {});
});
