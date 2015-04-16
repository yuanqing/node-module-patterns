'use strict';

var test = require('tape');

test('function', function(t) {
  t.plan(1);
  var foo = require('../src/1-function.js');
  t.equals(foo(), 42);
});

test('object literal', function(t) {
  t.plan(1);
  var foo = require('../src/2-object-literal.js');
  t.equals(foo.fn(), true);
});

test('function with members', function(t) {
  t.plan(2);
  var foo = require('../src/3-function-with-members.js');
  t.equals(foo(), 42);
  t.equals(foo.fn(), true);
});

test('function returning a function', function(t) {
  t.plan(2);
  var foo = require('../src/4-function-returning-a-function.js');
  var x = foo();
  t.equals(x(), 42);
  var y = foo({ bar: true });
  t.equals(y(), true);
});

test('constructor', function(t) {
  t.test('members on `this`', function(t) {
    t.plan(4);
    var foo = require('../src/5-constructor-prototype.js');
    var x = foo();
    t.equals(x.fn(), 42);
    t.equals(x.bar, undefined);
    var y = foo({ bar: true });
    t.equals(y.fn(), true);
    t.equals(y.bar, undefined);
  });
  t.test('members on `prototype`', function(t) {
    t.plan(5);
    var foo = require('../src/5-constructor-prototype.js');
    var x = foo();
    t.equals(x.fn(), 42);
    t.equals(x.opts.bar, 42);
    var y = foo({ bar: true });
    t.equals(y.fn(), true);
    t.equals(y.opts.bar, true);
    y.opts.bar = 'no privacy';
    t.equals(y.fn(), 'no privacy');
  });
});
