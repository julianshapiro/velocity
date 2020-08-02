(function(factory) {

  // NOTE:
  // All techniques except for the "browser globals" fallback will extend the
  // provided QUnit object but return the isolated API methods

  // For AMD: Register as an anonymous AMD module with a named dependency on "qunit".
  if (typeof define === "function" && define.amd) {
    define(["qunit"], factory);
  }
  // For Node.js
  else if (typeof module !== "undefined" && module && module.exports && typeof require === "function") {
    module.exports = factory(require("qunitjs"));
  }
  // For CommonJS with `exports`, but without `module.exports`, like Rhino
  else if (typeof exports !== "undefined" && exports && typeof require === "function") {
    var qunit = require("qunitjs");
    qunit.extend(exports, factory(qunit));
  }
  // For browser globals
  else {
    factory(QUnit);
  }

}(function(QUnit) {

  /**
   * Find an appropriate `Assert` context to `push` results to.
   * @param * context - An unknown context, possibly `Assert`, `Test`, or neither
   * @private
   */
  function _getPushContext(context) {
    var pushContext;

    if (context && typeof context.push === "function") {
      // `context` is an `Assert` context
      pushContext = context;
    }
    else if (context && context.assert && typeof context.assert.push === "function") {
      // `context` is a `Test` context
      pushContext = context.assert;
    }
    else if (
      QUnit && QUnit.config && QUnit.config.current && QUnit.config.current.assert &&
      typeof QUnit.config.current.assert.push === "function"
    ) {
      // `context` is an unknown context but we can find the `Assert` context via QUnit
      pushContext = QUnit.config.current.assert;
    }
    else if (QUnit && typeof QUnit.push === "function") {
      pushContext = QUnit.push;
    }
    else {
      throw new Error("Could not find the QUnit `Assert` context to push results");
    }

    return pushContext;
  }

  /**
   * Checks that the first two arguments are equal, or are numbers close enough to be considered equal
   * based on a specified maximum allowable difference.
   *
   * @example assert.close(3.141, Math.PI, 0.001);
   *
   * @param Number actual
   * @param Number expected
   * @param Number maxDifference (the maximum inclusive difference allowed between the actual and expected numbers)
   * @param String message (optional)
   */
  function close(actual, expected, maxDifference, message) {
    var actualDiff = (actual === expected) ? 0 : Math.abs(actual - expected),
        result = actualDiff <= maxDifference,
        pushContext = _getPushContext(this);

    message = message || (actual + " should be within " + maxDifference + " (inclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff));

	if (pushContext.pushResult) {
		pushContext.pushResult({
			"result": result,
			"actual": actual,
			"expected": expected,
			"message": message
		});
	} else {
		pushContext.push(result, actual, expected, message);
	}
  }


  /**
   * Checks that the first two arguments are equal, or are numbers close enough to be considered equal
   * based on a specified maximum allowable difference percentage.
   *
   * @example assert.close.percent(155, 150, 3.4);  // Difference is ~3.33%
   *
   * @param Number actual
   * @param Number expected
   * @param Number maxPercentDifference (the maximum inclusive difference percentage allowed between the actual and expected numbers)
   * @param String message (optional)
   */
  close.percent = function closePercent(actual, expected, maxPercentDifference, message) {
    var actualDiff, result,
        pushContext = _getPushContext(this);

    if (actual === expected) {
      actualDiff = 0;
      result = actualDiff <= maxPercentDifference;
    }
    else if (actual !== 0 && expected !== 0 && expected !== Infinity && expected !== -Infinity) {
      actualDiff = Math.abs(100 * (actual - expected) / expected);
      result = actualDiff <= maxPercentDifference;
    }
    else {
      // Dividing by zero (0)!  Should return `false` unless the max percentage was `Infinity`
      actualDiff = Infinity;
      result = maxPercentDifference === Infinity;
    }
    message = message || (actual + " should be within " + maxPercentDifference + "% (inclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff + "%"));

	if (pushContext.pushResult) {
		pushContext.pushResult({
			"result": result,
			"actual": actual,
			"expected": expected,
			"message": message
		});
	} else {
		pushContext.push(result, actual, expected, message);
	}
  };


  /**
   * Checks that the first two arguments are numbers with differences greater than the specified
   * minimum difference.
   *
   * @example assert.notClose(3.1, Math.PI, 0.001);
   *
   * @param Number actual
   * @param Number expected
   * @param Number minDifference (the minimum exclusive difference allowed between the actual and expected numbers)
   * @param String message (optional)
   */
  function notClose(actual, expected, minDifference, message) {
    var actualDiff = Math.abs(actual - expected),
        result = actualDiff > minDifference,
        pushContext = _getPushContext(this);

    message = message || (actual + " should not be within " + minDifference + " (exclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff));

	if (pushContext.pushResult) {
		pushContext.pushResult({
			"result": result,
			"actual": actual,
			"expected": expected,
			"message": message
		});
	} else {
		pushContext.push(result, actual, expected, message);
	}
  }


  /**
   * Checks that the first two arguments are numbers with differences greater than the specified
   * minimum difference percentage.
   *
   * @example assert.notClose.percent(156, 150, 3.5);  // Difference is 4.0%
   *
   * @param Number actual
   * @param Number expected
   * @param Number minPercentDifference (the minimum exclusive difference percentage allowed between the actual and expected numbers)
   * @param String message (optional)
   */
  notClose.percent = function notClosePercent(actual, expected, minPercentDifference, message) {
    var actualDiff, result,
        pushContext = _getPushContext(this);

    if (actual === expected) {
      actualDiff = 0;
      result = actualDiff > minPercentDifference;
    }
    else if (actual !== 0 && expected !== 0 && expected !== Infinity && expected !== -Infinity) {
      actualDiff = Math.abs(100 * (actual - expected) / expected);
      result = actualDiff > minPercentDifference;
    }
    else {
      // Dividing by zero (0)!  Should only return `true` if the min percentage was `Infinity`
      actualDiff = Infinity;
      result = minPercentDifference !== Infinity;
    }
    message = message || (actual + " should not be within " + minPercentDifference + "% (exclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff + "%"));

	if (pushContext.pushResult) {
		pushContext.pushResult({
			"result": result,
			"actual": actual,
			"expected": expected,
			"message": message
		});
	} else {
		pushContext.push(result, actual, expected, message);
	}
  };


  var api = {
    close: close,
    notClose: notClose,
    closePercent: close.percent,
    notClosePercent: notClose.percent
  };

  QUnit.extend(QUnit.assert, api);

  return api;
}));
