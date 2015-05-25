# node-module-patterns [![Version](https://img.shields.io/badge/version-v0.1.1-orange.svg?style=flat)](https://github.com/yuanqing/node-module-patterns/releases) [![Build Status](https://img.shields.io/travis/yuanqing/node-module-patterns.svg?style=flat)](https://travis-ci.org/yuanqing/node-module-patterns)

> Patterns for `module.exports`.

<span id="contents"></span>
- [Patterns](#patterns)
  - [Function](#i-function)
  - [Object Literal](#ii-object-literal)
  - [Function With Members](#iii-function-with-members)
  - [Function Returning a Function](#iv-function-returning-a-function)
  - [Constructor](#v-constructor)
- [A pitfall](#a-pitfall)
- [Standalone modules](#standalone-modules)

## Patterns

All examples are available in the [`examples`](https://github.com/yuanqing/node-module-patterns/blob/master/examples) directory.

## I. Function

Export a single function.

```js
// IMPLEMENTATION

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

<sup>[&#8617;](#contents)</sup>

### II. Object Literal

Export an object literal with members.

```js
// IMPLEMENTATION

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

<sup>[&#8617;](#contents)</sup>

### III. Function With Members

Export a function object with members. This is different from the [Object Literal](#ii-object-literal) pattern in that the function object can itself be invoked.

```js
// IMPLEMENTATION

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

<sup>[&#8617;](#contents)</sup>

### IV. Function Returning a Function

Export a function that accepts options, does some initialisation/pre-processing based on the given options, before returning another function.

```js
// IMPLEMENTATION

var foo = function(opts) {
  opts = opts || {};
  var bar = opts.bar || 42;
  return function() {
    return bar;
  };
};

module.exports = foo;
```

Note that the returned function has access to variables in the enclosing scope. So, in our example, the returned function has access to the variable `bar` in the scope of `foo`.

```js
// USAGE

var foo = require('foo');

var x = foo();
x(); //=> 42

var y = foo({ bar: true });
y(); //=> true
```

This pattern can be used for procedures with an expensive initialisation phase (eg. compiling a regular expression) that would be repeated exactly for every function call if we had naively used the [Function](#i-function) pattern. Pulling out the code for initialisation allows us to do the initialisation just once, rather than repeatedly.

<sup>[&#8617;](#contents)</sup>

### V. Constructor

Export a constructor for an object. The constructor typically accepts options for initialising the object.

The object&rsquo;s member variables can either be defined on `this` or on the `prototype`.

#### a. Member variables on `this`

Member functions have access to variables in the enclosing scope. This, in effect, **allows our object to have private member variables**.

```js
// IMPLEMENTATION

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

In our example, the member function `fn` has access to the variable `bar` in the scope of the function `foo`. So, `bar` is essentially a private member variable in that it can only be accessed and modified by the member functions defined on `this`.

(Note that because of our initial `if` check, the `new` keyword can be omitted when constructing an instance of `foo`.)

```js
// USAGE

var foo = require('foo');

var x = foo();
x.fn(); //=> 42
x.bar;  //=> undefined

var y = foo({ bar: true });
y.fn(); //=> true
y.bar;  //=> undefined
```

#### b. Member variables on `prototype`

This pattern **does not allow our object to have private member variables**. Any variable we want to share among our member functions must be attached to `this`.

```js
// IMPLEMENTATION

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

In our example, because we want to access the variable `bar` in the member function `fn`, we must assign `bar` to `this.bar`. As a result, each instance of `foo` has a member variable `bar` which can be accessed and modified from the &ldquo;outside&rdquo;.

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

<sup>[&#8617;](#contents)</sup>

## A pitfall

In JavaScript, [objects are passed by reference](http://snook.ca/archives/javascript/javascript_pass).This is particularly important to keep in mind when using the [Function Returning a Function](#iv-function-returning-a-function) or [Constructor](#v-constructor) patterns, where we&rsquo;re passing in an `opts` object literal.

Consider our Constructor example:

```js
// IMPLEMENTATION

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

In our implementation, we assign `opts.bar` to the variable `bar`. Because `opts.bar` is an object, we can affect our supposedly &ldquo;private&rdquo; variable `bar` by modifying the `opts.bar` object.

```js
// USAGE

var foo = require('foo');

var opts = {
  bar: {
    baz: true
  }
};
var z = foo(opts);
z.fn(); //=> { baz: true }
delete opts.bar.baz;
z.fn(); //=> {}
```

We can avoid this problem by simply *not* referencing any objects in the passed in `opts` in our implementation code. Another approach is to perform a deep clone of the `opts` object; the [`clone`](https://www.npmjs.com/package/clone) module is helpful here:

```js
// IMPLEMENTATION

var clone = require('clone');

// ...
opts = opts ? clone(opts) : {};
// ...
```

## Standalone modules

If our module has no dependencies, and we want to make it available in *both* Node and the browser as a lightweight, standalone module, we can omit the [Browserify](https://github.com/substack/node-browserify) (or [Webpack](https://github.com/webpack/webpack)) bundling step by doing the following:

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

In the browser, the `else` branch is taken, so our module is attached on the `window` object as `foo`:

```html
<body>
  <script src="path/to/module.js"></script>
  <script>
    // `foo` available here
  </script>
</body>
```

## License

[MIT](https://github.com/yuanqing/node-module-patterns/blob/master/LICENSE)
