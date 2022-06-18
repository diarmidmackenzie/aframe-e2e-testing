const { expect } = require('@playwright/test');

exports.extendExpect = function() {

  expect.extend({
      toBeApprox(received, expected) {
        const pass = (Math.abs(expected - received) < 1e-09);
        if (pass) {
          return {
            message: () =>
              `expected ${received} to be approximately equal to ${expected}`,
            pass: true
          }
        } else {
          return {
            message: () =>
              `expected ${received} to be approximately equal to ${expected}`,
            pass: false,
          };
        }
      }
  });

  expect.extend({
    toBeNakedId(received) {
      const pass = (received[0] !== '#');
      if (pass) {
        return {
          pass: true
        }
      } else {
        return {
          message: () =>
            `expected ${received} to be a naked Element Id without a leading #.`,
          pass: false,
        };
      }
    }
  });

  /**
  * This takes a function that will return an object, and an object containing a set of key/value pairs
  * that are expected in the returned object.
  * It then calls the async function repeatedly (every 200 msecs by default) until:
  *   - all the kay/value pairs match
  *   - or a timeout is reached (default 5000 msecs.)
  * @param   {function} fn              - The function to call to get a value
  * @param   {object}   matchObject     - An object specifying a set of key/value pairs to check for in the returned object.
  *                                       This can also be a non-object type, in which case it is compared directly against the
  *                                       return value.
  * @param   {object}   options         - Various options - see next parameters.
  * @param   {boolean}  options.debug   - True to generate debug logs to console.  Default is false.
  * @param   {number}   options.timeout - How long (msecs) to try calling the function before failing.  Defult is 5000msecs.
  * @param   {number}   options.retry   - How long (msecs) to wait between function calls.  Default is 200msecs.
  * @param   {number}   options.dps     - How many DPs of accuracy to check for.  Default is -1, which implies perfect accuracy required.
  */
  expect.extend({
    async toReturn(fn, matchObject, options = {}) {

      // set up parameters from options.
      const debug = options.hasOwnProperty('debug') ? options.debug : false
      const timeout = options.hasOwnProperty('timeout') ? options.timeout : 5000
      const retry = options.hasOwnProperty('retry') ? options.timeout : 200
      const dps = options.hasOwnProperty('dps') ? options.dps : -1
      
      function isObject(x) {
        return (x === Object(x))
      }

      function areEqual(x, y) {

        if (dps < 0) {
          return (x === y)
        }
        else {
          const accuracy = Math.pow(10, -dps)
          return (Math.abs(x - y) < accuracy);
        }
      }

      function deepEqual(x, y) {      
        var match = false;

        if (isObject(x)) {
          if (Object.keys(x).length === Object.keys(y).length) {
            match = Object.keys(x).every(key => deepEqual(x[key], y[key]))
          }
        }
        else {
          match = areEqual(x, y)
        }

        return match
      }

      var returnValue;
      var testFailed = false;

      const timeoutTimer = setTimeout(() => {      
        //console.log(`Timed out waiting for function ${fn} to return ${Object.entries(matchObject)}.  Last returned value: ${returnValue ? Object.entries(returnValue) : null}`);      
        testFailed = true;
      }, timeout)

      var pass = false;
      while (!pass) {

        if (testFailed) {
          return {
            message: () => `timed out waiting for function ${fn} to return ${Object.entries(matchObject)}.  Last returned value: ${returnValue ? Object.entries(returnValue) : null}`,
            pass: false,
          }
        }

        await new Promise(r => setTimeout(r, retry));
        if (debug) console.log("Calling function", fn)
        returnValue = await fn();
        if (debug) console.log("matchObject: ", matchObject)
        if (debug) console.log("returnValue: ", returnValue)

        // begin with optimism...
        pass = true;
        
        if (isObject(matchObject) && returnValue) {

          Object.entries(matchObject).forEach((entry) => {

            // exit early if we already determined that the test is not yet passed.
            if (!pass) return;

            var match = false;
            const x = entry[1]
            const y = returnValue[entry[0]]

            if (debug) console.log("comparing ", x, " with ", y)

            // check if we are comparing objects...
            if (isObject(x)) {
              if (debug) console.log("Comparing objects")
              // comparing objects. 
              match = deepEqual(x, y)            
            }
            else {
              match = areEqual(x, y)
            }

            if (!match) {
              pass = false;
              if (debug) console.log("No match - call function again after a pause")
            }
            else {
              if (debug) console.log("They matched - check the next entries")
            }
          })
        }
        else {
          pass = (matchObject === returnValue)
          if (debug) console.log("Match object is not an object.  Direct comparison returns: ", pass)
        }

        if (pass) {
          clearTimeout(timeoutTimer);
          if (debug) console.log("Expect toReturn() check passed!")
          return {        
            pass: true,
          };
        }
      }    
    },
  });
}