// @ts-check
const { test, expect } = require('@playwright/test');
const A = require('../../src/aframe-pw-utils.js');

// Example test.
// Timeouts between steps in the tests are primarily for the benefit of people 
// watching the test in headed mode.
// Timeouts are deliberately positioned *before* inputs so that they don't interfere with timing of test simtmuli/responses.
// Set slowMotion to false to skip timeouts.
const slowMotion = true;

test('Test A-Frame Responsive UI Example - in VR', async({ page }) => {

    A.setPage(page);

    await page.goto('https://stemkoski.github.io/A-Frame-Examples/quest-physics.html');

    A.setCursorEntity('a-scene');

    if (slowMotion) await page.waitForTimeout(5000);

    // Just checking scene is loaded. 
    // TODO - write test to check that scene is loaded.



});