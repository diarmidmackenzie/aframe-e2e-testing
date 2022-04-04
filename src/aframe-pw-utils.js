const { expect } = require('@playwright/test');

const A = exports;


/* Set default values. */
A.cursorEntitySelector = 'a-scene'

/**
 * Fire a custom event
 * @param {object} o           - Object that wraps all the function parameters
 * @param {string} o.entitySelector  - The DOM Selector of the entity to fire the event on
 * @param {string} o.event     - The name of the custom event to fire
 * @param {object} o.detail    - An optional object containing additional detail to include on the event.
 */
exports.pfFireCustomEvent = function (o) {
    const event = new CustomEvent(o.event, {
        detail: o.detail
    });
    const el = document.querySelector(o.entitySelector)
    el.dispatchEvent(event);
}

/**
 * Fire a custom event 
 * @param {string} entitySelector  - The DOM Selector of the entity to fire the event on
 * @param {string} event     - The name of the custom event to fire
 * @param {object} detail    - An optional object containing additional detail to include on the event.
 */
 exports.fireCustomEvent = async function (entitySelector,
                                           event, 
                                           detail = null) {

  await A.page.evaluate(A.pfFireCustomEvent,
                        {entitySelector: entitySelector,
                         event: event,
                         detail: detail});
}

/**
 * Enter VR (page function)
 * This function also simulates connnection of a pair of Oculus Quest 2 controllers, on entry to VR.
 */
exports.pfXrEnterVR = function () {

    const scene = document.querySelector('a-scene')    

    // For now, we hardcode the presence of 2 x Oculus Quest v3 controllers
    // (these are the ones that come with the Quest 2).
    var trackedControlsSystem = scene && scene.systems['tracked-controls-webxr']
    if (!trackedControlsSystem) { return false; }
    trackedControlsSystem.controllers.push({hand: 'right', handedness: 'right', profiles: ['oculus-touch-controls', 'oculus-touch-v3']})
    trackedControlsSystem.controllers.push({hand: 'left', handedness: 'left', profiles: ['oculus-touch-controls', 'oculus-touch-v3']})

    scene.emit('controllersupdated');

    return;
}

/**
 * Enter VR
 * This function also simulates connnection of a pair of Oculus Quest 2 controllers, on entry to VR.
 * 
 */
exports.enterVR = async function () {

  const page = A.page;
  
  await page.click('.a-enter-vr-button')
  await page.evaluate(A.pfXrEnterVR);

}

/**
 * Exit VR
 * This function also simulates disconnnection of a pair of Oculus Quest 2 controllers, on entry to VR.
 */
exports.exitVR = async function () {

    const page = A.page;
    
    await page.keyboard.press('Escape');
    
    await A.fireCustomEvent('#leftHand', 'controllerdisconnected', {name: "oculus-touch-controls"});
    await A.fireCustomEvent('#rightHand', 'controllerdisconnected', {name: "oculus-touch-controls"});
}

/**
 * Set an entity's local position (object3D.position)
 * @param {object} o - Object that wraps all the function parameters
 * @param {string} o.entitySelector - The DOM Selector of the entity to re-position
 * @param {float} o.x - The value to set for the x co-ordinate
 * @param {float} o.y - The value to set for the y co-ordinate
 * @param {float} o.z - The value to set for the z co-ordinate
 */
exports.pfSetEntityPosition = function (o) {

      const el = document.querySelector(o.entitySelector);
      const object = el.object3D;

      if (o.x) {
          object.position.x = o.x
      }
      if (o.y) {
          object.position.y = o.y
      }
      if (o.z) {
          object.position.z = o.z
      }

      return;
}

/**
* Set an entity's local position (object3D.position)
* This can be used on any entity, but primarily intended for
* entities that can move autonomously (e.g. cameras and controllers).
* For realistc testing of entities within the scene that don't move autonomously
* consSelectorer moving them using the appropriate ens-user controls
* (e.g. Transform Controls, grab and move etc.)
* @param {enitySelector}  - The DOM Selector of the entity
* @param {float} x - The value to set for the x co-ordinate
* @param {float} y - The value to set for the y co-ordinate
* @param {float} z - The value to set for the z co-ordinate
*/
exports.setEntityPosition = async function(entitySelector, x, y, z) {

    await A.page.evaluate(A.pfSetEntityPosition, {entitySelector: entitySelector, x: x, y: y, z: z});
}

/**
 * Get an object's local position (object3D.position)
 * @param {entitySelector}  - The DOM Selector of the entity
 */
exports.pfgetEntityPosition = function(entitySelector) {

    const el = document.querySelector(entitySelector);
    const object = el.object3D;

    return(object.position);
}

