# node-module-patterns [![Version](https://img.shields.io/badge/version-v0.1.0-orange.svg?style=flat)](https://github.com/yuanqing/node-module-patterns/releases) [![Build Status](https://img.shields.io/travis/yuanqing/node-module-patterns.svg?style=flat)](https://travis-ci.org/yuanqing/node-module-patterns)

> Patterns for `module.exports`.

## Patterns

- [Function](#i-function)
- [Object Literal](#ii-object-literal)
- [Function With Members](#iii-function-with-members)
- [Function Returning a Function](#iv-function-returning-a-function)
- [Constructor](#v-constructor)

The examples given are also available in the [`src`](https://github.com/yuanqing/node-module-patterns/blob/master/src) directory.

## I. Function

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

Export a function object with members. This is different from the [Object Literal](#ii-object-literal) pattern in that the function object can itself be invoked.

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

The returned function has access to variables in the enclosing scope. In our example, the returned function has access to the variable `bar` in the scope of the function `foo`.

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

Export a constructor for an object. The constructor typically accepts options, which are used to initialise the object.

The object&rsquo;s member variables can either be defined on `this` or on the `prototype`.

#### Member variables on `this`

If member variables are defined on `this`, each instance of the object would **have its own copy** of each member variable.

Member functions have access to variables in the enclosing scope. In our example, the function `fn` has access to the variable `bar` in the scope of the function `foo`. In this sense, we can think of `bar` as a private member variable because it cannot be accessed or modified from outside the function `foo`.

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

#### Member variables on `prototype`

If member variables are defined on the `prototype`, each instance of the object would **share the same copy** of each member member.

Note that private member variables are not possible with this pattern. Variables we want to share between the member functions must be attached to `this`. In our example, because we want to access the variable `bar` in the member function `fn`, we assign `bar` to `this.bar`. As a result, each instance of `foo` has a member variable `bar` which can be accessed and modified from the outside.

```js
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
```

```js
// USAGE

var foo = require('foo');

var x = foo();
x.fn(); //=> 42
x.bar;  //=> 42

var y = foo({ bar: true });
y.fn(); //=> true
y.bar;  //=> true

y.bar = 'no privacy';
y.fn(); //=> 'no privacy'
```

<sup>[&#8617;](#patterns)</sup>

## A standalone module for Node and the browser

It is worth noting that if our module has no dependencies, and we want to make it available in both Node and the browser as a standalone module, we can skip the [Browserify](https://github.com/substack/node-browserify) (or [Webpack](https://github.com/webpack/webpack)) step via the following pattern:

```js
(function(window) {

  var foo = /* ... */

  if (typeof module === 'object') {
    module.exports = foo;
  } else {
    window.foo = foo;
  }

})(this);
```

In the browser, the `else` branch is taken, and so our module is attached on the `window` object as `foo`.

```html
<!-- USAGE -->
<body>
  <script src="path/to/module.js"></script>
  <script>
    // `foo` available here
  </script>
</body>
```

## License

[MIT](https://github.com/yuanqing/node-module-patterns/blob/master/LICENSE)
