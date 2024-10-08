(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.dev.unit.TestFunction": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2007-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Fabian Jakobs (fjakobs)
  
  ************************************************************************ */

  /**
   * A TestSuite is a collection of test functions, classes and other test suites,
   * which should be run together.
   */
  qx.Class.define("qx.dev.unit.AbstractTestSuite", {
    extend: qx.core.Object,
    type: "abstract",

    construct() {
      qx.core.Object.constructor.call(this);
      this._tests = [];
    },

    members: {
      _tests: null,

      /**
       * Add a single function to test
       *
       * @param name {String} Name of the function
       * @param fcn {Function} The test function
       */
      addTestFunction(name, fcn) {
        this._tests.push(new qx.dev.unit.TestFunction(null, name, fcn));
      },

      /**
       * Add a method from a class as test to the suite
       *
       * @param testCase {qx.dev.unit.TestCase} The class containing the test method
       * @param functionName {String} The name of the test method
       */
      addTestMethod(testCase, functionName) {
        this._tests.push(new qx.dev.unit.TestFunction(testCase, functionName));
      },

      /**
       * Add a test function to the suite, which fails.
       *
       * @param functionName {String} Name of the function
       * @param message {String} The fail message
       */
      addFail(functionName, message) {
        this.addTestFunction(functionName, function () {
          this.fail(message);
        });
      },

      /**
       * Run all tests using the given test result
       *
       * @param testResult {qx.dev.unit.TestResult} Test result class, which runs the tests.
       */
      run(testResult) {
        for (var i = 0; i < this._tests.length; i++) {
          this._tests[i].run(testResult);
        }
      },

      /**
       * Get a list of all test methods in the suite
       *
       * @return {Function[]} A list of all test methods in the suite
       */
      getTestMethods() {
        var methods = [];

        for (var i = 0; i < this._tests.length; i++) {
          var test = this._tests[i];

          if (test instanceof qx.dev.unit.TestFunction) {
            methods.push(test);
          }
        }

        return methods;
      }

    },

    destruct() {
      this._disposeArray("_tests");
    }

  });
  qx.dev.unit.AbstractTestSuite.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=AbstractTestSuite.js.map