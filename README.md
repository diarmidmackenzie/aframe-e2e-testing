# aframe-e2e-testing
An end-to-end testing framework for A-Frame, built on Playwright

![image](https://user-images.githubusercontent.com/16045703/161609447-d5902145-031f-4e58-98e5-751777cb8806.png)


[![image](https://user-images.githubusercontent.com/16045703/161606777-f3e381f9-311f-477b-a8b0-26b1442f72c6.png)](https://user-images.githubusercontent.com/16045703/161604672-6f65bfef-4e88-4c33-89c8-d28969784ff8.mp4)



## Get Started

The following instructions are suitable if you have an existing project that you want to write tests for, and

- You want to maintain the tests in the same repo at the project
- You have a folder `node_modules` at the root of your project (if you don't, either create it, or use `npm init` to set it up)
- You are happy for the test scripts to be stored in a folder names `tests` at the root of the project.
- You don't already have a `playwright.config.js` file in your root directory.

If this is all the case, you can install as follows:

- `npm install --save-dev aframe-e2e-testing`

This will install all required dependencies, including playwright & playwright browser binaries.  When it completes, you should see this message.

```
==================
aframe-e2e-testing
==================
Welcome to aframe-e2e-testing

Starter configuration has been created in playwright.config.js
Two sample scripts can be found in tests/examples/

To check everything is working, run: npx playwright test
               or (for headed mode): npx playwright test --headed
For more details see the README.md file in aframe-e2e-testing

  Happy Testing!
==================
```

Now you can run `npx playwright test` or `npx playwright test --headed` to see the example scripts running.



To create some scripts for *your* project...

- Copy one or both of the example scripts to e.g. `/tests/my_basic_tests/`

- Modify this line to point to a suitable URL

  ```
  await page.goto('https://aframe.io/aframe/examples/showcase/ui/');
  ```

  for  local development, this is probably something like this:

  ```
  await page.goto('http://localhost:8080/');
  ```

  (you can also set up a [base URL](https://playwright.dev/docs/test-configuration#basic-options) in `playwright.config.js`)

- Modify the script itself to interact with the entities on your page.  See the [A-Frame Utilities API](https://diarmidmackenzie.github.io/aframe-e2e-testing/out/) for details on what you can do.

- You'll probably want to delete the example scripts - or you could keep them for reference, and skip running them by adding a [testIgnore](https://playwright.dev/docs/api/class-testconfig#test-config-test-ignore) setting in `playwright.config.js`:

  ```
  testIgnore: '**/examples/**',
  ```



If you want your tests somewhere other than `/tests` just move the files, and update the value of `testDir` in `playwright.config.js`

If you had a pre-existing `playwright-config.js` file in your root directory, or pre-existing clashing filenames in `tests/examples/` , they won't have been overwritten.  You can get copy the default playwright config and sample scripts from [GitHub](https://github.com/diarmidmackenzie/aframe-e2e-testing), and manually set them up wherever you want.

For more details, including config, trace & debugging options please refer to [the playwright docs](https://playwright.dev/docs/intro)



## Modifying A-Frame Utilities

As you write tests, you may find you need to add or modify the [A-Frame Utilities](https://diarmidmackenzie.github.io/aframe-e2e-testing/out/) 

The currently recommended way to do this is to:

- fork the `aframe-e2e-testing`repo and clone it locally as a *sub-module* of your project, like this (filling in your username to point to the correct fork)

  ```
  git submodule add https://github.com/<username>/aframe-e2e-testing
  ```

- in the root directory of your project, run `npm install --save-dev .\aframe-e2e-testing`

You should now be able to

- run tests using `npx playwright test`
- modify your fork of `aframe-e2e-testing` in a version-controlled manner, with changes usable by test scripts in the parent project.

When you, or someone else, clones your project, they'll also clone the correct modified version of `aframe-e2e-testing`

If you do make changes to `aframe-e2e-testing`please consider submitting a PR to incorporate them upstream, so that other users can benefit from them.

This repository includes some example tests, which run against various A-Frame examples.

After cloning the reposity, run:

`npm install`

`npx playwright install`

Limit your changes in the `aframe-e2e-testing` submodule to changes that you want to share upstream.  Test scripts and utilities that are specific to your project should be developed in your main repository, outside this sub-module.

## Developing Scripts in a separate Repo

You may wish to keep your test scripts in a separate repository from your code.

In this case, you *could* do this by simply forking the `aframe-e2e-testing` repo, and developing your scripts directly there.

However, that will make it hard to share any updates to A-Frame Utilities upstream, as there's no clear separation between the test scripts you've developed, and any potentially re-usable updates that you have made to A-Frame Utilities.

So, even if you want test scripts in a separate repository from your code.



## Notes on Example Test Scripts

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



`expect(x).toReturn(object, options)`

- x: should be a function that returns an object.  Can be an async function.
- object: a set of key/value pairs that are expected to be returned by the function.
- options: an object containing key/value pairs specifying additional matching options:
  - debug (default: false): output logs to help debug unexpected results.
  - timeout (default: 5000): the number of msecs to wait for the function to return matching values.
  - retry (default: 200), the number of msecs to wait between one call of the function and the next.
  - dps (default: -1, which implies a perfect match), how many DPs of accuracy to check for.

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
