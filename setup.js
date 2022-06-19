// setup.js

/**
 * Script to run after npm install
 *
 * Copy selected files to user's directory
 */

 'use strict'

 const gentlyCopy = require('gently-copy')
 const chalk = require('chalk')
 
 const filesToCopy = ['playwright.config.js', 'tests']
 
 // User's local directory
 // Warning: This assumes the package is installed into `node_modules/<package-name>/`
 const userPath = '../../'
 
 // Moving files to user's local directory
 gentlyCopy(filesToCopy, userPath)

 const color = chalk.cyan
 console.log(color('\n=================='))
 console.log(color('aframe-e2e-testing'))
 console.log(color('=================='))
 console.log(color('Welcome to aframe-e2e-testing'))
 console.log(color('\nStarter configuration has been created in playwright.config.js'))
 console.log(color('Two sample scripts can be found in tests/examples/'))
 console.log(color('\nTo check everything is working, run: npx playwright test'))
 console.log(color('               or (for headed mode): npx playwright test --headed'))
 console.log(color('For more details see the README.md file in aframe-e2e-testing'))
 console.log(color('\n  Happy Testing!'))
 console.log(color('=================='))
 