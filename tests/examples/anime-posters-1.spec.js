// @ts-check
const { test, expect, chromium } = require('@playwright/test');

// This allows aframe-e2e-testing exports to be used inside arame-e2e-testing itself.
// Not required when aframe-e2e-testing is imported as a dependency  (in which case it will be 
// accessed via node_modules).
module.paths.push(`${module.path}/../..`)

const { A } = require('aframe-e2e-testing');

// Example test.
// Timeouts between steps in the tests are primarily for the benefit of people 
// watching the test in headed mode.
// Timeouts are deliberately positioned *before* inputs so that they don't interfere with timing of test simtmuli/responses.
// Set slowMotion to false to skip timeouts.  Test script should run cleanly with slowMotion = false;
const slowMotion = true;

test('Test A-Frame Responsive UI Example', async ({ page }, testInfo) => {

  A.setPage(page);  

  await page.goto('https://aframe.io/aframe/examples/showcase/ui/');
  
  A.setCursorEntity('a-scene');
  
  // Part 1 - Hover effects on button.

  // observe initial color the button.
  // The scene takes an indeterminate amount of time to load up.
  // using expect.toReturn() allows us to wait for this result to be rendered,
  // rather than expecting it to be rendered immediately.
  var getColor = async () => (await A.getEntityMaterial('#karigurashiButton')).color;
  await expect(getColor).toReturn(A.color(0xffffff));

  if (slowMotion) await page.waitForTimeout(1000);
  // hover mouse over.
  await A.cursorMouseEnter('#karigurashiButton');
  
  // observe color change.  Since we generate cursor event directly, bypassing the raycaster, we can expect
  // an immediate response, and there is no need to use expect.toReturn() here, or through the rest of this test script.
  var material = await A.getEntityMaterial('#karigurashiButton');
  expect(material.color).toStrictEqual(A.color(0x046de7));
  
  if (slowMotion) await page.waitForTimeout(1000);
  // hover mouse away.
  await A.cursorMouseLeave('#karigurashiButton');
  
  // observe color change.
  material = await A.getEntityMaterial('#karigurashiButton');
  expect(material.color).toStrictEqual(A.color(0xffffff));

  // Part 2 - Click button and observe Info Panel.

  // Initially, info panel is not visible.
  var data = await A.getEntityVisibility('#infoPanel')  
  expect(data.visible).toBe(false);

  if (slowMotion) await page.waitForTimeout(1000);
  
  // Click on button, info panel becomes visible.
  await A.cursorClick('#karigurashiButton');
  data = await A.getEntityVisibility('#infoPanel')  
  expect(data.visible).toBe(true);

  // Movie image, title and description are also now visible...
  var data = await A.getEntityVisibility('#karigurashiMovieImage')  
  expect(data.visible).toBe(true);

  var textData = await A.getEntityAttributeValue('#movieTitle', 'text')
  expect(textData.value).toBe("The Secret World of Arrietty (2010)")

  textData = await A.getEntityAttributeValue('#movieDescription', 'text')
  expect(textData.value).toContain("Based on the 1952 novel The Borrowers")

  // Part 3 - Click away, and hide info panel again.

  if (slowMotion) await page.waitForTimeout(1000);
  
  // Click on the background, info panel and movie image become invisible again.  
  await A.cursorClick('#background');
  data = await A.getEntityVisibility('#infoPanel')  
  expect(data.visible).toBe(false);
  data = await A.getEntityVisibility('#karigurashiMovieImage')  
  expect(data.visible).toBe(false);

  if (slowMotion) await page.waitForTimeout(1000);

});
