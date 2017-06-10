function warnIfNotMemoized(fn, options) {
  if (warnIfNotMemoized.bypass) return fn

  options = require('lodash.defaults')({}, options, warnIfNotMemoized.defaultOptions)

  var isEqual = options.isEqual
  var logError = options.logError
  var functionName = options.functionName
  var createWarningMessage = options.createWarningMessage
  var creationError = new Error("function wrapped at:")
  var warned = false
  var prevReturnValue

  return function callAndCheckMemoized() {
    var returnValue = fn.apply(undefined, arguments)
    if (returnValue !== prevReturnValue && isEqual(returnValue, prevReturnValue)) {
      if (!warned) {
        warned = true
        var message = createWarningMessage({
          functionName: functionName,
          arguments: Array.prototype.slice.call(arguments),
          returnValue: returnValue,
          prevReturnValue: prevReturnValue,
        })
        logError(new Error(message).stack) // eslint-disable-line no-console
        logError(creationError.stack) // eslint-disable-line no-console
      }
      returnValue = prevReturnValue
    } else {
      prevReturnValue = returnValue
    }
    return returnValue
  }
}
warnIfNotMemoized.bypass = false
warnIfNotMemoized.defaultOptions = {
  isEqual: require('lodash.isequal'),
  logError: console.error, // eslint-disable-line no-console
  createWarningMessage: function createDefaultWarningMessage(info) {
    return [
      (info.functionName || 'Wrapped function') + "doesn't seem to be properly memoized.",
      "It returned a value that was deep equal to but !== the last return value, which can cause thrashing.",
      "You can use createSelector from reselect (https://github.com/reactjs/reselect#createselectorinputselectors--inputselectors-returnValuefunc) to create a memoized function.",
    ].join('\n')
  },
}

module.exports = warnIfNotMemoized
