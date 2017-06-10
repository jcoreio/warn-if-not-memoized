var warnIfNotMemoized = require('../lib')
var sinon = require('sinon')
var expect = require('chai').expect
var isEqual = require('lodash.isequal')

describe('warnIfNotMemoized', function () {
  function unmemoized(x) { return x }

  function memoized(x) {
    if (isEqual(memoized.prevReturnValue, x)) return memoized.prevReturnValue
    return memoized.prevReturnValue = x
  }

  describe('with default options', function () {
    var log = sinon.spy()

    beforeEach(function () { log.reset() })

    it("doesn't warn about memoized function", function () {
      var wrapped = warnIfNotMemoized(memoized, {logError: log})
      wrapped({foo: 'bar'})
      wrapped({foo: 'bar'})
      wrapped({foo: 'bar'})
      expect(log.called).to.be.false
    })
    it("warns about unmemoized function", function () {
      var wrapped = warnIfNotMemoized(unmemoized, {logError: log})
      wrapped({foo: 'bar'})
      wrapped({foo: 'bar'})
      expect(log.called).to.be.true
    })
    it("doesn't warn more than once", function () {
      var wrapped = warnIfNotMemoized(unmemoized, {logError: log})
      wrapped({foo: 'bar'})
      wrapped({foo: 'bar'})
      log.reset()
      wrapped({foo: 'bar'})
      wrapped({foo: 'bar'})
      expect(log.called).to.be.false
    })
    it("returns prev return value if it is deeply equal to next return value", function () {
      var arg0 = {foo: 'bar'}
      var arg1 = {foo: 'bar'}
      var wrapped = warnIfNotMemoized(unmemoized, {logError: log})
      expect(wrapped(arg0)).to.equal(arg0)
      expect(wrapped(arg1)).to.equal(arg0)
    })
  })
  describe('when .bypass = true', function () {
    before(function () { warnIfNotMemoized.bypass = true })
    after(function () { warnIfNotMemoized.bypass = false })
    it("returns input function", function () {
      expect(warnIfNotMemoized(unmemoized)).to.equal(unmemoized)
    })
  })
})