/**
* Get an entity's local position (object3D.position)
* @param {entitySelector}  - The DOM Selector of the entity
*/
exports.getEntityPosition = async function(entitySelector) {

    const position = await A.page.evaluate(A.pfgetEntityPosition, entitySelector);
    return(position);
}

/**
* Get an entity's material (object3D.material of its Mesh)
* @param {entitySelector}  - The DOM Selector of the element to query
*/
exports.pfGetEntityMaterial = function(entitySelector) {

    const el = document.querySelector(entitySelector);
    const object = el.getObject3D('mesh');

    return(object.material);
}

/**
* Get an entity's material (object3D.material of its Mesh)
* @param {entitySelector}  - The DOM Selector of the element to query
*/
exports.getEntityMaterial = async function(entitySelector) {

    const material = await A.page.evaluate(A.pfGetEntityMaterial, entitySelector);
    return(material);
}

/**
 * Simulate a "mousenter" or "mouseleave" cursor event for an entity.
 * @param {object} o           - Object that wraps all the function parameters
 * @param {string} o.cursorSelector - The DOM Selector of the entity where the cursor is configured.
 * @param {string} o.targetSelector  - The DOM Selector of the entity that the mouse is hovering over.
 * @param {string} o.eventName  - The name of the event to emit.
 */
exports.pfCursorMouseEvent = function(o) {

    const target = document.querySelector(o.targetSelector);
    const event = new CustomEvent(o.eventName, {
      detail: {intersectedEl: target},
      bubbles: true
    });
    const cursor = document.querySelector(o.cursorSelector);

    // cursor dispatches event on both entities - simulate this.
    cursor.dispatchEvent(event);
    target.dispatchEvent(event);
}

/**
 * Simulate a "click" cursor event for an entity.
 * @param {object} o           - Object that wraps all the function parameters
 * @param {string} o.cursorSelector  - The DOM Selector of the entity where the cursor is configured.
 * @param {string} o.targetSelector  - The DOM Selector of the entity that is clicked.
 */
exports.pfClick = function(o) {

    const target = document.querySelector(o.targetSelector);
    const targetObject = target.getObject3D('mesh');
    const event = new CustomEvent('click', {
      detail: {intersection: { object: targetObject}},
      bubbles: true
    });
    const cursor = document.querySelector(o.cursorSelector);

    // cursor dispatches event on both entities - simulate this.
    cursor.dispatchEvent(event);
    target.dispatchEvent(event);
}

A.page = null;

/**
 * Set a page as the page that functions apply to, and brings it into focus.
 * This lasts until this page is called with a different page
 * @param {object} page         - The Playwright "page" object for the page that should become active. 
 * @param {boolean} viewLogs    - Set to true to view all console logs for the page in the Playwright test output.
 */
 exports.setPage = function(page, viewLogs = false) {
  A.page = page;
  page.bringToFront()

  // Set up listener so that a page error leads to immediate test failure.
  page.on("pageerror", (err) => {
    console.log(err)    
    expect(false).toBe(true);
  })

  if (viewLogs) { 
    page.on('console', async msg => {
        
      /* Sample code on playwright page.  
         Achieves neater logging results than console.log(msg), esp. for warnings & errors */
      const values = [];
      for (const arg of msg.args())
        values.push(await arg.jsonValue());
      console.log(...values);
    });
  }
}

/**
 * Set the entity on which the cursor component is configured
 * This lasts until this function is called with a different entitySelector.
 * @param {string} entitySelector      - The DOM Selector of the entity that the cursor component is configured on.
 */
exports.setCursorEntity = function(entitySelector) {
  A.cursorEntitySelector = entitySelector;
}

/**
 * Check that a string is a naked element id (without leading #)
 */
 exports.checkId = function(elementId) {
  expect(elementId).toBeNakedId();
}

/**
 * Simulate a "mouseenter" cursor event for an entity.
 * This assumes that a cursor entity has been set up by a call to A.setCursorEntity.
 * @param {string} targetSelector  - The DOM Selector of the entity that the mouse is hovering over.
 */
 exports.cursorMouseEnter = async function(targetSelector) {

   await A.page.evaluate(A.pfCursorMouseEvent, {cursorSelector: A.cursorEntitySelector,
                                                targetSelector: targetSelector,
                                                eventName: "mouseenter"})
}

/**
 * Simulate a "mouseleave" cursor event for an entity.
 * This assumes that a cursor entity has been set up by a call to A.setCursorEntity.
 * @param {string} targetSelector  - The DOM Selector of the entity that the mouse is hovering over.
 */
 exports.cursorMouseLeave = async function(targetSelector) {

   await A.page.evaluate(A.pfCursorMouseEvent, {cursorSelector: A.cursorEntitySelector,
                                                targetSelector: targetSelector,
                                                eventName: "mouseleave"})
}

