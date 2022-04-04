# aframe-e2e-testing
An end-to-end testing framework for A-Frame, built on Playwright

[![image](https://user-images.githubusercontent.com/16045703/161606777-f3e381f9-311f-477b-a8b0-26b1442f72c6.png)](https://user-images.githubusercontent.com/16045703/161604672-6f65bfef-4e88-4c33-89c8-d28969784ff8.mp4)

## How to Run Example Tests

This repository includes some example tests, which run against various A-Frame examples.

After cloning the reposity, run:

`npm install`

`npx playwright install`



Then you can run the test scripts like this:

`npx playwright test` (for headless mode)

`npx playwright test --headed` (for headed mode)

`npx playwright test <script name>` to run an individual script.

for more details, including config, trace & debugging options please refer to [the playwright docs](https://playwright.dev/docs/intro)

These example scripts include some pauses for obervability / demonstration reasons when running in headed mode, but I have been careful to put these pauses in places where the script is not dependent on them for successful execution.  In most cases it is bad practice to depend on pauses in test scripts for them to run reliably - see `expect.toReturn()` below for an alternative to pauses in test scripts.



## Writing Your Own Tests

For now, the best way to get started writing tests is to fork this repository (or copy the content via some other method) and use it as a basis for your own tests.  Take care to remove or modify the MIT License, if you don't want it to apply to your test scripts.

Unfortunately, this will make it a little complex to merge in future enhancements made to this repository.

In future I hope to make this repo available as an NPM package that can be installed, updated etc.

You can base your tests on the example tests in the tests folder, in combination with the API docs for the A-Frame Utilities (see below), and the [Playwright API docs](https://playwright.dev/docs/api/class-playwright).



## A-Frame Utilities

This repository contains a range of utility functions that are specifically helpful for test automation of A-Frame applications.  It also contains guidelines for extensions to this API for either generic or application-specific purposes.

API Documentation can be found here: https://diarmidmackenzie.github.io/aframe-e2e-testing/out/

 

### Generating the Documentation

To generate the documentation:

From the root directory, run: `npx jsdoc -R src/README.md src`



### Expect extensions

We have a few useful extensions to the Expect library.

`expect(x).toBeApprox(value, dps)`

- value: the value to check against
- dps (optional, default: 9): the number of decimal places to check.

Useful for comparing positions or rotations that may have minor floating point deviations.



`expect(x).toBeNakedId()`

Checks that a supplied entity identifier is a naked id, and does not begin with #.  Useful for input checking on functions that expect an entity Id, rather than a selector.



`expect(x).toReturn(object, debug, timeout, frequency)`

- x: should be a function that returns an object.  Can be an async function.
- object: a set of key/value pairs that are expected to be returned by the function.
- debug (optiona, default: false): output logs to help debug unexpected results.
- timeout (optional, default: 5000): the number of msecs to wait for the function to return matching values.
- retry (optional, default: 200), the number of msecs to wait between one call of the function and the next.

This function will call the supplied function x repeatedly, based on the retry setting, until it returns all the key/value pairs specified in the object - or until a timeout is reached.

This can be extremely useful in test scripts where you want to check that something updates to a new value, but you don't know exactly when it will happen (e.g. because it depends on network replication from another client, or depends on raycasting which typically runs on a timer and therefore is not instantaneous).

Example usage:

```
var getMaterial = async () => await A.getEntityMaterial("#box")
await expect(getMaterial).toReturn({color: A.color(0xffffff)})
```

Using expect.toReturn() is strongly recommended over padding your scripts with additional timers, which tend to lead to flaky, heard-to-main test scripts that don't run as quickly as they could.



## Why Playwright?

[Playwright](https://playwright.dev/) is a modern framework for end-to-end testing in the browser, with a wide range of advantages.

While selenium/web driver still have many strong advocates, more modern tools such as Playwright & Cypress provide an easier learning curve, and are being widely adopted in the industry, with a great deal of success.

Unfortunately Cypress has a significant limitation that a single test cannot run against multiple browser instances, which means that Cypress cannot straightforwardly test multi-user experiences.

Playwright does not have this limitation, which is why it was selected as the base for this framework.



## Acknowledgements

The test framework in this repository was originally developed in collaboration with Virtonomy (https://virtonomy.io).

I am grateful to them for giving me permission to release these components as Open Source under the MIT License.



## Restrictions

VR tests currently only run against Chromium.  Firefox / Webkit not yet supported for VR tests.

Non-VR tests typically work against all browsers.
