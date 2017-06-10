# warn-if-not-memoized

[![Build Status](https://travis-ci.org/jcoreio/warn-if-not-memoized.svg?branch=master)](https://travis-ci.org/jcoreio/warn-if-not-memoized)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/warn-if-not-memoized/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/warn-if-not-memoized?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

warns if wrapped function is not memoized

## Usage

```
npm install --save warn-if-not-memoized
```
```js
var warnIfNotMemoized = require('warn-if-not-memoized')
```

## `warnIfNotMemoized(fn, options)`

Returns a wrapper for `fn` that will log a warning if successive calls to `fn` return values that are `!==` but are
deeply equal according to `options.isEqual` (which defaults to `lodash.isequal`).

The wrapper will return its previous return value if it is deeply equal to the next value `fn` returns.

### `options`
* `isEqual` (`(a: any, b: any) => boolean`): returns `true` if `a` and `b` are deeply equal (default: `lodash.isequal`)
* `logError` (`(message: string) => any`): logs the warning message (default: `console.error`)
* `functionName` (`string`): the name of the function to use in the warning message
* `createWarningMessage` (`(info: {functionName: ?string, arguments: Array<any>, returnValue: any, prevReturnValue: any}) => string`):
  creates a warning message when `fn` is determined to be not memoized.

### `warnIfNotMemoized.bypass` (`boolean`)

Set `warnIfNotMemoized.bypass = true` in production to make `warnIfNotMemoized` return `fn` without wrapping it.

### `warnIfNotMemoized.defaultOptions`

These are the global defaults for `options`.  The actual values `warnIfNotMemoized` uses are:
```js
require('lodash.defaults')({}, options, warnIfNotMemoized.defaultOptions)
```