/**
 * Simulate a "click" cursor event for an entity.
 * This assumes that a cursor entity has been set up by a call to A.setCursorEntity.
 * @param {string} targetSelector  - The DOM Selector of the entity that the mouse is hovering over.
 */
 exports.cursorClick = async function(targetSelector) {

  // A little unsure about this implementation.  Would it be preferable to have an A-Frame A.mouseEnter() intermediary
  // function in aframe-utils?
  // Or make this an A-Frame utils function, with cursorSelector set up in advance, as we do with 'page'?
  await A.page.evaluate(A.pfClick, {cursorSelector: A.cursorEntitySelector,
                                    targetSelector: targetSelector})

}

/**
 * Get an rgb object representing a color (as returned in e.g. object material), from a 3 digit or 6 digit hex string.
 * @param {hexNumber} - A 3 digit or 6 digit hex number, e.g. 0xFFF or 0xFFFFFF.
 */
exports.color = function(hexNumber) {

  const rgb3Component = (n) => {
    const value = parseInt(hexString.padStart(3, '0')[n], 16)/0xF;
    return value;
  }
  const rgb6Component = (n) => {
    const value = parseInt(hexString.padStart(6, '0').substring(2 * n, 2 * n + 2), 16)/0xFF;
    return value;
  }

  const hexString = hexNumber.toString(16);
  if (hexString.length <= 3) {
    r = rgb3Component(0);
    g = rgb3Component(1);
    b = rgb3Component(2);
  }
  else if (hexString.length <= 6) {
    r = rgb6Component(0);
    g = rgb6Component(1);
    b = rgb6Component(2);
  }

  return ({r: r, g: g, b: b});
}

/**
* Get an attribute value from an entity.
* @param {object} o           - Object that wraps all the function parameters
* @param {o.entitySelector}   - The DOM selector of the entity to query 
* @param {o.attributeName}    - The name of the attribute to query. 
* @returns {attributeValue}   - An object containing the value of the attribute
*/
exports.pfGetEntityAttributeValue = function(o) {
    
  const el = document.querySelector(o.entitySelector);
  const attributeValue = el.getAttribute(o.attributeName);
    
  return(attributeValue);
}

/**
* Get an attribute value from an entity.
* This uses a page function, rather than just querying the DOM, because
* A-Frame does not always flush updates to the DOM.
* @param {entitySelector}   - The DOM selector of the entity to query 
* @param {attributeName}    - The name of the attribute to query.
* @returns {attributeValue} - An object containing the value of the attribute
*/
exports.getEntityAttributeValue = async function(entitySelector, attributeName) {
  
  const attributeValue = await A.page.evaluate(A.pfGetEntityAttributeValue,
                                               {entitySelector: entitySelector,
                                                attributeName: attributeName});
  return(attributeValue);
}

/**
* Get an entity's visibility & opacity setttings
* @param {string}    entitySelector   - The DOM selector of the entity to query 
* @returns {object}  o          - Object that wraps all the return parameters
* @returns {boolean} o.opacity  - Opacity of the entity (0 to 1)
* @returns {boolean} o.visible  - Whether or not the entity is visible.  This includes analysing the
*                                 ThreeJS object tree to check for parents whos visibility may be set to false. */
exports.pfGetEntityVisibility = function(entitySelector) {

  // recursive function to check visibility of an object.
  function getVisibility(object) {
    var visible = object.visible
    if (object.parent) {
      visible = (visible && getVisibility(object.parent));
    }
    return visible
  }
    
  const el = document.querySelector(entitySelector);  
  const mesh = el.getObject3D('mesh')

  const o = {    
    opacity: mesh.material.opacity,
    visible: getVisibility(mesh)
  }
    
  return(o);
}

/**
* Get an entity's visibility & clipping data.
* This could be e.g. a Simulation Result, a Measurement sphere, or an anatomy or device entity.
* @param {string}   entitySelector    - The DOM selector of the entity to query
* @returns {object} o           - Object that wraps all the return parameters
* @returns {boolean} o.opacity  - Opacity of the entity (0 to 1)
* @returns {boolean} o.visible  - Whether or not the entity is visible.  This only consider's the object3D's local setting, and doesn't consider the fact that parent objects may be invisible, or may have 0 opacity.
*/
exports.getEntityVisibility = async function(entitySelector) {
  const page = A.page;
  
  await page.locator(entitySelector);
  const o = await page.evaluate(A.pfGetEntityVisibility, entitySelector);
  
  return o;
}

