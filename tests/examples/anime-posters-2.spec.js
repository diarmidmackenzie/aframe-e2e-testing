// @ts-check
const { test, expect } = require('@playwright/test');

// This allows aframe-e2e-testing exports to be used inside arame-e2e-testing itself.
// Not required when aframe-e2e-testing is imported as a dependency (in which case it will be 
// accessed via node_modules).
module.paths.push(`${module.path}/../..`)

const { A } = require('aframe-e2e-testing');

// Example test.
// Timeouts between steps in the tests are primarily for the benefit of people 
// watching the test in headed mode.
// Timeouts are deliberately positioned *before* inputs so that they don't interfere with timing of test simtmuli/responses.
// Set slowMotion to false to skip timeouts.
const slowMotion = true;

test('Test A-Frame Responsive UI Example - in VR', async ({ page }) => {

  A.setPage(page);

  await page.goto('https://aframe.io/aframe/examples/showcase/ui/');

  A.setCursorEntity('a-scene');
  // Wait for A-Frame page to render...
  
  // Enter VR
  await A.enterVR()
  
  // Set position of right and left hands.
  await A.setEntityPosition('#leftHand', -0.5, 1, -1)
  await A.setEntityPosition('#rightHand', 0.5, 1, -1)
  
  // Part 1 - Hover effects on button.

  // observe initial color the button.
  // The scene takes an indeterminate amount of time to load up.
  // using expect.toReturn() allows us to wait for this result to be rendered,
  // rather than expecting it to be rendered immediately.
  var getColor = async () => (await A.getEntityMaterial('#karigurashiButton')).color;
  await expect(getColor).toReturn(A.color(0xffffff));

  if (slowMotion) await page.waitForTimeout(1000);

  // point controller at a button.
  await A.pointControllerAt('#rightHand', '#karigurashiButton', 'oculus-touch-v3');  
  
  // observe color change.  This may not happen instantly due to raycaster timing interval, so await this using expect.toReturn()
  await expect(getColor).toReturn(A.color(0x046de7));
  
  if (slowMotion) await page.waitForTimeout(1000);

  // point controller away from button.
  await A.pointControllerAt('#rightHand', '#leftHand', 'oculus-touch-v3');  
  
  // observe color change.  This may not happen instantly due to raycaster timing interval, so await this using expect.toReturn()
  await expect(getColor).toReturn(A.color(0xffffff));

  // Part 2 - Click button (press trigger while pointing at it) and observe Info Panel.

  // Initially, info panel is not visible.
  var data = await A.getEntityVisibility('#infoPanel')  
  expect(data.visible).toBe(false);

  if (slowMotion) await page.waitForTimeout(1000);  

  // point controller at a button.
  await A.pointControllerAt('#rightHand', '#karigurashiButton', 'oculus-touch-v3');
  // observe color change.  This may not happen instantly due to raycaster timing interval, so await this using expect.toReturn()
  await expect(getColor).toReturn(A.color(0x046de7));

  // Click on button, info panel becomes visible.
  await A.fireCustomEvent('#rightHand', 'triggerdown');  
  await A.fireCustomEvent('#rightHand', 'triggerup');
  data = await A.getEntityVisibility('#infoPanel')  
  expect(data.visible).toBe(true);

  // Movie image, title and description are also now visible...
  // Having used expect.getReturn() to await for visibility of the info panel, we can now directly check the
  // current values, with no need to wait using expect.toReturn().
  var data = await A.getEntityVisibility('#karigurashiMovieImage')  
  expect(data.visible).toBe(true);
  var textData = await A.getEntityAttributeValue('#movieTitle', 'text')
  expect(textData.value).toBe("The Secret World of Arrietty (2010)")
  textData = await A.getEntityAttributeValue('#movieDescription', 'text')
  expect(textData.value).toContain("Based on the 1952 novel The Borrowers")

  if (slowMotion) await page.waitForTimeout(1000);

  // Part 3 - Click away, and hide info panel again.
  // Click on the background, info panel and movie image become invisible again.  
  await A.pointControllerAt('#rightHand', '#background', 'oculus-touch-v3');
  await A.fireCustomEvent('#rightHand', 'triggerdown');
  await A.fireCustomEvent('#rightHand', 'triggerup');

  data = await A.getEntityVisibility('#infoPanel')  
  expect(data.visible).toBe(false);
  data = await A.getEntityVisibility('#karigurashiMovieImage')  
  expect(data.visible).toBe(false);

  if (slowMotion) await page.waitForTimeout(1000);

  // Exit VR
  await A.exitVR()

  if (slowMotion) await page.waitForTimeout(1000);

});
