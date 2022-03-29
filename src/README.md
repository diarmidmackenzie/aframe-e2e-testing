This is the documentation for the A-Frame Playwright Utility libraries.

We recommend that these are included by test scripts as follows:

```
const A = require('./src/aframe-pw-utils.js');
```



Functions can be then used like this:

```
controls = A.getTransformControls();
```

or

```
await A.setEntityPosition('#myEntity', 0.75, 1.5, -3)
```



Many functions need a page context to operate.  Set this up as follows:

```
A.setPage(page)
```

where `page` is the Playwright page object for the page you wish to use.  This page this then used for all operations until the next call to A.setPage.

Many functions are async functions.  These should be called with `await` as per the example above.





The library includes a range of "page functions", which can be identified as their names begin with pf.

These page functions are intended to be executed inside the pages of the application under test, using the playwright `evaluate()`function.

In general, these should not be used directly from test scripts, which should make direct calls to the respective top-level scoped wrapper functions.  However documentation of these page functions is useful for those extending these libraries, and there may be rare occasions when it is desirable to use them directly from a test script.



### Application-specific Library Extensions

For any complex application, it's likely that you'll want to extend the library with a range of application-specific functions.

Recommended approach to this is as follows:

- pick an abbreviation other than "A" for your application-specific extensions.  For example, "X"
- create a module containing your application-specific extensions in the same folder as "aframe-pw-utils".
- start this module with the following code:

```
const { expect } = require('@playwright/test');
const A = require('./aframe-pw-utils.js');

// Include all A-Frame utils in our exports.
Object.assign(exports, A);
const X = exports;
```

- From within this module, you can invoke the base A-Frame Playwright Utility functions like this: `A.<function_name>()`
- From within your scripts, you can invoke any utility function, whether part of the A-Frame library, or your extensions like this: `X.<function_name>()`
- By using jsdoc, you can generate documentation for the full extended API.



### API Design Guidelines

The API conforms as far as possible with the following guidelines.  As far as possible, they should be maintained when extending the library, and we also recommend these guidelines are also followed where possible for application-specific extensions.

The overall principle here is consistency - which includes internal consistency, and consistency with how Playwright APIs tend to work.

The keys benefit of this consistency are a lower level of low-level errors (which can be frustratingly time-consuming to diagnose, and less cognitive load when developing test scripts.



| Guideline                                                    |
| ------------------------------------------------------------ |
| Very explicitly distinguish between selectors and element IDs.  Any parameter named entityId or elementId expects a naked element Id (no leading #) and should use A.checkId() to ensure the Id is a naked Id, and not a selector.  This check should be implemented *outside* of page functions (i.e. in wrapper functions), so that errors are easily spotted in console logs.<br /><br />We strongly considered mandating that selectors are always used over naked ids.  But since we sometimes want to check element IDs, and element ids are stored naked, it's not possible to take that approach and maintain consistency. |
| Variables that can take arbitrary selectors are called "selector", or "xxxSelector" (e.g. targetSelector) when disambiguation is required. |
| Variables that only take element IDs are called "elementId" or "entityId", or "xxxId" for some other xxx when disambiguation is required (e.g. targetId).<br /><br />Where an A-Frame entity is concerned, entityId is better than elementId.  Avoid being over-specific where context already makes the reference clear. |
| Functions to read and write data to/from the app are called getX and setX, and X is always the same.<br />X is carefully chosen so that it reads well with both Get & Set.  E.g. "getSliderValue" rather than "getSlider" (the latter could be read as providing a reference to the slider itself, rather than the value). |
| Entity = A-Frame Entity.  Don't call these "objects"         |
| Element = Any DOM element (which could be e.g a 2D React Element or A-Frame Entity or something else). |
| Acronyms in CamelCase are rendered like VrGui, not VRGui, VrGui or VRGUI. |
| Page Functions are always named pfX.  Where it makes sense, X should closely match a utility function that wraps the page function.  However there will be cases where this doesn't apply. |
| Page Functions only take a single parameter.  This is either:<br />- a single named parameter when only one parameter is needed<br />- or a parameter named `o`, which is an object containing the named parameters, when multiple parameters are needed. |
| Page Functions only return a single parameter.    This is either:<br />- a single named parameter when only one parameter is needed<br />- or a parameter named `o`, which is an object containing the named parameters, when multiple parameters are needed. |
| Parameters that have a similar role should always take the same name across all functions.  Always check existing implementations and strive for consistency when implementing a new function. |
| All functions are marked with tags for inclusion in JSDoc-generated docs. |
| Position, Rotation etc. when unqualified always mean Local Position, Rotation etc.  use WorldPosition etc. for World position. |