/**
* Point a controller towards another entity.
* @param {string} controllerSelector - The DOM Selector of the controller to point at a target.
* @param {string} targetSelector     - The DOM Selector of the target to point at.
* @param {string} controllerType     - The type of controller being used.  One of: oculus-touch, oculus-touch-v2, oculus-touch-v3
* 
* Similar to pointEntityAt, but allows for adjustment based on ray origin & ray direction, which 
* are set up based on the specified controller.
*/ 

exports.pointControllerAt = async function(controllerSelector, 
                                       targetSelector,
                                       controllerType) {

  const page = A.page;
  const o = {entitySelector: controllerSelector,
             targetSelector: targetSelector};

  switch (controllerType) {

    // Data for controllers here taken from https://github.com/aframevr/aframe/blob/v1.3.0/src/components/oculus-touch-controls.js
    // 
    // Can easily be extended as desired for other controller models.
    //
    // Minor issue: it doesn't yet adjust for left/right hand - x offsets vary in +/- signs.
    // Data below is for the right controller.
    
    case "oculus-touch":
      o.originOffset = {x: -0.002, y: -0.005, z: -0.03}
      o.direction = {x: 0, y: -0.8, z: -1}
      break;

    case "oculus-touch-v2":          
      o.originOffset = {x: 0.01, y: -0.02, z: 0}
      o.direction = {x: 0, y: -0.5, z: -1}
      break;

    case "oculus-touch-v3":
      o.originOffset = {x: -0.015, y: 0.005, z: 0}            
      o.direction = {x: 0, y: 0, z: -1}
      break;

    default:
      // Unknown controller.
      console.warn("Unknown controller type: ", controllerType)
      o.originOffset = {x: 0, y: 0, z: 0}
      o.direction = {x: 0, y: 0, z: -1}
      break;

  }

  await page.locator(controllerSelector);
  await page.evaluate(A.pfPointEntityAt, o);

}

/**
* Point one entity towards another entity.
* 
* @param {string} entitySelector - The DOM Selector of the entity to point at a target.
* @param {string} targetSelector - The DOM Selector of the target to point at.
*/

exports.pointEntityAt = async function(entitySelector, 
                                       targetSelector) {

  const page = A.page;
  await page.locator(entitySelector);
  await page.evaluate(A.pfPointEntityAt,
                      {entitySelector: entitySelector,
                       targetSelector: targetSelector});
}

/**
* Page Function to point one entity towards another entity.
* Optionally allows for a configurable offset & direction for the "eyes" of the entity.
* This is useful for controllers, where the ray origin & direction may vary by controller type.
* @param {object} o                - Object that wraps all the function parameters
* @param {string} o.entitySelector - The DOM Selector of the entity to point at a target.
* @param {string} o.targetSelector - The DOM Selector of the target to point at.
* @param {object} o.originOffset   - x, y, z co-ordinates.  Optional, default is (0, 0, 0)
* @param {object} o.direction      - x, y, z direction vector for the direction of the entity's "eyes".  Optional, default is (0, 0, -1)
*/
exports.pfPointEntityAt = function(o) {


  const targetWorldPosition = new THREE.Vector3();  
  const baseDirection = new THREE.Vector3(0, 0, 1);
  const entityDirection = new THREE.Vector3();
  const offsetVector = new THREE.Vector3();

  if (o.direction !== undefined) {
   entityDirection.set(o.direction.x, o.direction.y, o.direction.z).normalize();
  }
  else {
    entityDirection.set(0, 0, -1);
  }

  if (o.originOffset !== undefined) {
    offsetVector.set(o.originOffset.x, o.originOffset.y, o.originOffset.z);
  }
  else {
    offsetVector.set(0, 0, 0);
  }
    
  const quaternion = new THREE.Quaternion().setFromUnitVectors(entityDirection, baseDirection);

  const el = document.querySelector(o.entitySelector);
  const object = el.object3D;
  
  const target = document.querySelector(o.targetSelector);
  target.object3D.getWorldPosition(targetWorldPosition);

  // apply the origin offset to the target, in the object's local space.
  ///console.log("World space target position:",  targetWorldPosition.x, targetWorldPosition.y, targetWorldPosition.z)
  object.worldToLocal(targetWorldPosition)
  targetWorldPosition.sub(offsetVector)
  object.localToWorld(targetWorldPosition)
  //console.log("Allowing for offset, aim at: ",  targetWorldPosition.x, targetWorldPosition.y, targetWorldPosition.z)

  // Now look at this target position.
  object.lookAt(targetWorldPosition);

  // and apply a quaternion to compensate for the specified direction offset
  object.quaternion.multiply(quaternion);

  return;
}
