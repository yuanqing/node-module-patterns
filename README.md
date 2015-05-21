# node-module-patterns [![Version](https://img.shields.io/badge/version-v0.0.0-orange.svg?style=flat)](https://github.com/yuanqing/node-module-patterns/releases) [![Build Status](https://img.shields.io/travis/yuanqing/node-module-patterns.svg?style=flat)](https://travis-ci.org/yuanqing/node-module-patterns)

> Simple patterns for Node modules.

&hellip;or, patterns for what to assign to `module.exports`.

## Patterns

- [Function](#i-function)
- [Object Literal](#ii-object-literal)
- [Function With Members](#iii-function-with-members)
- [Function Returning a Function](#iv-function-returning-a-function)
- [Constructor](#v-constructor)

### I. Function

Export a single function.

```js
var foo = function() {
  return 42;
};

module.exports = foo;
```

```js
// USAGE

var foo = require('foo');

foo(); //=> 42
```

<sup>[&#8617;](#patterns)</sup>

### II. Object Literal

Export an object literal with members.

```js
var foo = {};
foo.fn = function() {
  return true;
};

module.exports = foo;
```

```js
// USAGE

var foo = require('foo');

foo.fn(); //=> true
```

<sup>[&#8617;](#patterns)</sup>

### III. Function With Members

Export a function object with members.

This pattern is different from the *Object Literal* pattern in that the function object can itself be invoked.

```js
var foo = function() {
  return 42;
};
foo.fn = function() {
  return true;
};

module.exports = foo;
```

```js
// USAGE

var foo = require('foo');

foo();    //=> 42
foo.fn(); //=> true
```

<sup>[&#8617;](#patterns)</sup>

### IV. Function Returning a Function

Export a function that accepts options, does some pre-processing based on the given options, before finally returning a function.

The returned function has access to variables in the enclosing scope. In our example, the returned function has access to the variable `bar` in the scope of `foo`.

```js
var foo = function(opts) {
  opts = opts || {};
  var bar = opts.bar || 42;
  return function() {
    return bar;
  };
};

module.exports = foo;
```

```js
// USAGE

var foo = require('foo');

var x = foo();
x(); //=> 42

var y = foo({ bar: true });
y(); //=> true
```

<sup>[&#8617;](#patterns)</sup>

### V. Constructor

Export a constructor for an object. The constructor accepts options, which are used to initialise the object.

The object&rsquo;s member variables can be defined on `this`, or on the `prototype`.

#### Members on `this`

If member variables are defined on `this`, each instance of the object would **have its own copy** of each member.

Member functions have access to variables in the enclosing scope. In our example, the function `fn` has access to the variable `bar` in the scope of the function `foo`. We can think of `bar` as a private member variable because it cannot be accessed or modified from the &ldquo;outside&rdquo;.

```js
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
```

```js
// USAGE

var foo = require('foo');

var x = new foo();
x.fn(); //=> 42
x.bar;  //=> undefined

var y = foo({ bar: true });
y.fn(); //=> true
y.bar;  //=> undefined
```

#### Members on `prototype`

If member variables are defined on the `prototype`, each instance of the object would **share the same copy** of each member.

Private member variables are not possible with this pattern. In our example, because we want to access `opts` in the member function `fn`, we assign `opts` to `this.opts`, and as a result, `opts` can be accessed and modified from the &ldquo;outside&rdquo;.

```js
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
```

```js
// USAGE

var foo = require('foo');

var x = foo();
x.fn();     //=> 42
x.opts.bar; //=> 42

var y = foo({ bar: true });
y.fn();     //=> true
y.opts.bar; //=> true

y.opts.bar = 'no privacy';
y.fn();     //=> 'no privacy'
```

<sup>[&#8617;](#patterns)</sup>

## License

[MIT](https://github.com/yuanqing/node-module-patterns/blob/master/LICENSE)
