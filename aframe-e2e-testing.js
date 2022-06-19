// This module is equivalent to index.js.
// It exists to allow Plywright config & scripts *within* this package to access
// the packe's own exports.
// They do so like this (example from the test scripts).
//
// module.paths.push(`${module.path}/../..`
// const { A } = require('aframe-e2e-testing');

const A = require('./src/aframe-pw-utils.js')
const extend = require('./src/expect-extensions.js')

module.exports = { A, extend }
