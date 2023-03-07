
 (function(modules) { // webpackBootstrap
var installedModules = {};
function __webpack_require__(moduleId) {
if(installedModules[moduleId]) {
return installedModules[moduleId].exports;
}
var module = installedModules[moduleId] = {
i: moduleId,
l: false,
exports: {}
};
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
module.l = true;
return module.exports;
}
__webpack_require__.m = modules;
__webpack_require__.c = installedModules;
__webpack_require__.d = function(exports, name, getter) {
if(!__webpack_require__.o(exports, name)) {
Object.defineProperty(exports, name, { enumerable: true, get: getter });
}
};
__webpack_require__.r = function(exports) {
if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
}
Object.defineProperty(exports, '__esModule', { value: true });
};
__webpack_require__.t = function(value, mode) {
if(mode & 1) value = __webpack_require__(value);
if(mode & 8) return value;
if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
var ns = Object.create(null);
__webpack_require__.r(ns);
Object.defineProperty(ns, 'default', { enumerable: true, value: value });
if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
return ns;
};
__webpack_require__.n = function(module) {
var getter = module && module.__esModule ?
function getDefault() { return module['default']; } :
function getModuleExports() { return module; };
__webpack_require__.d(getter, 'a', getter);
return getter;
};
__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
__webpack_require__.p = "";
return __webpack_require__(__webpack_require__.s = 129);
 })
 ([
 (function(module, exports, __webpack_require__) {
(function(global) {var check = function (it) {
return it && it.Math == Math && it;
};
module.exports =
check(typeof globalThis == 'object' && globalThis) ||
check(typeof window == 'object' && window) ||
check(typeof self == 'object' && self) ||
check(typeof global == 'object' && global) ||
(function () { return this; })() || Function('return this')();
}.call(this, __webpack_require__(26)))
/***/ }),
 (function(module, exports) {
function _interopRequireDefault(obj) {
return obj && obj.__esModule ? obj : {
"default": obj
};
}
module.exports = _interopRequireDefault;
/***/ }),
 (function(module, exports) {
var isArray = Array.isArray;
module.exports = isArray;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = {};
var modules = {};
var primary = [];
var secondary = window.Webflow || [];
var $ = window.jQuery;
var $win = $(window);
var $doc = $(document);
var isFunction = $.isFunction;
var _ = Webflow._ = __webpack_require__(131);
var tram = Webflow.tram = __webpack_require__(69) && $.tram;
var domready = false;
var destroyed = false;
tram.config.hideBackface = false;
tram.config.keepInherited = true;
Webflow.define = function (name, factory, options) {
if (modules[name]) {
unbindModule(modules[name]);
}
var instance = modules[name] = factory($, _, options) || {};
bindModule(instance);
return instance;
};
Webflow.require = function (name) {
return modules[name];
};
function bindModule(module) {
if (Webflow.env()) {
isFunction(module.design) && $win.on('__wf_design', module.design);
isFunction(module.preview) && $win.on('__wf_preview', module.preview);
} // Subscribe to front-end destroy event
isFunction(module.destroy) && $win.on('__wf_destroy', module.destroy); // Look for ready method on module
if (module.ready && isFunction(module.ready)) {
addReady(module);
}
}
function addReady(module) {
if (domready) {
module.ready();
return;
} // Otherwise add ready method to the primary queue (only once)
if (_.contains(primary, module.ready)) {
return;
}
primary.push(module.ready);
}
function unbindModule(module) {
isFunction(module.design) && $win.off('__wf_design', module.design);
isFunction(module.preview) && $win.off('__wf_preview', module.preview);
isFunction(module.destroy) && $win.off('__wf_destroy', module.destroy); // Remove ready method from primary queue
if (module.ready && isFunction(module.ready)) {
removeReady(module);
}
}
function removeReady(module) {
primary = _.filter(primary, function (readyFn) {
return readyFn !== module.ready;
});
}
Webflow.push = function (ready) {
if (domready) {
isFunction(ready) && ready();
return;
} // Otherwise push into secondary queue
secondary.push(ready);
};
Webflow.env = function (mode) {
var designFlag = window.__wf_design;
var inApp = typeof designFlag !== 'undefined';
if (!mode) {
return inApp;
}
if (mode === 'design') {
return inApp && designFlag;
}
if (mode === 'preview') {
return inApp && !designFlag;
}
if (mode === 'slug') {
return inApp && window.__wf_slug;
}
if (mode === 'editor') {
return window.WebflowEditor;
}
if (mode === 'test') {
return  false || window.__wf_test;
}
if (mode === 'frame') {
return window !== window.top;
}
}; // Feature detects + browser sniffs  ಠ_ಠ
var userAgent = navigator.userAgent.toLowerCase();
var touch = Webflow.env.touch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
var chrome = Webflow.env.chrome = /chrome/.test(userAgent) && /Google/.test(navigator.vendor) && parseInt(userAgent.match(/chrome\/(\d+)\./)[1], 10);
var ios = Webflow.env.ios = /(ipod|iphone|ipad)/.test(userAgent);
Webflow.env.safari = /safari/.test(userAgent) && !chrome && !ios; // Maintain current touch target to prevent late clicks on touch devices
var touchTarget; // Listen for both events to support touch/mouse hybrid devices
touch && $doc.on('touchstart mousedown', function (evt) {
touchTarget = evt.target;
});
Webflow.validClick = touch ? function (clickTarget) {
return clickTarget === touchTarget || $.contains(clickTarget, touchTarget);
} : function () {
return true;
};
var resizeEvents = 'resize.webflow orientationchange.webflow load.webflow';
var scrollEvents = 'scroll.webflow ' + resizeEvents;
Webflow.resize = eventProxy($win, resizeEvents);
Webflow.scroll = eventProxy($win, scrollEvents);
Webflow.redraw = eventProxy(); // Create a proxy instance for throttled events
function eventProxy(target, types) {
var handlers = [];
var proxy = {};
proxy.up = _.throttle(function (evt) {
_.each(handlers, function (h) {
h(evt);
});
}); // Bind events to target
if (target && types) {
target.on(types, proxy.up);
}
proxy.on = function (handler) {
if (typeof handler !== 'function') {
return;
}
if (_.contains(handlers, handler)) {
return;
}
handlers.push(handler);
};
proxy.off = function (handler) {
if (!arguments.length) {
handlers = [];
return;
} // Otherwise, remove handler from the list
handlers = _.filter(handlers, function (h) {
return h !== handler;
});
};
return proxy;
} // Webflow.location - Wrap window.location in api
Webflow.location = function (url) {
window.location = url;
};
if (Webflow.env()) {
Webflow.location = function () {};
} // Webflow.ready - Call primary and secondary handlers
Webflow.ready = function () {
domready = true; // Restore modules after destroy
if (destroyed) {
restoreModules(); // Otherwise run primary ready methods
} else {
_.each(primary, callReady);
} // Run secondary ready methods
_.each(secondary, callReady); // Trigger resize
Webflow.resize.up();
};
function callReady(readyFn) {
isFunction(readyFn) && readyFn();
}
function restoreModules() {
destroyed = false;
_.each(modules, bindModule);
}
var deferLoad;
Webflow.load = function (handler) {
deferLoad.then(handler);
};
function bindLoad() {
if (deferLoad) {
deferLoad.reject();
$win.off('load', deferLoad.resolve);
} // Create deferred and bind window load event
deferLoad = new $.Deferred();
$win.on('load', deferLoad.resolve);
} // Webflow.destroy - Trigger a destroy event for all modules
Webflow.destroy = function (options) {
options = options || {};
destroyed = true;
$win.triggerHandler('__wf_destroy'); // Allow domready reset for tests
if (options.domready != null) {
domready = options.domready;
} // Unbind modules
_.each(modules, unbindModule); // Clear any proxy event handlers
Webflow.resize.off();
Webflow.scroll.off();
Webflow.redraw.off(); // Clear any queued ready methods
primary = [];
secondary = []; // If load event has not yet fired, replace the deferred
if (deferLoad.state() === 'pending') {
bindLoad();
}
}; // Listen for domready
$(Webflow.ready); // Listen for window.onload and resolve deferred
bindLoad(); // Export commonjs module
module.exports = window.Webflow = Webflow;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireWildcard = __webpack_require__(18);
Object.defineProperty(exports, "__esModule", {
value: true
});
var _exportNames = {
IX2EngineActionTypes: true,
IX2EngineConstants: true
};
exports.IX2EngineConstants = exports.IX2EngineActionTypes = void 0;
var _triggerEvents = __webpack_require__(188);
Object.keys(_triggerEvents).forEach(function (key) {
if (key === "default" || key === "__esModule") return;
if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
Object.defineProperty(exports, key, {
enumerable: true,
get: function get() {
return _triggerEvents[key];
}
});
});
var _animationActions = __webpack_require__(94);
Object.keys(_animationActions).forEach(function (key) {
if (key === "default" || key === "__esModule") return;
if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
Object.defineProperty(exports, key, {
enumerable: true,
get: function get() {
return _animationActions[key];
}
});
});
var _triggerInteractions = __webpack_require__(189);
Object.keys(_triggerInteractions).forEach(function (key) {
if (key === "default" || key === "__esModule") return;
if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
Object.defineProperty(exports, key, {
enumerable: true,
get: function get() {
return _triggerInteractions[key];
}
});
});
var _reducedMotion = __webpack_require__(190);
Object.keys(_reducedMotion).forEach(function (key) {
if (key === "default" || key === "__esModule") return;
if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
Object.defineProperty(exports, key, {
enumerable: true,
get: function get() {
return _reducedMotion[key];
}
});
});
var IX2EngineActionTypes = _interopRequireWildcard(__webpack_require__(191));
exports.IX2EngineActionTypes = IX2EngineActionTypes;
var IX2EngineConstants = _interopRequireWildcard(__webpack_require__(192));
exports.IX2EngineConstants = IX2EngineConstants;
/***/ }),
 (function(module, exports) {
var FunctionPrototype = Function.prototype;
var bind = FunctionPrototype.bind;
var call = FunctionPrototype.call;
var callBind = bind && bind.bind(call);
module.exports = bind ? function (fn) {
return fn && callBind(call, fn);
} : function (fn) {
return fn && function () {
return call.apply(fn, arguments);
};
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var freeGlobal = __webpack_require__(99);
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function('return this')();
module.exports = root;
/***/ }),
 (function(module, exports) {
module.exports = function (argument) {
return typeof argument == 'function';
};
/***/ }),
 (function(module, exports) {
function isObject(value) {
var type = typeof value;
return value != null && (type == 'object' || type == 'function');
}
module.exports = isObject;
/***/ }),
 (function(module, exports, __webpack_require__) {
var uncurryThis = __webpack_require__(5);
var toObject = __webpack_require__(156);
var hasOwnProperty = uncurryThis({}.hasOwnProperty);
module.exports = Object.hasOwn || function hasOwn(it, key) {
return hasOwnProperty(toObject(it), key);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseMatches = __webpack_require__(195),
baseMatchesProperty = __webpack_require__(249),
identity = __webpack_require__(63),
isArray = __webpack_require__(2),
property = __webpack_require__(258);
function baseIteratee(value) {
if (typeof value == 'function') {
return value;
}
if (value == null) {
return identity;
}
if (typeof value == 'object') {
return isArray(value)
? baseMatchesProperty(value[0], value[1])
: baseMatches(value);
}
return property(value);
}
module.exports = baseIteratee;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIsNative = __webpack_require__(207),
getValue = __webpack_require__(212);
function getNative(object, key) {
var value = getValue(object, key);
return baseIsNative(value) ? value : undefined;
}
module.exports = getNative;
/***/ }),
 (function(module, exports) {
function isObjectLike(value) {
return value != null && typeof value == 'object';
}
module.exports = isObjectLike;
/***/ }),
 (function(module, exports, __webpack_require__) {
var fails = __webpack_require__(19);
module.exports = !fails(function () {
return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireWildcard = __webpack_require__(18);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.IX2VanillaUtils = exports.IX2VanillaPlugins = exports.IX2ElementsReducer = exports.IX2EasingUtils = exports.IX2Easings = exports.IX2BrowserSupport = void 0;
var IX2BrowserSupport = _interopRequireWildcard(__webpack_require__(48));
exports.IX2BrowserSupport = IX2BrowserSupport;
var IX2Easings = _interopRequireWildcard(__webpack_require__(116));
exports.IX2Easings = IX2Easings;
var IX2EasingUtils = _interopRequireWildcard(__webpack_require__(118));
exports.IX2EasingUtils = IX2EasingUtils;
var IX2ElementsReducer = _interopRequireWildcard(__webpack_require__(267));
exports.IX2ElementsReducer = IX2ElementsReducer;
var IX2VanillaPlugins = _interopRequireWildcard(__webpack_require__(120));
exports.IX2VanillaPlugins = IX2VanillaPlugins;
var IX2VanillaUtils = _interopRequireWildcard(__webpack_require__(269));
exports.IX2VanillaUtils = IX2VanillaUtils;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Symbol = __webpack_require__(23),
getRawTag = __webpack_require__(208),
objectToString = __webpack_require__(209);
var nullTag = '[object Null]',
undefinedTag = '[object Undefined]';
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
function baseGetTag(value) {
if (value == null) {
return value === undefined ? undefinedTag : nullTag;
}
return (symToStringTag && symToStringTag in Object(value))
? getRawTag(value)
: objectToString(value);
}
module.exports = baseGetTag;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isFunction = __webpack_require__(98),
isLength = __webpack_require__(56);
function isArrayLike(value) {
return value != null && isLength(value.length) && !isFunction(value);
}
module.exports = isArrayLike;
/***/ }),
 (function(module, exports) {
function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }
function _typeof(obj) {
if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
module.exports = _typeof = function _typeof(obj) {
return _typeof2(obj);
};
} else {
module.exports = _typeof = function _typeof(obj) {
return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};
}
return _typeof(obj);
}
module.exports = _typeof;
/***/ }),
 (function(module, exports) {
function _interopRequireWildcard(obj) {
if (obj && obj.__esModule) {
return obj;
} else {
var newObj = {};
if (obj != null) {
for (var key in obj) {
if (Object.prototype.hasOwnProperty.call(obj, key)) {
var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
if (desc.get || desc.set) {
Object.defineProperty(newObj, key, desc);
} else {
newObj[key] = obj[key];
}
}
}
}
newObj["default"] = obj;
return newObj;
}
}
module.exports = _interopRequireWildcard;
/***/ }),
 (function(module, exports) {
module.exports = function (exec) {
try {
return !!exec();
} catch (error) {
return true;
}
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var isCallable = __webpack_require__(7);
module.exports = function (it) {
return typeof it == 'object' ? it !== null : isCallable(it);
};
/***/ }),
 (function(module, exports) {
function _defineProperty(obj, key, value) {
if (key in obj) {
Object.defineProperty(obj, key, {
value: value,
enumerable: true,
configurable: true,
writable: true
});
} else {
obj[key] = value;
}
return obj;
}
module.exports = _defineProperty;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
exports.clone = clone;
exports.addLast = addLast;
exports.addFirst = addFirst;
exports.removeLast = removeLast;
exports.removeFirst = removeFirst;
exports.insert = insert;
exports.removeAt = removeAt;
exports.replaceAt = replaceAt;
exports.getIn = getIn;
exports.set = set;
exports.setIn = setIn;
exports.update = update;
exports.updateIn = updateIn;
exports.merge = merge;
exports.mergeDeep = mergeDeep;
exports.mergeIn = mergeIn;
exports.omit = omit;
exports.addDefaults = addDefaults;
var INVALID_ARGS = 'INVALID_ARGS';
function throwStr(msg) {
throw new Error(msg);
}
function getKeysAndSymbols(obj) {
var keys = Object.keys(obj);
if (Object.getOwnPropertySymbols) {
return keys.concat(Object.getOwnPropertySymbols(obj));
}
return keys;
}
var hasOwnProperty = {}.hasOwnProperty;
function clone(obj) {
if (Array.isArray(obj)) return obj.slice();
var keys = getKeysAndSymbols(obj);
var out = {};
for (var i = 0; i < keys.length; i++) {
var key = keys[i];
out[key] = obj[key];
}
return out;
}
function doMerge(fAddDefaults, fDeep, first) {
var out = first;
!(out != null) && throwStr( false ? undefined : INVALID_ARGS);
var fChanged = false;
for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
rest[_key - 3] = arguments[_key];
}
for (var idx = 0; idx < rest.length; idx++) {
var obj = rest[idx];
if (obj == null) continue;
var keys = getKeysAndSymbols(obj);
if (!keys.length) continue;
for (var j = 0; j <= keys.length; j++) {
var key = keys[j];
if (fAddDefaults && out[key] !== undefined) continue;
var nextVal = obj[key];
if (fDeep && isObject(out[key]) && isObject(nextVal)) {
nextVal = doMerge(fAddDefaults, fDeep, out[key], nextVal);
}
if (nextVal === undefined || nextVal === out[key]) continue;
if (!fChanged) {
fChanged = true;
out = clone(out);
}
out[key] = nextVal;
}
}
return out;
}
function isObject(o) {
var type = typeof o === 'undefined' ? 'undefined' : _typeof(o);
return o != null && (type === 'object' || type === 'function');
}
function addLast(array, val) {
if (Array.isArray(val)) return array.concat(val);
return array.concat([val]);
}
function addFirst(array, val) {
if (Array.isArray(val)) return val.concat(array);
return [val].concat(array);
}
function removeLast(array) {
if (!array.length) return array;
return array.slice(0, array.length - 1);
}
function removeFirst(array) {
if (!array.length) return array;
return array.slice(1);
}
function insert(array, idx, val) {
return array.slice(0, idx).concat(Array.isArray(val) ? val : [val]).concat(array.slice(idx));
}
function removeAt(array, idx) {
if (idx >= array.length || idx < 0) return array;
return array.slice(0, idx).concat(array.slice(idx + 1));
}
function replaceAt(array, idx, newItem) {
if (array[idx] === newItem) return array;
var len = array.length;
var result = Array(len);
for (var i = 0; i < len; i++) {
result[i] = array[i];
}
result[idx] = newItem;
return result;
}
function getIn(obj, path) {
!Array.isArray(path) && throwStr( false ? undefined : INVALID_ARGS);
if (obj == null) return undefined;
var ptr = obj;
for (var i = 0; i < path.length; i++) {
var key = path[i];
ptr = ptr != null ? ptr[key] : undefined;
if (ptr === undefined) return ptr;
}
return ptr;
}
function set(obj, key, val) {
var fallback = typeof key === 'number' ? [] : {};
var finalObj = obj == null ? fallback : obj;
if (finalObj[key] === val) return finalObj;
var obj2 = clone(finalObj);
obj2[key] = val;
return obj2;
}
function doSetIn(obj, path, val, idx) {
var newValue = void 0;
var key = path[idx];
if (idx === path.length - 1) {
newValue = val;
} else {
var nestedObj = isObject(obj) && isObject(obj[key]) ? obj[key] : typeof path[idx + 1] === 'number' ? [] : {};
newValue = doSetIn(nestedObj, path, val, idx + 1);
}
return set(obj, key, newValue);
}
function setIn(obj, path, val) {
if (!path.length) return val;
return doSetIn(obj, path, val, 0);
}
function update(obj, key, fnUpdate) {
var prevVal = obj == null ? undefined : obj[key];
var nextVal = fnUpdate(prevVal);
return set(obj, key, nextVal);
}
function updateIn(obj, path, fnUpdate) {
var prevVal = getIn(obj, path);
var nextVal = fnUpdate(prevVal);
return setIn(obj, path, nextVal);
}
function merge(a, b, c, d, e, f) {
for (var _len2 = arguments.length, rest = Array(_len2 > 6 ? _len2 - 6 : 0), _key2 = 6; _key2 < _len2; _key2++) {
rest[_key2 - 6] = arguments[_key2];
}
return rest.length ? doMerge.call.apply(doMerge, [null, false, false, a, b, c, d, e, f].concat(rest)) : doMerge(false, false, a, b, c, d, e, f);
}
function mergeDeep(a, b, c, d, e, f) {
for (var _len3 = arguments.length, rest = Array(_len3 > 6 ? _len3 - 6 : 0), _key3 = 6; _key3 < _len3; _key3++) {
rest[_key3 - 6] = arguments[_key3];
}
return rest.length ? doMerge.call.apply(doMerge, [null, false, true, a, b, c, d, e, f].concat(rest)) : doMerge(false, true, a, b, c, d, e, f);
}
function mergeIn(a, path, b, c, d, e, f) {
var prevVal = getIn(a, path);
if (prevVal == null) prevVal = {};
var nextVal = void 0;
for (var _len4 = arguments.length, rest = Array(_len4 > 7 ? _len4 - 7 : 0), _key4 = 7; _key4 < _len4; _key4++) {
rest[_key4 - 7] = arguments[_key4];
}
if (rest.length) {
nextVal = doMerge.call.apply(doMerge, [null, false, false, prevVal, b, c, d, e, f].concat(rest));
} else {
nextVal = doMerge(false, false, prevVal, b, c, d, e, f);
}
return setIn(a, path, nextVal);
}
function omit(obj, attrs) {
var omitList = Array.isArray(attrs) ? attrs : [attrs];
var fDoSomething = false;
for (var i = 0; i < omitList.length; i++) {
if (hasOwnProperty.call(obj, omitList[i])) {
fDoSomething = true;
break;
}
}
if (!fDoSomething) return obj;
var out = {};
var keys = getKeysAndSymbols(obj);
for (var _i = 0; _i < keys.length; _i++) {
var key = keys[_i];
if (omitList.indexOf(key) >= 0) continue;
out[key] = obj[key];
}
return out;
}
function addDefaults(a, b, c, d, e, f) {
for (var _len5 = arguments.length, rest = Array(_len5 > 6 ? _len5 - 6 : 0), _key5 = 6; _key5 < _len5; _key5++) {
rest[_key5 - 6] = arguments[_key5];
}
return rest.length ? doMerge.call.apply(doMerge, [null, true, false, a, b, c, d, e, f].concat(rest)) : doMerge(true, false, a, b, c, d, e, f);
}
var timm = {
clone: clone,
addLast: addLast,
addFirst: addFirst,
removeLast: removeLast,
removeFirst: removeFirst,
insert: insert,
removeAt: removeAt,
replaceAt: replaceAt,
getIn: getIn,
set: set, // so that flow doesn't complain
setIn: setIn,
update: update,
updateIn: updateIn,
merge: merge,
mergeDeep: mergeDeep,
mergeIn: mergeIn,
omit: omit,
addDefaults: addDefaults
};
exports.default = timm;
/***/ }),
 (function(module, exports, __webpack_require__) {
var root = __webpack_require__(6);
var Symbol = root.Symbol;
module.exports = Symbol;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isSymbol = __webpack_require__(39);
var INFINITY = 1 / 0;
function toKey(value) {
if (typeof value == 'string' || isSymbol(value)) {
return value;
}
var result = (value + '');
return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}
module.exports = toKey;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var IXEvents = __webpack_require__(136);
function dispatchCustomEvent(element, eventName) {
var event = document.createEvent('CustomEvent');
event.initCustomEvent(eventName, true, true, null);
element.dispatchEvent(event);
}
var $ = window.jQuery;
var api = {};
var namespace = '.w-ix';
var eventTriggers = {
reset: function reset(i, el) {
IXEvents.triggers.reset(i, el);
},
intro: function intro(i, el) {
IXEvents.triggers.intro(i, el);
dispatchCustomEvent(el, 'COMPONENT_ACTIVE');
},
outro: function outro(i, el) {
IXEvents.triggers.outro(i, el);
dispatchCustomEvent(el, 'COMPONENT_INACTIVE');
}
};
api.triggers = {};
api.types = {
INTRO: 'w-ix-intro' + namespace,
OUTRO: 'w-ix-outro' + namespace
};
$.extend(api.triggers, eventTriggers);
module.exports = api;
/***/ }),
 (function(module, exports) {
var g;
g = (function() {
	return this;
})();
try {
	g = g || new Function("return this")();
} catch (e) {
	if (typeof window === "object") g = window;
}
module.exports = g;
/***/ }),
 (function(module, exports, __webpack_require__) {
var IndexedObject = __webpack_require__(145);
var requireObjectCoercible = __webpack_require__(72);
module.exports = function (it) {
return IndexedObject(requireObjectCoercible(it));
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var isCallable = __webpack_require__(7);
var aFunction = function (argument) {
return isCallable(argument) ? argument : undefined;
};
module.exports = function (namespace, method) {
return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var DESCRIPTORS = __webpack_require__(13);
var IE8_DOM_DEFINE = __webpack_require__(80);
var anObject = __webpack_require__(30);
var toPropertyKey = __webpack_require__(73);
var TypeError = global.TypeError;
var $defineProperty = Object.defineProperty;
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
anObject(O);
P = toPropertyKey(P);
anObject(Attributes);
if (IE8_DOM_DEFINE) try {
return $defineProperty(O, P, Attributes);
} catch (error) {  }
if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
if ('value' in Attributes) O[P] = Attributes.value;
return O;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var isObject = __webpack_require__(20);
var String = global.String;
var TypeError = global.TypeError;
module.exports = function (argument) {
if (isObject(argument)) return argument;
throw TypeError(String(argument) + ' is not an object');
};
/***/ }),
 (function(module, exports) {
function _extends() {
module.exports = _extends = Object.assign || function (target) {
for (var i = 1; i < arguments.length; i++) {
var source = arguments[i];
for (var key in source) {
if (Object.prototype.hasOwnProperty.call(source, key)) {
target[key] = source[key];
}
}
}
return target;
};
return _extends.apply(this, arguments);
}
module.exports = _extends;
/***/ }),
 (function(module, exports, __webpack_require__) {
var listCacheClear = __webpack_require__(197),
listCacheDelete = __webpack_require__(198),
listCacheGet = __webpack_require__(199),
listCacheHas = __webpack_require__(200),
listCacheSet = __webpack_require__(201);
function ListCache(entries) {
var index = -1,
length = entries == null ? 0 : entries.length;
this.clear();
while (++index < length) {
var entry = entries[index];
this.set(entry[0], entry[1]);
}
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
module.exports = ListCache;
/***/ }),
 (function(module, exports, __webpack_require__) {
var eq = __webpack_require__(49);
function assocIndexOf(array, key) {
var length = array.length;
while (length--) {
if (eq(array[length][0], key)) {
return length;
}
}
return -1;
}
module.exports = assocIndexOf;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11);
var nativeCreate = getNative(Object, 'create');
module.exports = nativeCreate;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isKeyable = __webpack_require__(221);
function getMapData(map, key) {
var data = map.__data__;
return isKeyable(key)
? data[typeof key == 'string' ? 'string' : 'hash']
: data.map;
}
module.exports = getMapData;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayLikeKeys = __webpack_require__(106),
baseKeys = __webpack_require__(57),
isArrayLike = __webpack_require__(16);
function keys(object) {
return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
module.exports = keys;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIsArguments = __webpack_require__(239),
isObjectLike = __webpack_require__(12);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var propertyIsEnumerable = objectProto.propertyIsEnumerable;
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
!propertyIsEnumerable.call(value, 'callee');
};
module.exports = isArguments;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isArray = __webpack_require__(2),
isKey = __webpack_require__(62),
stringToPath = __webpack_require__(250),
toString = __webpack_require__(253);
function castPath(value, object) {
if (isArray(value)) {
return value;
}
return isKey(value, object) ? [value] : stringToPath(toString(value));
}
module.exports = castPath;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetTag = __webpack_require__(15),
isObjectLike = __webpack_require__(12);
var symbolTag = '[object Symbol]';
function isSymbol(value) {
return typeof value == 'symbol' ||
(isObjectLike(value) && baseGetTag(value) == symbolTag);
}
module.exports = isSymbol;
/***/ }),
 (function(module, exports) {
var call = Function.prototype.call;
module.exports = call.bind ? call.bind(call) : function () {
return call.apply(call, arguments);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var setGlobal = __webpack_require__(42);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});
module.exports = store;
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var defineProperty = Object.defineProperty;
module.exports = function (key, value) {
try {
defineProperty(global, key, { value: value, configurable: true, writable: true });
} catch (error) {
global[key] = value;
} return value;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var DESCRIPTORS = __webpack_require__(13);
var definePropertyModule = __webpack_require__(29);
var createPropertyDescriptor = __webpack_require__(71);
module.exports = DESCRIPTORS ? function (object, key, value) {
return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
object[key] = value;
return object;
};
/***/ }),
 (function(module, exports) {
module.exports = {};
/***/ }),
 (function(module, exports) {
module.exports = [
'constructor',
'hasOwnProperty',
'isPrototypeOf',
'propertyIsEnumerable',
'toLocaleString',
'toString',
'valueOf'
];
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "ActionTypes", function() { return ActionTypes; });
 __webpack_require__.d(__webpack_exports__, "default", function() { return createStore; });
 var lodash_es_isPlainObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);
 var symbol_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(183);
var ActionTypes = {
INIT: '@@redux/INIT'
};
function createStore(reducer, preloadedState, enhancer) {
var _ref2;
if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
enhancer = preloadedState;
preloadedState = undefined;
}
if (typeof enhancer !== 'undefined') {
if (typeof enhancer !== 'function') {
throw new Error('Expected the enhancer to be a function.');
}
return enhancer(createStore)(reducer, preloadedState);
}
if (typeof reducer !== 'function') {
throw new Error('Expected the reducer to be a function.');
}
var currentReducer = reducer;
var currentState = preloadedState;
var currentListeners = [];
var nextListeners = currentListeners;
var isDispatching = false;
function ensureCanMutateNextListeners() {
if (nextListeners === currentListeners) {
nextListeners = currentListeners.slice();
}
}
function getState() {
return currentState;
}
function subscribe(listener) {
if (typeof listener !== 'function') {
throw new Error('Expected listener to be a function.');
}
var isSubscribed = true;
ensureCanMutateNextListeners();
nextListeners.push(listener);
return function unsubscribe() {
if (!isSubscribed) {
return;
}
isSubscribed = false;
ensureCanMutateNextListeners();
var index = nextListeners.indexOf(listener);
nextListeners.splice(index, 1);
};
}
function dispatch(action) {
if (!Object(lodash_es_isPlainObject__WEBPACK_IMPORTED_MODULE_0__["default"])(action)) {
throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
}
if (typeof action.type === 'undefined') {
throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
}
if (isDispatching) {
throw new Error('Reducers may not dispatch actions.');
}
try {
isDispatching = true;
currentState = currentReducer(currentState, action);
} finally {
isDispatching = false;
}
var listeners = currentListeners = nextListeners;
for (var i = 0; i < listeners.length; i++) {
listeners[i]();
}
return action;
}
function replaceReducer(nextReducer) {
if (typeof nextReducer !== 'function') {
throw new Error('Expected the nextReducer to be a function.');
}
currentReducer = nextReducer;
dispatch({ type: ActionTypes.INIT });
}
/**
* Interoperability point for observable/reactive libraries.
* @returns {observable} A minimal observable of state changes.
* For more information, see the observable proposal:
* https://github.com/zenparsing/es-observable
*/
function observable() {
var _ref;
var outerSubscribe = subscribe;
return _ref = {
subscribe: function subscribe(observer) {
if (typeof observer !== 'object') {
throw new TypeError('Expected the observer to be an object.');
}
function observeState() {
if (observer.next) {
observer.next(getState());
}
}
observeState();
var unsubscribe = outerSubscribe(observeState);
return { unsubscribe: unsubscribe };
}
}, _ref[symbol_observable__WEBPACK_IMPORTED_MODULE_1__["default"]] = function () {
return this;
}, _ref;
}
dispatch({ type: ActionTypes.INIT });
return _ref2 = {
dispatch: dispatch,
subscribe: subscribe,
getState: getState,
replaceReducer: replaceReducer
}, _ref2[symbol_observable__WEBPACK_IMPORTED_MODULE_1__["default"]] = observable, _ref2;
}
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return compose; });
function compose() {
for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
funcs[_key] = arguments[_key];
}
if (funcs.length === 0) {
return function (arg) {
return arg;
};
}
if (funcs.length === 1) {
return funcs[0];
}
var last = funcs[funcs.length - 1];
var rest = funcs.slice(0, -1);
return function () {
return rest.reduceRight(function (composed, f) {
return f(composed);
}, last.apply(undefined, arguments));
};
}
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.TRANSFORM_STYLE_PREFIXED = exports.TRANSFORM_PREFIXED = exports.FLEX_PREFIXED = exports.ELEMENT_MATCHES = exports.withBrowser = exports.IS_BROWSER_ENV = void 0;
var _find = _interopRequireDefault(__webpack_require__(95));
var IS_BROWSER_ENV = typeof window !== 'undefined'; // $FlowFixMe
exports.IS_BROWSER_ENV = IS_BROWSER_ENV;
var withBrowser = function withBrowser(fn, fallback) {
if (IS_BROWSER_ENV) {
return fn();
}
return fallback;
};
exports.withBrowser = withBrowser;
var ELEMENT_MATCHES = withBrowser(function () {
return (0, _find["default"])(['matches', 'matchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector', 'webkitMatchesSelector'], function (key) {
return key in Element.prototype;
});
});
exports.ELEMENT_MATCHES = ELEMENT_MATCHES;
var FLEX_PREFIXED = withBrowser(function () {
var el = document.createElement('i');
var values = ['flex', '-webkit-flex', '-ms-flexbox', '-moz-box', '-webkit-box'];
var none = '';
try {
var length = values.length;
for (var i = 0; i < length; i++) {
var value = values[i];
el.style.display = value;
if (el.style.display === value) {
return value;
}
}
return none;
} catch (err) {
return none;
}
}, 'flex');
exports.FLEX_PREFIXED = FLEX_PREFIXED;
var TRANSFORM_PREFIXED = withBrowser(function () {
var el = document.createElement('i');
if (el.style.transform == null) {
var prefixes = ['Webkit', 'Moz', 'ms'];
var suffix = 'Transform';
var length = prefixes.length;
for (var i = 0; i < length; i++) {
var prop = prefixes[i] + suffix; // $FlowFixMe
if (el.style[prop] !== undefined) {
return prop;
}
}
}
return 'transform';
}, 'transform'); // $FlowFixMe
exports.TRANSFORM_PREFIXED = TRANSFORM_PREFIXED;
var TRANSFORM_PREFIX = TRANSFORM_PREFIXED.split('transform')[0];
var TRANSFORM_STYLE_PREFIXED = TRANSFORM_PREFIX ? TRANSFORM_PREFIX + 'TransformStyle' : 'transformStyle';
exports.TRANSFORM_STYLE_PREFIXED = TRANSFORM_STYLE_PREFIXED;
/***/ }),
 (function(module, exports) {
function eq(value, other) {
return value === other || (value !== value && other !== other);
}
module.exports = eq;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11),
root = __webpack_require__(6);
var Map = getNative(root, 'Map');
module.exports = Map;
/***/ }),
 (function(module, exports, __webpack_require__) {
var mapCacheClear = __webpack_require__(213),
mapCacheDelete = __webpack_require__(220),
mapCacheGet = __webpack_require__(222),
mapCacheHas = __webpack_require__(223),
mapCacheSet = __webpack_require__(224);
function MapCache(entries) {
var index = -1,
length = entries == null ? 0 : entries.length;
this.clear();
while (++index < length) {
var entry = entries[index];
this.set(entry[0], entry[1]);
}
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
module.exports = MapCache;
/***/ }),
 (function(module, exports) {
function arrayPush(array, values) {
var index = -1,
length = values.length,
offset = array.length;
while (++index < length) {
array[offset + index] = values[index];
}
return array;
}
module.exports = arrayPush;
/***/ }),
 (function(module, exports, __webpack_require__) {
(function(module) {var root = __webpack_require__(6),
stubFalse = __webpack_require__(240);
var freeExports =  true && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? root.Buffer : undefined;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
var isBuffer = nativeIsBuffer || stubFalse;
module.exports = isBuffer;
}.call(this, __webpack_require__(107)(module)))
/***/ }),
 (function(module, exports) {
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
var type = typeof value;
length = length == null ? MAX_SAFE_INTEGER : length;
return !!length &&
(type == 'number' ||
(type != 'symbol' && reIsUint.test(value))) &&
(value > -1 && value % 1 == 0 && value < length);
}
module.exports = isIndex;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIsTypedArray = __webpack_require__(241),
baseUnary = __webpack_require__(242),
nodeUtil = __webpack_require__(243);
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
module.exports = isTypedArray;
/***/ }),
 (function(module, exports) {
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
return typeof value == 'number' &&
value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
module.exports = isLength;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isPrototype = __webpack_require__(58),
nativeKeys = __webpack_require__(244);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseKeys(object) {
if (!isPrototype(object)) {
return nativeKeys(object);
}
var result = [];
for (var key in Object(object)) {
if (hasOwnProperty.call(object, key) && key != 'constructor') {
result.push(key);
}
}
return result;
}
module.exports = baseKeys;
/***/ }),
 (function(module, exports) {
var objectProto = Object.prototype;
function isPrototype(value) {
var Ctor = value && value.constructor,
proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
return value === proto;
}
module.exports = isPrototype;
/***/ }),
 (function(module, exports, __webpack_require__) {
var DataView = __webpack_require__(245),
Map = __webpack_require__(50),
Promise = __webpack_require__(246),
Set = __webpack_require__(247),
WeakMap = __webpack_require__(109),
baseGetTag = __webpack_require__(15),
toSource = __webpack_require__(100);
var mapTag = '[object Map]',
objectTag = '[object Object]',
promiseTag = '[object Promise]',
setTag = '[object Set]',
weakMapTag = '[object WeakMap]';
var dataViewTag = '[object DataView]';
var dataViewCtorString = toSource(DataView),
mapCtorString = toSource(Map),
promiseCtorString = toSource(Promise),
setCtorString = toSource(Set),
weakMapCtorString = toSource(WeakMap);
var getTag = baseGetTag;
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
(Map && getTag(new Map) != mapTag) ||
(Promise && getTag(Promise.resolve()) != promiseTag) ||
(Set && getTag(new Set) != setTag) ||
(WeakMap && getTag(new WeakMap) != weakMapTag)) {
getTag = function(value) {
var result = baseGetTag(value),
Ctor = result == objectTag ? value.constructor : undefined,
ctorString = Ctor ? toSource(Ctor) : '';
if (ctorString) {
switch (ctorString) {
case dataViewCtorString: return dataViewTag;
case mapCtorString: return mapTag;
case promiseCtorString: return promiseTag;
case setCtorString: return setTag;
case weakMapCtorString: return weakMapTag;
}
}
return result;
};
}
module.exports = getTag;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGet = __webpack_require__(61);
function get(object, path, defaultValue) {
var result = object == null ? undefined : baseGet(object, path);
return result === undefined ? defaultValue : result;
}
module.exports = get;
/***/ }),
 (function(module, exports, __webpack_require__) {
var castPath = __webpack_require__(38),
toKey = __webpack_require__(24);
function baseGet(object, path) {
path = castPath(path, object);
var index = 0,
length = path.length;
while (object != null && index < length) {
object = object[toKey(path[index++])];
}
return (index && index == length) ? object : undefined;
}
module.exports = baseGet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isArray = __webpack_require__(2),
isSymbol = __webpack_require__(39);
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
reIsPlainProp = /^\w*$/;
function isKey(value, object) {
if (isArray(value)) {
return false;
}
var type = typeof value;
if (type == 'number' || type == 'symbol' || type == 'boolean' ||
value == null || isSymbol(value)) {
return true;
}
return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
(object != null && value in Object(object));
}
module.exports = isKey;
/***/ }),
 (function(module, exports) {
function identity(value) {
return value;
}
module.exports = identity;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseTrim = __webpack_require__(262),
isObject = __webpack_require__(8),
isSymbol = __webpack_require__(39);
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber(value) {
if (typeof value == 'number') {
return value;
}
if (isSymbol(value)) {
return NAN;
}
if (isObject(value)) {
var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
value = isObject(other) ? (other + '') : other;
}
if (typeof value != 'string') {
return value === 0 ? value : +value;
}
value = baseTrim(value);
var isBinary = reIsBinary.test(value);
return (isBinary || reIsOctal.test(value))
? freeParseInt(value.slice(2), isBinary ? 2 : 8)
: (reIsBadHex.test(value) ? NAN : +value);
}
module.exports = toNumber;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.mediaQueriesDefined = exports.viewportWidthChanged = exports.actionListPlaybackChanged = exports.elementStateChanged = exports.instanceRemoved = exports.instanceStarted = exports.instanceAdded = exports.parameterChanged = exports.animationFrameChanged = exports.eventStateChanged = exports.testFrameRendered = exports.eventListenerAdded = exports.clearRequested = exports.stopRequested = exports.playbackRequested = exports.previewRequested = exports.sessionStopped = exports.sessionStarted = exports.sessionInitialized = exports.rawDataImported = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(31));
var _constants = __webpack_require__(4);
var _shared = __webpack_require__(14);
var _constants$IX2EngineA = _constants.IX2EngineActionTypes,
IX2_RAW_DATA_IMPORTED = _constants$IX2EngineA.IX2_RAW_DATA_IMPORTED,
IX2_SESSION_INITIALIZED = _constants$IX2EngineA.IX2_SESSION_INITIALIZED,
IX2_SESSION_STARTED = _constants$IX2EngineA.IX2_SESSION_STARTED,
IX2_SESSION_STOPPED = _constants$IX2EngineA.IX2_SESSION_STOPPED,
IX2_PREVIEW_REQUESTED = _constants$IX2EngineA.IX2_PREVIEW_REQUESTED,
IX2_PLAYBACK_REQUESTED = _constants$IX2EngineA.IX2_PLAYBACK_REQUESTED,
IX2_STOP_REQUESTED = _constants$IX2EngineA.IX2_STOP_REQUESTED,
IX2_CLEAR_REQUESTED = _constants$IX2EngineA.IX2_CLEAR_REQUESTED,
IX2_EVENT_LISTENER_ADDED = _constants$IX2EngineA.IX2_EVENT_LISTENER_ADDED,
IX2_TEST_FRAME_RENDERED = _constants$IX2EngineA.IX2_TEST_FRAME_RENDERED,
IX2_EVENT_STATE_CHANGED = _constants$IX2EngineA.IX2_EVENT_STATE_CHANGED,
IX2_ANIMATION_FRAME_CHANGED = _constants$IX2EngineA.IX2_ANIMATION_FRAME_CHANGED,
IX2_PARAMETER_CHANGED = _constants$IX2EngineA.IX2_PARAMETER_CHANGED,
IX2_INSTANCE_ADDED = _constants$IX2EngineA.IX2_INSTANCE_ADDED,
IX2_INSTANCE_STARTED = _constants$IX2EngineA.IX2_INSTANCE_STARTED,
IX2_INSTANCE_REMOVED = _constants$IX2EngineA.IX2_INSTANCE_REMOVED,
IX2_ELEMENT_STATE_CHANGED = _constants$IX2EngineA.IX2_ELEMENT_STATE_CHANGED,
IX2_ACTION_LIST_PLAYBACK_CHANGED = _constants$IX2EngineA.IX2_ACTION_LIST_PLAYBACK_CHANGED,
IX2_VIEWPORT_WIDTH_CHANGED = _constants$IX2EngineA.IX2_VIEWPORT_WIDTH_CHANGED,
IX2_MEDIA_QUERIES_DEFINED = _constants$IX2EngineA.IX2_MEDIA_QUERIES_DEFINED;
var reifyState = _shared.IX2VanillaUtils.reifyState; // TODO: Figure out what this is and elevate it
var rawDataImported = function rawDataImported(rawData) {
return {
type: IX2_RAW_DATA_IMPORTED,
payload: (0, _extends2["default"])({}, reifyState(rawData))
};
};
exports.rawDataImported = rawDataImported;
var sessionInitialized = function sessionInitialized(_ref) {
var hasBoundaryNodes = _ref.hasBoundaryNodes,
reducedMotion = _ref.reducedMotion;
return {
type: IX2_SESSION_INITIALIZED,
payload: {
hasBoundaryNodes: hasBoundaryNodes,
reducedMotion: reducedMotion
}
};
};
exports.sessionInitialized = sessionInitialized;
var sessionStarted = function sessionStarted() {
return {
type: IX2_SESSION_STARTED
};
};
exports.sessionStarted = sessionStarted;
var sessionStopped = function sessionStopped() {
return {
type: IX2_SESSION_STOPPED
};
};
exports.sessionStopped = sessionStopped;
var previewRequested = function previewRequested(_ref2) {
var rawData = _ref2.rawData,
defer = _ref2.defer;
return {
type: IX2_PREVIEW_REQUESTED,
payload: {
defer: defer,
rawData: rawData
}
};
};
exports.previewRequested = previewRequested;
var playbackRequested = function playbackRequested(_ref3) {
var _ref3$actionTypeId = _ref3.actionTypeId,
actionTypeId = _ref3$actionTypeId === void 0 ? _constants.ActionTypeConsts.GENERAL_START_ACTION : _ref3$actionTypeId,
actionListId = _ref3.actionListId,
actionItemId = _ref3.actionItemId,
eventId = _ref3.eventId,
allowEvents = _ref3.allowEvents,
immediate = _ref3.immediate,
testManual = _ref3.testManual,
verbose = _ref3.verbose,
rawData = _ref3.rawData;
return {
type: IX2_PLAYBACK_REQUESTED,
payload: {
actionTypeId: actionTypeId,
actionListId: actionListId,
actionItemId: actionItemId,
testManual: testManual,
eventId: eventId,
allowEvents: allowEvents,
immediate: immediate,
verbose: verbose,
rawData: rawData
}
};
};
exports.playbackRequested = playbackRequested;
var stopRequested = function stopRequested(actionListId) {
return {
type: IX2_STOP_REQUESTED,
payload: {
actionListId: actionListId
}
};
};
exports.stopRequested = stopRequested;
var clearRequested = function clearRequested() {
return {
type: IX2_CLEAR_REQUESTED
};
};
exports.clearRequested = clearRequested;
var eventListenerAdded = function eventListenerAdded(target, listenerParams) {
return {
type: IX2_EVENT_LISTENER_ADDED,
payload: {
target: target,
listenerParams: listenerParams
}
};
};
exports.eventListenerAdded = eventListenerAdded;
var testFrameRendered = function testFrameRendered() {
var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
return {
type: IX2_TEST_FRAME_RENDERED,
payload: {
step: step
}
};
};
exports.testFrameRendered = testFrameRendered;
var eventStateChanged = function eventStateChanged(stateKey, newState) {
return {
type: IX2_EVENT_STATE_CHANGED,
payload: {
stateKey: stateKey,
newState: newState
}
};
};
exports.eventStateChanged = eventStateChanged;
var animationFrameChanged = function animationFrameChanged(now, parameters) {
return {
type: IX2_ANIMATION_FRAME_CHANGED,
payload: {
now: now,
parameters: parameters
}
};
};
exports.animationFrameChanged = animationFrameChanged;
var parameterChanged = function parameterChanged(key, value) {
return {
type: IX2_PARAMETER_CHANGED,
payload: {
key: key,
value: value
}
};
};
exports.parameterChanged = parameterChanged;
var instanceAdded = function instanceAdded(options) {
return {
type: IX2_INSTANCE_ADDED,
payload: (0, _extends2["default"])({}, options)
};
};
exports.instanceAdded = instanceAdded;
var instanceStarted = function instanceStarted(instanceId, time) {
return {
type: IX2_INSTANCE_STARTED,
payload: {
instanceId: instanceId,
time: time
}
};
};
exports.instanceStarted = instanceStarted;
var instanceRemoved = function instanceRemoved(instanceId) {
return {
type: IX2_INSTANCE_REMOVED,
payload: {
instanceId: instanceId
}
};
};
exports.instanceRemoved = instanceRemoved;
var elementStateChanged = function elementStateChanged(elementId, actionTypeId, current, actionItem) {
return {
type: IX2_ELEMENT_STATE_CHANGED,
payload: {
elementId: elementId,
actionTypeId: actionTypeId,
current: current,
actionItem: actionItem
}
};
};
exports.elementStateChanged = elementStateChanged;
var actionListPlaybackChanged = function actionListPlaybackChanged(_ref4) {
var actionListId = _ref4.actionListId,
isPlaying = _ref4.isPlaying;
return {
type: IX2_ACTION_LIST_PLAYBACK_CHANGED,
payload: {
actionListId: actionListId,
isPlaying: isPlaying
}
};
};
exports.actionListPlaybackChanged = actionListPlaybackChanged;
var viewportWidthChanged = function viewportWidthChanged(_ref5) {
var width = _ref5.width,
mediaQueries = _ref5.mediaQueries;
return {
type: IX2_VIEWPORT_WIDTH_CHANGED,
payload: {
width: width,
mediaQueries: mediaQueries
}
};
};
exports.viewportWidthChanged = viewportWidthChanged;
var mediaQueriesDefined = function mediaQueriesDefined() {
return {
type: IX2_MEDIA_QUERIES_DEFINED
};
};
exports.mediaQueriesDefined = mediaQueriesDefined;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseCreate = __webpack_require__(126),
baseLodash = __webpack_require__(67);
function LodashWrapper(value, chainAll) {
this.__wrapped__ = value;
this.__actions__ = [];
this.__chain__ = !!chainAll;
this.__index__ = 0;
this.__values__ = undefined;
}
LodashWrapper.prototype = baseCreate(baseLodash.prototype);
LodashWrapper.prototype.constructor = LodashWrapper;
module.exports = LodashWrapper;
/***/ }),
 (function(module, exports) {
function baseLodash() {
}
module.exports = baseLodash;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseCreate = __webpack_require__(126),
baseLodash = __webpack_require__(67);
var MAX_ARRAY_LENGTH = 4294967295;
function LazyWrapper(value) {
this.__wrapped__ = value;
this.__actions__ = [];
this.__dir__ = 1;
this.__filtered__ = false;
this.__iteratees__ = [];
this.__takeCount__ = MAX_ARRAY_LENGTH;
this.__views__ = [];
}
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
module.exports = LazyWrapper;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
/* eslint-disable eslint-comments/no-unlimited-disable */
/*!
 * tram.js v0.8.2-global
 * Cross-browser CSS3 transitions in JavaScript
 * https://github.com/bkwld/tram
 * MIT License
 */
var _interopRequireDefault = __webpack_require__(1);
var _typeof2 = _interopRequireDefault(__webpack_require__(17));
window.tram = function (a) {
function b(a, b) {
var c = new M.Bare();
return c.init(a, b);
}
function c(a) {
return a.replace(/[A-Z]/g, function (a) {
return "-" + a.toLowerCase();
});
}
function d(a) {
var b = parseInt(a.slice(1), 16),
c = b >> 16 & 255,
d = b >> 8 & 255,
e = 255 & b;
return [c, d, e];
}
function e(a, b, c) {
return "#" + (1 << 24 | a << 16 | b << 8 | c).toString(16).slice(1);
}
function f() {}
function g(a, b) {
j("Type warning: Expected: [" + a + "] Got: [" + (0, _typeof2["default"])(b) + "] " + b);
}
function h(a, b, c) {
j("Units do not match [" + a + "]: " + b + ", " + c);
}
function i(a, b, c) {
if (void 0 !== b && (c = b), void 0 === a) return c;
var d = c;
return $.test(a) || !_.test(a) ? d = parseInt(a, 10) : _.test(a) && (d = 1e3 * parseFloat(a)), 0 > d && (d = 0), d === d ? d : c;
}
function j(a) {
U.debug && window && window.console.warn(a);
}
function k(a) {
for (var b = -1, c = a ? a.length : 0, d = []; ++b < c;) {
var e = a[b];
e && d.push(e);
}
return d;
}
var l = function (a, b, c) {
function d(a) {
return "object" == (0, _typeof2["default"])(a);
}
function e(a) {
return "function" == typeof a;
}
function f() {}
function g(h, i) {
function j() {
var a = new k();
return e(a.init) && a.init.apply(a, arguments), a;
}
function k() {}
i === c && (i = h, h = Object), j.Bare = k;
var l,
m = f[a] = h[a],
n = k[a] = j[a] = new f();
return n.constructor = j, j.mixin = function (b) {
return k[a] = j[a] = g(j, b)[a], j;
}, j.open = function (a) {
if (l = {}, e(a) ? l = a.call(j, n, m, j, h) : d(a) && (l = a), d(l)) for (var c in l) {
b.call(l, c) && (n[c] = l[c]);
}
return e(n.init) || (n.init = h), j;
}, j.open(i);
}
return g;
}("prototype", {}.hasOwnProperty),
m = {
ease: ["ease", function (a, b, c, d) {
var e = (a /= d) * a,
f = e * a;
return b + c * (-2.75 * f * e + 11 * e * e + -15.5 * f + 8 * e + .25 * a);
}],
"ease-in": ["ease-in", function (a, b, c, d) {
var e = (a /= d) * a,
f = e * a;
return b + c * (-1 * f * e + 3 * e * e + -3 * f + 2 * e);
}],
"ease-out": ["ease-out", function (a, b, c, d) {
var e = (a /= d) * a,
f = e * a;
return b + c * (.3 * f * e + -1.6 * e * e + 2.2 * f + -1.8 * e + 1.9 * a);
}],
"ease-in-out": ["ease-in-out", function (a, b, c, d) {
var e = (a /= d) * a,
f = e * a;
return b + c * (2 * f * e + -5 * e * e + 2 * f + 2 * e);
}],
linear: ["linear", function (a, b, c, d) {
return c * a / d + b;
}],
"ease-in-quad": ["cubic-bezier(0.550, 0.085, 0.680, 0.530)", function (a, b, c, d) {
return c * (a /= d) * a + b;
}],
"ease-out-quad": ["cubic-bezier(0.250, 0.460, 0.450, 0.940)", function (a, b, c, d) {
return -c * (a /= d) * (a - 2) + b;
}],
"ease-in-out-quad": ["cubic-bezier(0.455, 0.030, 0.515, 0.955)", function (a, b, c, d) {
return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b;
}],
"ease-in-cubic": ["cubic-bezier(0.550, 0.055, 0.675, 0.190)", function (a, b, c, d) {
return c * (a /= d) * a * a + b;
}],
"ease-out-cubic": ["cubic-bezier(0.215, 0.610, 0.355, 1)", function (a, b, c, d) {
return c * ((a = a / d - 1) * a * a + 1) + b;
}],
"ease-in-out-cubic": ["cubic-bezier(0.645, 0.045, 0.355, 1)", function (a, b, c, d) {
return (a /= d / 2) < 1 ? c / 2 * a * a * a + b : c / 2 * ((a -= 2) * a * a + 2) + b;
}],
"ease-in-quart": ["cubic-bezier(0.895, 0.030, 0.685, 0.220)", function (a, b, c, d) {
return c * (a /= d) * a * a * a + b;
}],
"ease-out-quart": ["cubic-bezier(0.165, 0.840, 0.440, 1)", function (a, b, c, d) {
return -c * ((a = a / d - 1) * a * a * a - 1) + b;
}],
"ease-in-out-quart": ["cubic-bezier(0.770, 0, 0.175, 1)", function (a, b, c, d) {
return (a /= d / 2) < 1 ? c / 2 * a * a * a * a + b : -c / 2 * ((a -= 2) * a * a * a - 2) + b;
}],
"ease-in-quint": ["cubic-bezier(0.755, 0.050, 0.855, 0.060)", function (a, b, c, d) {
return c * (a /= d) * a * a * a * a + b;
}],
"ease-out-quint": ["cubic-bezier(0.230, 1, 0.320, 1)", function (a, b, c, d) {
return c * ((a = a / d - 1) * a * a * a * a + 1) + b;
}],
"ease-in-out-quint": ["cubic-bezier(0.860, 0, 0.070, 1)", function (a, b, c, d) {
return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b;
}],
"ease-in-sine": ["cubic-bezier(0.470, 0, 0.745, 0.715)", function (a, b, c, d) {
return -c * Math.cos(a / d * (Math.PI / 2)) + c + b;
}],
"ease-out-sine": ["cubic-bezier(0.390, 0.575, 0.565, 1)", function (a, b, c, d) {
return c * Math.sin(a / d * (Math.PI / 2)) + b;
}],
"ease-in-out-sine": ["cubic-bezier(0.445, 0.050, 0.550, 0.950)", function (a, b, c, d) {
return -c / 2 * (Math.cos(Math.PI * a / d) - 1) + b;
}],
"ease-in-expo": ["cubic-bezier(0.950, 0.050, 0.795, 0.035)", function (a, b, c, d) {
return 0 === a ? b : c * Math.pow(2, 10 * (a / d - 1)) + b;
}],
"ease-out-expo": ["cubic-bezier(0.190, 1, 0.220, 1)", function (a, b, c, d) {
return a === d ? b + c : c * (-Math.pow(2, -10 * a / d) + 1) + b;
}],
"ease-in-out-expo": ["cubic-bezier(1, 0, 0, 1)", function (a, b, c, d) {
return 0 === a ? b : a === d ? b + c : (a /= d / 2) < 1 ? c / 2 * Math.pow(2, 10 * (a - 1)) + b : c / 2 * (-Math.pow(2, -10 * --a) + 2) + b;
}],
"ease-in-circ": ["cubic-bezier(0.600, 0.040, 0.980, 0.335)", function (a, b, c, d) {
return -c * (Math.sqrt(1 - (a /= d) * a) - 1) + b;
}],
"ease-out-circ": ["cubic-bezier(0.075, 0.820, 0.165, 1)", function (a, b, c, d) {
return c * Math.sqrt(1 - (a = a / d - 1) * a) + b;
}],
"ease-in-out-circ": ["cubic-bezier(0.785, 0.135, 0.150, 0.860)", function (a, b, c, d) {
return (a /= d / 2) < 1 ? -c / 2 * (Math.sqrt(1 - a * a) - 1) + b : c / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b;
}],
"ease-in-back": ["cubic-bezier(0.600, -0.280, 0.735, 0.045)", function (a, b, c, d, e) {
return void 0 === e && (e = 1.70158), c * (a /= d) * a * ((e + 1) * a - e) + b;
}],
"ease-out-back": ["cubic-bezier(0.175, 0.885, 0.320, 1.275)", function (a, b, c, d, e) {
return void 0 === e && (e = 1.70158), c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b;
}],
"ease-in-out-back": ["cubic-bezier(0.680, -0.550, 0.265, 1.550)", function (a, b, c, d, e) {
return void 0 === e && (e = 1.70158), (a /= d / 2) < 1 ? c / 2 * a * a * (((e *= 1.525) + 1) * a - e) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b;
}]
},
n = {
"ease-in-back": "cubic-bezier(0.600, 0, 0.735, 0.045)",
"ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1)",
"ease-in-out-back": "cubic-bezier(0.680, 0, 0.265, 1)"
},
o = document,
p = window,
q = "bkwld-tram",
r = /[\-\.0-9]/g,
s = /[A-Z]/,
t = "number",
u = /^(rgb|#)/,
v = /(em|cm|mm|in|pt|pc|px)$/,
w = /(em|cm|mm|in|pt|pc|px|%)$/,
x = /(deg|rad|turn)$/,
y = "unitless",
z = /(all|none) 0s ease 0s/,
A = /^(width|height)$/,
B = " ",
C = o.createElement("a"),
D = ["Webkit", "Moz", "O", "ms"],
E = ["-webkit-", "-moz-", "-o-", "-ms-"],
F = function F(a) {
if (a in C.style) return {
dom: a,
css: a
};
var b,
c,
d = "",
e = a.split("-");
for (b = 0; b < e.length; b++) {
d += e[b].charAt(0).toUpperCase() + e[b].slice(1);
}
for (b = 0; b < D.length; b++) {
if (c = D[b] + d, c in C.style) return {
dom: c,
css: E[b] + a
};
}
},
G = b.support = {
bind: Function.prototype.bind,
transform: F("transform"),
transition: F("transition"),
backface: F("backface-visibility"),
timing: F("transition-timing-function")
};
if (G.transition) {
var H = G.timing.dom;
if (C.style[H] = m["ease-in-back"][0], !C.style[H]) for (var I in n) {
m[I][0] = n[I];
}
}
var J = b.frame = function () {
var a = p.requestAnimationFrame || p.webkitRequestAnimationFrame || p.mozRequestAnimationFrame || p.oRequestAnimationFrame || p.msRequestAnimationFrame;
return a && G.bind ? a.bind(p) : function (a) {
p.setTimeout(a, 16);
};
}(),
K = b.now = function () {
var a = p.performance,
b = a && (a.now || a.webkitNow || a.msNow || a.mozNow);
return b && G.bind ? b.bind(a) : Date.now || function () {
return +new Date();
};
}(),
L = l(function (b) {
function d(a, b) {
var c = k(("" + a).split(B)),
d = c[0];
b = b || {};
var e = Y[d];
if (!e) return j("Unsupported property: " + d);
if (!b.weak || !this.props[d]) {
var f = e[0],
g = this.props[d];
return g || (g = this.props[d] = new f.Bare()), g.init(this.$el, c, e, b), g;
}
}
function e(a, b, c) {
if (a) {
var e = (0, _typeof2["default"])(a);
if (b || (this.timer && this.timer.destroy(), this.queue = [], this.active = !1), "number" == e && b) return this.timer = new S({
duration: a,
context: this,
complete: h
}), void (this.active = !0);
if ("string" == e && b) {
switch (a) {
case "hide":
o.call(this);
break;
case "stop":
l.call(this);
break;
case "redraw":
p.call(this);
break;
default:
d.call(this, a, c && c[1]);
}
return h.call(this);
}
if ("function" == e) return void a.call(this, this);
if ("object" == e) {
var f = 0;
u.call(this, a, function (a, b) {
a.span > f && (f = a.span), a.stop(), a.animate(b);
}, function (a) {
"wait" in a && (f = i(a.wait, 0));
}), t.call(this), f > 0 && (this.timer = new S({
duration: f,
context: this
}), this.active = !0, b && (this.timer.complete = h));
var g = this,
j = !1,
k = {};
J(function () {
u.call(g, a, function (a) {
a.active && (j = !0, k[a.name] = a.nextStyle);
}), j && g.$el.css(k);
});
}
}
}
function f(a) {
a = i(a, 0), this.active ? this.queue.push({
options: a
}) : (this.timer = new S({
duration: a,
context: this,
complete: h
}), this.active = !0);
}
function g(a) {
return this.active ? (this.queue.push({
options: a,
args: arguments
}), void (this.timer.complete = h)) : j("No active transition timer. Use start() or wait() before then().");
}
function h() {
if (this.timer && this.timer.destroy(), this.active = !1, this.queue.length) {
var a = this.queue.shift();
e.call(this, a.options, !0, a.args);
}
}
function l(a) {
this.timer && this.timer.destroy(), this.queue = [], this.active = !1;
var b;
"string" == typeof a ? (b = {}, b[a] = 1) : b = "object" == (0, _typeof2["default"])(a) && null != a ? a : this.props, u.call(this, b, v), t.call(this);
}
function m(a) {
l.call(this, a), u.call(this, a, w, x);
}
function n(a) {
"string" != typeof a && (a = "block"), this.el.style.display = a;
}
function o() {
l.call(this), this.el.style.display = "none";
}
function p() {
this.el.offsetHeight;
}
function r() {
l.call(this), a.removeData(this.el, q), this.$el = this.el = null;
}
function t() {
var a,
b,
c = [];
this.upstream && c.push(this.upstream);
for (a in this.props) {
b = this.props[a], b.active && c.push(b.string);
}
c = c.join(","), this.style !== c && (this.style = c, this.el.style[G.transition.dom] = c);
}
function u(a, b, e) {
var f,
g,
h,
i,
j = b !== v,
k = {};
for (f in a) {
h = a[f], f in Z ? (k.transform || (k.transform = {}), k.transform[f] = h) : (s.test(f) && (f = c(f)), f in Y ? k[f] = h : (i || (i = {}), i[f] = h));
}
for (f in k) {
if (h = k[f], g = this.props[f], !g) {
if (!j) continue;
g = d.call(this, f);
}
b.call(this, g, h);
}
e && i && e.call(this, i);
}
function v(a) {
a.stop();
}
function w(a, b) {
a.set(b);
}
function x(a) {
this.$el.css(a);
}
function y(a, c) {
b[a] = function () {
return this.children ? A.call(this, c, arguments) : (this.el && c.apply(this, arguments), this);
};
}
function A(a, b) {
var c,
d = this.children.length;
for (c = 0; d > c; c++) {
a.apply(this.children[c], b);
}
return this;
}
b.init = function (b) {
if (this.$el = a(b), this.el = this.$el[0], this.props = {}, this.queue = [], this.style = "", this.active = !1, U.keepInherited && !U.fallback) {
var c = W(this.el, "transition");
c && !z.test(c) && (this.upstream = c);
}
G.backface && U.hideBackface && V(this.el, G.backface.css, "hidden");
}, y("add", d), y("start", e), y("wait", f), y("then", g), y("next", h), y("stop", l), y("set", m), y("show", n), y("hide", o), y("redraw", p), y("destroy", r);
}),
M = l(L, function (b) {
function c(b, c) {
var d = a.data(b, q) || a.data(b, q, new L.Bare());
return d.el || d.init(b), c ? d.start(c) : d;
}
b.init = function (b, d) {
var e = a(b);
if (!e.length) return this;
if (1 === e.length) return c(e[0], d);
var f = [];
return e.each(function (a, b) {
f.push(c(b, d));
}), this.children = f, this;
};
}),
N = l(function (a) {
function b() {
var a = this.get();
this.update("auto");
var b = this.get();
return this.update(a), b;
}
function c(a, b, c) {
return void 0 !== b && (c = b), a in m ? a : c;
}
function d(a) {
var b = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(a);
return (b ? e(b[1], b[2], b[3]) : a).replace(/#(\w)(\w)(\w)$/, "#$1$1$2$2$3$3");
}
var f = {
duration: 500,
ease: "ease",
delay: 0
};
a.init = function (a, b, d, e) {
this.$el = a, this.el = a[0];
var g = b[0];
d[2] && (g = d[2]), X[g] && (g = X[g]), this.name = g, this.type = d[1], this.duration = i(b[1], this.duration, f.duration), this.ease = c(b[2], this.ease, f.ease), this.delay = i(b[3], this.delay, f.delay), this.span = this.duration + this.delay, this.active = !1, this.nextStyle = null, this.auto = A.test(this.name), this.unit = e.unit || this.unit || U.defaultUnit, this.angle = e.angle || this.angle || U.defaultAngle, U.fallback || e.fallback ? this.animate = this.fallback : (this.animate = this.transition, this.string = this.name + B + this.duration + "ms" + ("ease" != this.ease ? B + m[this.ease][0] : "") + (this.delay ? B + this.delay + "ms" : ""));
}, a.set = function (a) {
a = this.convert(a, this.type), this.update(a), this.redraw();
}, a.transition = function (a) {
this.active = !0, a = this.convert(a, this.type), this.auto && ("auto" == this.el.style[this.name] && (this.update(this.get()), this.redraw()), "auto" == a && (a = b.call(this))), this.nextStyle = a;
}, a.fallback = function (a) {
var c = this.el.style[this.name] || this.convert(this.get(), this.type);
a = this.convert(a, this.type), this.auto && ("auto" == c && (c = this.convert(this.get(), this.type)), "auto" == a && (a = b.call(this))), this.tween = new R({
from: c,
to: a,
duration: this.duration,
delay: this.delay,
ease: this.ease,
update: this.update,
context: this
});
}, a.get = function () {
return W(this.el, this.name);
}, a.update = function (a) {
V(this.el, this.name, a);
}, a.stop = function () {
(this.active || this.nextStyle) && (this.active = !1, this.nextStyle = null, V(this.el, this.name, this.get()));
var a = this.tween;
a && a.context && a.destroy();
}, a.convert = function (a, b) {
if ("auto" == a && this.auto) return a;
var c,
e = "number" == typeof a,
f = "string" == typeof a;
switch (b) {
case t:
if (e) return a;
if (f && "" === a.replace(r, "")) return +a;
c = "number(unitless)";
break;
case u:
if (f) {
if ("" === a && this.original) return this.original;
if (b.test(a)) return "#" == a.charAt(0) && 7 == a.length ? a : d(a);
}
c = "hex or rgb string";
break;
case v:
if (e) return a + this.unit;
if (f && b.test(a)) return a;
c = "number(px) or string(unit)";
break;
case w:
if (e) return a + this.unit;
if (f && b.test(a)) return a;
c = "number(px) or string(unit or %)";
break;
case x:
if (e) return a + this.angle;
if (f && b.test(a)) return a;
c = "number(deg) or string(angle)";
break;
case y:
if (e) return a;
if (f && w.test(a)) return a;
c = "number(unitless) or string(unit or %)";
}
return g(c, a), a;
}, a.redraw = function () {
this.el.offsetHeight;
};
}),
O = l(N, function (a, b) {
a.init = function () {
b.init.apply(this, arguments), this.original || (this.original = this.convert(this.get(), u));
};
}),
P = l(N, function (a, b) {
a.init = function () {
b.init.apply(this, arguments), this.animate = this.fallback;
}, a.get = function () {
return this.$el[this.name]();
}, a.update = function (a) {
this.$el[this.name](a);
};
}),
Q = l(N, function (a, b) {
function c(a, b) {
var c, d, e, f, g;
for (c in a) {
f = Z[c], e = f[0], d = f[1] || c, g = this.convert(a[c], e), b.call(this, d, g, e);
}
}
a.init = function () {
b.init.apply(this, arguments), this.current || (this.current = {}, Z.perspective && U.perspective && (this.current.perspective = U.perspective, V(this.el, this.name, this.style(this.current)), this.redraw()));
}, a.set = function (a) {
c.call(this, a, function (a, b) {
this.current[a] = b;
}), V(this.el, this.name, this.style(this.current)), this.redraw();
}, a.transition = function (a) {
var b = this.values(a);
this.tween = new T({
current: this.current,
values: b,
duration: this.duration,
delay: this.delay,
ease: this.ease
});
var c,
d = {};
for (c in this.current) {
d[c] = c in b ? b[c] : this.current[c];
}
this.active = !0, this.nextStyle = this.style(d);
}, a.fallback = function (a) {
var b = this.values(a);
this.tween = new T({
current: this.current,
values: b,
duration: this.duration,
delay: this.delay,
ease: this.ease,
update: this.update,
context: this
});
}, a.update = function () {
V(this.el, this.name, this.style(this.current));
}, a.style = function (a) {
var b,
c = "";
for (b in a) {
c += b + "(" + a[b] + ") ";
}
return c;
}, a.values = function (a) {
var b,
d = {};
return c.call(this, a, function (a, c, e) {
d[a] = c, void 0 === this.current[a] && (b = 0, ~a.indexOf("scale") && (b = 1), this.current[a] = this.convert(b, e));
}), d;
};
}),
R = l(function (b) {
function c(a) {
1 === n.push(a) && J(g);
}
function g() {
var a,
b,
c,
d = n.length;
if (d) for (J(g), b = K(), a = d; a--;) {
c = n[a], c && c.render(b);
}
}
function i(b) {
var c,
d = a.inArray(b, n);
d >= 0 && (c = n.slice(d + 1), n.length = d, c.length && (n = n.concat(c)));
}
function j(a) {
return Math.round(a * o) / o;
}
function k(a, b, c) {
return e(a[0] + c * (b[0] - a[0]), a[1] + c * (b[1] - a[1]), a[2] + c * (b[2] - a[2]));
}
var l = {
ease: m.ease[1],
from: 0,
to: 1
};
b.init = function (a) {
this.duration = a.duration || 0, this.delay = a.delay || 0;
var b = a.ease || l.ease;
m[b] && (b = m[b][1]), "function" != typeof b && (b = l.ease), this.ease = b, this.update = a.update || f, this.complete = a.complete || f, this.context = a.context || this, this.name = a.name;
var c = a.from,
d = a.to;
void 0 === c && (c = l.from), void 0 === d && (d = l.to), this.unit = a.unit || "", "number" == typeof c && "number" == typeof d ? (this.begin = c, this.change = d - c) : this.format(d, c), this.value = this.begin + this.unit, this.start = K(), a.autoplay !== !1 && this.play();
}, b.play = function () {
this.active || (this.start || (this.start = K()), this.active = !0, c(this));
}, b.stop = function () {
this.active && (this.active = !1, i(this));
}, b.render = function (a) {
var b,
c = a - this.start;
if (this.delay) {
if (c <= this.delay) return;
c -= this.delay;
}
if (c < this.duration) {
var d = this.ease(c, 0, 1, this.duration);
return b = this.startRGB ? k(this.startRGB, this.endRGB, d) : j(this.begin + d * this.change), this.value = b + this.unit, void this.update.call(this.context, this.value);
}
b = this.endHex || this.begin + this.change, this.value = b + this.unit, this.update.call(this.context, this.value), this.complete.call(this.context), this.destroy();
}, b.format = function (a, b) {
if (b += "", a += "", "#" == a.charAt(0)) return this.startRGB = d(b), this.endRGB = d(a), this.endHex = a, this.begin = 0, void (this.change = 1);
if (!this.unit) {
var c = b.replace(r, ""),
e = a.replace(r, "");
c !== e && h("tween", b, a), this.unit = c;
}
b = parseFloat(b), a = parseFloat(a), this.begin = this.value = b, this.change = a - b;
}, b.destroy = function () {
this.stop(), this.context = null, this.ease = this.update = this.complete = f;
};
var n = [],
o = 1e3;
}),
S = l(R, function (a) {
a.init = function (a) {
this.duration = a.duration || 0, this.complete = a.complete || f, this.context = a.context, this.play();
}, a.render = function (a) {
var b = a - this.start;
b < this.duration || (this.complete.call(this.context), this.destroy());
};
}),
T = l(R, function (a, b) {
a.init = function (a) {
this.context = a.context, this.update = a.update, this.tweens = [], this.current = a.current;
var b, c;
for (b in a.values) {
c = a.values[b], this.current[b] !== c && this.tweens.push(new R({
name: b,
from: this.current[b],
to: c,
duration: a.duration,
delay: a.delay,
ease: a.ease,
autoplay: !1
}));
}
this.play();
}, a.render = function (a) {
var b,
c,
d = this.tweens.length,
e = !1;
for (b = d; b--;) {
c = this.tweens[b], c.context && (c.render(a), this.current[c.name] = c.value, e = !0);
}
return e ? void (this.update && this.update.call(this.context)) : this.destroy();
}, a.destroy = function () {
if (b.destroy.call(this), this.tweens) {
var a,
c = this.tweens.length;
for (a = c; a--;) {
this.tweens[a].destroy();
}
this.tweens = null, this.current = null;
}
};
}),
U = b.config = {
debug: !1,
defaultUnit: "px",
defaultAngle: "deg",
keepInherited: !1,
hideBackface: !1,
perspective: "",
fallback: !G.transition,
agentTests: []
};
b.fallback = function (a) {
if (!G.transition) return U.fallback = !0;
U.agentTests.push("(" + a + ")");
var b = new RegExp(U.agentTests.join("|"), "i");
U.fallback = b.test(navigator.userAgent);
}, b.fallback("6.0.[2-5] Safari"), b.tween = function (a) {
return new R(a);
}, b.delay = function (a, b, c) {
return new S({
complete: b,
duration: a,
context: c
});
}, a.fn.tram = function (a) {
return b.call(null, this, a);
};
var V = a.style,
W = a.css,
X = {
transform: G.transform && G.transform.css
},
Y = {
color: [O, u],
background: [O, u, "background-color"],
"outline-color": [O, u],
"border-color": [O, u],
"border-top-color": [O, u],
"border-right-color": [O, u],
"border-bottom-color": [O, u],
"border-left-color": [O, u],
"border-width": [N, v],
"border-top-width": [N, v],
"border-right-width": [N, v],
"border-bottom-width": [N, v],
"border-left-width": [N, v],
"border-spacing": [N, v],
"letter-spacing": [N, v],
margin: [N, v],
"margin-top": [N, v],
"margin-right": [N, v],
"margin-bottom": [N, v],
"margin-left": [N, v],
padding: [N, v],
"padding-top": [N, v],
"padding-right": [N, v],
"padding-bottom": [N, v],
"padding-left": [N, v],
"outline-width": [N, v],
opacity: [N, t],
top: [N, w],
right: [N, w],
bottom: [N, w],
left: [N, w],
"font-size": [N, w],
"text-indent": [N, w],
"word-spacing": [N, w],
width: [N, w],
"min-width": [N, w],
"max-width": [N, w],
height: [N, w],
"min-height": [N, w],
"max-height": [N, w],
"line-height": [N, y],
"scroll-top": [P, t, "scrollTop"],
"scroll-left": [P, t, "scrollLeft"]
},
Z = {};
G.transform && (Y.transform = [Q], Z = {
x: [w, "translateX"],
y: [w, "translateY"],
rotate: [x],
rotateX: [x],
rotateY: [x],
scale: [t],
scaleX: [t],
scaleY: [t],
skew: [x],
skewX: [x],
skewY: [x]
}), G.transform && G.backface && (Z.z = [w, "translateZ"], Z.rotateZ = [x], Z.scaleZ = [t], Z.perspective = [v]);
var $ = /ms/,
_ = /s|\./;
return a.tram = b;
}(window.jQuery);
/***/ }),
 (function(module, exports, __webpack_require__) {
var DESCRIPTORS = __webpack_require__(13);
var call = __webpack_require__(40);
var propertyIsEnumerableModule = __webpack_require__(144);
var createPropertyDescriptor = __webpack_require__(71);
var toIndexedObject = __webpack_require__(27);
var toPropertyKey = __webpack_require__(73);
var hasOwn = __webpack_require__(9);
var IE8_DOM_DEFINE = __webpack_require__(80);
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
O = toIndexedObject(O);
P = toPropertyKey(P);
if (IE8_DOM_DEFINE) try {
return $getOwnPropertyDescriptor(O, P);
} catch (error) {  }
if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};
/***/ }),
 (function(module, exports) {
module.exports = function (bitmap, value) {
return {
enumerable: !(bitmap & 1),
configurable: !(bitmap & 2),
writable: !(bitmap & 4),
value: value
};
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var TypeError = global.TypeError;
module.exports = function (it) {
if (it == undefined) throw TypeError("Can't call method on " + it);
return it;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var toPrimitive = __webpack_require__(147);
var isSymbol = __webpack_require__(74);
module.exports = function (argument) {
var key = toPrimitive(argument, 'string');
return isSymbol(key) ? key : key + '';
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var getBuiltIn = __webpack_require__(28);
var isCallable = __webpack_require__(7);
var isPrototypeOf = __webpack_require__(148);
var USE_SYMBOL_AS_UID = __webpack_require__(75);
var Object = global.Object;
module.exports = USE_SYMBOL_AS_UID ? function (it) {
return typeof it == 'symbol';
} : function (it) {
var $Symbol = getBuiltIn('Symbol');
return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, Object(it));
};
/***/ }),
 (function(module, exports, __webpack_require__) {
/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(76);
module.exports = NATIVE_SYMBOL
&& !Symbol.sham
&& typeof Symbol.iterator == 'symbol';
/***/ }),
 (function(module, exports, __webpack_require__) {
/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(149);
var fails = __webpack_require__(19);
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
var symbol = Symbol();
return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
!Symbol.sham && V8_VERSION && V8_VERSION < 41;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var shared = __webpack_require__(78);
var hasOwn = __webpack_require__(9);
var uid = __webpack_require__(79);
var NATIVE_SYMBOL = __webpack_require__(76);
var USE_SYMBOL_AS_UID = __webpack_require__(75);
var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var symbolFor = Symbol && Symbol['for'];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;
module.exports = function (name) {
if (!hasOwn(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
var description = 'Symbol.' + name;
if (NATIVE_SYMBOL && hasOwn(Symbol, name)) {
WellKnownSymbolsStore[name] = Symbol[name];
} else if (USE_SYMBOL_AS_UID && symbolFor) {
WellKnownSymbolsStore[name] = symbolFor(description);
} else {
WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
}
} return WellKnownSymbolsStore[name];
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var IS_PURE = __webpack_require__(155);
var store = __webpack_require__(41);
(module.exports = function (key, value) {
return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
version: '3.19.0',
mode: IS_PURE ? 'pure' : 'global',
copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
/***/ }),
 (function(module, exports, __webpack_require__) {
var uncurryThis = __webpack_require__(5);
var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);
module.exports = function (key) {
return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var DESCRIPTORS = __webpack_require__(13);
var fails = __webpack_require__(19);
var createElement = __webpack_require__(81);
module.exports = !DESCRIPTORS && !fails(function () {
return Object.defineProperty(createElement('div'), 'a', {
get: function () { return 7; }
}).a != 7;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var isObject = __webpack_require__(20);
var document = global.document;
var EXISTS = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
return EXISTS ? document.createElement(it) : {};
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var uncurryThis = __webpack_require__(5);
var isCallable = __webpack_require__(7);
var store = __webpack_require__(41);
var functionToString = uncurryThis(Function.toString);
if (!isCallable(store.inspectSource)) {
store.inspectSource = function (it) {
return functionToString(it);
};
}
module.exports = store.inspectSource;
/***/ }),
 (function(module, exports, __webpack_require__) {
var shared = __webpack_require__(78);
var uid = __webpack_require__(79);
var keys = shared('keys');
module.exports = function (key) {
return keys[key] || (keys[key] = uid(key));
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var uncurryThis = __webpack_require__(5);
var hasOwn = __webpack_require__(9);
var toIndexedObject = __webpack_require__(27);
var indexOf = __webpack_require__(85).indexOf;
var hiddenKeys = __webpack_require__(44);
var push = uncurryThis([].push);
module.exports = function (object, names) {
var O = toIndexedObject(object);
var i = 0;
var result = [];
var key;
for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
while (names.length > i) if (hasOwn(O, key = names[i++])) {
~indexOf(result, key) || push(result, key);
}
return result;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var toIndexedObject = __webpack_require__(27);
var toAbsoluteIndex = __webpack_require__(164);
var lengthOfArrayLike = __webpack_require__(165);
var createMethod = function (IS_INCLUDES) {
return function ($this, el, fromIndex) {
var O = toIndexedObject($this);
var length = lengthOfArrayLike(O);
var index = toAbsoluteIndex(fromIndex, length);
var value;
if (IS_INCLUDES && el != el) while (length > index) {
value = O[index++];
if (value != value) return true;
} else for (;length > index; index++) {
if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
} return !IS_INCLUDES && -1;
};
};
module.exports = {
includes: createMethod(true),
indexOf: createMethod(false)
};
/***/ }),
 (function(module, exports) {
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (argument) {
var number = +argument;
return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
};
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _createStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
 __webpack_require__.d(__webpack_exports__, "createStore", function() { return _createStore__WEBPACK_IMPORTED_MODULE_0__["default"]; });
 var _combineReducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(90);
 __webpack_require__.d(__webpack_exports__, "combineReducers", function() { return _combineReducers__WEBPACK_IMPORTED_MODULE_1__["default"]; });
 var _bindActionCreators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(92);
 __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return _bindActionCreators__WEBPACK_IMPORTED_MODULE_2__["default"]; });
 var _applyMiddleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(93);
 __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return _applyMiddleware__WEBPACK_IMPORTED_MODULE_3__["default"]; });
 var _compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(47);
 __webpack_require__.d(__webpack_exports__, "compose", function() { return _compose__WEBPACK_IMPORTED_MODULE_4__["default"]; });
 var _utils_warning__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(91);
function isCrushed() {}
if (false) {}
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(175);
 var _getPrototype_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);
 var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(182);
var objectTag = '[object Object]';
var funcProto = Function.prototype,
objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var objectCtorString = funcToString.call(Object);
function isPlainObject(value) {
if (!Object(_isObjectLike_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || Object(_baseGetTag_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) != objectTag) {
return false;
}
var proto = Object(_getPrototype_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
if (proto === null) {
return true;
}
var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
return typeof Ctor == 'function' && Ctor instanceof Ctor &&
funcToString.call(Ctor) == objectCtorString;
}
 __webpack_exports__["default"] = (isPlainObject);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(176);
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;
 __webpack_exports__["default"] = (Symbol);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return combineReducers; });
 var _createStore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
 var lodash_es_isPlainObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(88);
 var _utils_warning__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(91);
function getUndefinedStateErrorMessage(key, action) {
var actionType = action && action.type;
var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
}
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
var reducerKeys = Object.keys(reducers);
var argumentName = action && action.type === _createStore__WEBPACK_IMPORTED_MODULE_0__["ActionTypes"].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';
if (reducerKeys.length === 0) {
return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
}
if (!Object(lodash_es_isPlainObject__WEBPACK_IMPORTED_MODULE_1__["default"])(inputState)) {
return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
}
var unexpectedKeys = Object.keys(inputState).filter(function (key) {
return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
});
unexpectedKeys.forEach(function (key) {
unexpectedKeyCache[key] = true;
});
if (unexpectedKeys.length > 0) {
return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
}
}
function assertReducerSanity(reducers) {
Object.keys(reducers).forEach(function (key) {
var reducer = reducers[key];
var initialState = reducer(undefined, { type: _createStore__WEBPACK_IMPORTED_MODULE_0__["ActionTypes"].INIT });
if (typeof initialState === 'undefined') {
throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
}
var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
if (typeof reducer(undefined, { type: type }) === 'undefined') {
throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore__WEBPACK_IMPORTED_MODULE_0__["ActionTypes"].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
}
});
}
function combineReducers(reducers) {
var reducerKeys = Object.keys(reducers);
var finalReducers = {};
for (var i = 0; i < reducerKeys.length; i++) {
var key = reducerKeys[i];
if (false) {}
if (typeof reducers[key] === 'function') {
finalReducers[key] = reducers[key];
}
}
var finalReducerKeys = Object.keys(finalReducers);
if (false) { var unexpectedKeyCache; }
var sanityError;
try {
assertReducerSanity(finalReducers);
} catch (e) {
sanityError = e;
}
return function combination() {
var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
var action = arguments[1];
if (sanityError) {
throw sanityError;
}
if (false) { var warningMessage; }
var hasChanged = false;
var nextState = {};
for (var i = 0; i < finalReducerKeys.length; i++) {
var key = finalReducerKeys[i];
var reducer = finalReducers[key];
var previousStateForKey = state[key];
var nextStateForKey = reducer(previousStateForKey, action);
if (typeof nextStateForKey === 'undefined') {
var errorMessage = getUndefinedStateErrorMessage(key, action);
throw new Error(errorMessage);
}
nextState[key] = nextStateForKey;
hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
}
return hasChanged ? nextState : state;
};
}
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return warning; });
function warning(message) {
if (typeof console !== 'undefined' && typeof console.error === 'function') {
console.error(message);
}
try {
throw new Error(message);
} catch (e) {}
}
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return bindActionCreators; });
function bindActionCreator(actionCreator, dispatch) {
return function () {
return dispatch(actionCreator.apply(undefined, arguments));
};
}
function bindActionCreators(actionCreators, dispatch) {
if (typeof actionCreators === 'function') {
return bindActionCreator(actionCreators, dispatch);
}
if (typeof actionCreators !== 'object' || actionCreators === null) {
throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
}
var keys = Object.keys(actionCreators);
var boundActionCreators = {};
for (var i = 0; i < keys.length; i++) {
var key = keys[i];
var actionCreator = actionCreators[key];
if (typeof actionCreator === 'function') {
boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
}
}
return boundActionCreators;
}
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return applyMiddleware; });
 var _compose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
function applyMiddleware() {
for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
middlewares[_key] = arguments[_key];
}
return function (createStore) {
return function (reducer, preloadedState, enhancer) {
var store = createStore(reducer, preloadedState, enhancer);
var _dispatch = store.dispatch;
var chain = [];
var middlewareAPI = {
getState: store.getState,
dispatch: function dispatch(action) {
return _dispatch(action);
}
};
chain = middlewares.map(function (middleware) {
return middleware(middlewareAPI);
});
_dispatch = _compose__WEBPACK_IMPORTED_MODULE_0__["default"].apply(undefined, chain)(store.dispatch);
return _extends({}, store, {
dispatch: _dispatch
});
};
};
}
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ActionAppliesTo = exports.ActionTypeConsts = void 0;
var ActionTypeConsts = {
TRANSFORM_MOVE: 'TRANSFORM_MOVE',
TRANSFORM_SCALE: 'TRANSFORM_SCALE',
TRANSFORM_ROTATE: 'TRANSFORM_ROTATE',
TRANSFORM_SKEW: 'TRANSFORM_SKEW',
STYLE_OPACITY: 'STYLE_OPACITY',
STYLE_SIZE: 'STYLE_SIZE',
STYLE_FILTER: 'STYLE_FILTER',
STYLE_BACKGROUND_COLOR: 'STYLE_BACKGROUND_COLOR',
STYLE_BORDER: 'STYLE_BORDER',
STYLE_TEXT_COLOR: 'STYLE_TEXT_COLOR',
PLUGIN_LOTTIE: 'PLUGIN_LOTTIE',
GENERAL_DISPLAY: 'GENERAL_DISPLAY',
GENERAL_START_ACTION: 'GENERAL_START_ACTION',
GENERAL_CONTINUOUS_ACTION: 'GENERAL_CONTINUOUS_ACTION',
GENERAL_COMBO_CLASS: 'GENERAL_COMBO_CLASS',
GENERAL_STOP_ACTION: 'GENERAL_STOP_ACTION',
GENERAL_LOOP: 'GENERAL_LOOP',
STYLE_BOX_SHADOW: 'STYLE_BOX_SHADOW'
};
exports.ActionTypeConsts = ActionTypeConsts;
var ActionAppliesTo = {
ELEMENT: 'ELEMENT',
ELEMENT_CLASS: 'ELEMENT_CLASS',
TRIGGER_ELEMENT: 'TRIGGER_ELEMENT'
};
exports.ActionAppliesTo = ActionAppliesTo;
/***/ }),
 (function(module, exports, __webpack_require__) {
var createFind = __webpack_require__(96),
findIndex = __webpack_require__(260);
var find = createFind(findIndex);
module.exports = find;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIteratee = __webpack_require__(10),
isArrayLike = __webpack_require__(16),
keys = __webpack_require__(36);
function createFind(findIndexFunc) {
return function(collection, predicate, fromIndex) {
var iterable = Object(collection);
if (!isArrayLike(collection)) {
var iteratee = baseIteratee(predicate, 3);
collection = keys(collection);
predicate = function(key) { return iteratee(iterable[key], key, iterable); };
}
var index = findIndexFunc(collection, predicate, fromIndex);
return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
};
}
module.exports = createFind;
/***/ }),
 (function(module, exports, __webpack_require__) {
var ListCache = __webpack_require__(32),
stackClear = __webpack_require__(202),
stackDelete = __webpack_require__(203),
stackGet = __webpack_require__(204),
stackHas = __webpack_require__(205),
stackSet = __webpack_require__(206);
function Stack(entries) {
var data = this.__data__ = new ListCache(entries);
this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
module.exports = Stack;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetTag = __webpack_require__(15),
isObject = __webpack_require__(8);
var asyncTag = '[object AsyncFunction]',
funcTag = '[object Function]',
genTag = '[object GeneratorFunction]',
proxyTag = '[object Proxy]';
function isFunction(value) {
if (!isObject(value)) {
return false;
}
var tag = baseGetTag(value);
return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
module.exports = isFunction;
/***/ }),
 (function(module, exports, __webpack_require__) {
(function(global) {
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
module.exports = freeGlobal;
}.call(this, __webpack_require__(26)))
/***/ }),
 (function(module, exports) {
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
if (func != null) {
try {
return funcToString.call(func);
} catch (e) {}
try {
return (func + '');
} catch (e) {}
}
return '';
}
module.exports = toSource;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIsEqualDeep = __webpack_require__(225),
isObjectLike = __webpack_require__(12);
function baseIsEqual(value, other, bitmask, customizer, stack) {
if (value === other) {
return true;
}
if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
return value !== value && other !== other;
}
return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
module.exports = baseIsEqual;
/***/ }),
 (function(module, exports, __webpack_require__) {
var SetCache = __webpack_require__(226),
arraySome = __webpack_require__(229),
cacheHas = __webpack_require__(230);
var COMPARE_PARTIAL_FLAG = 1,
COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
arrLength = array.length,
othLength = other.length;
if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
return false;
}
var arrStacked = stack.get(array);
var othStacked = stack.get(other);
if (arrStacked && othStacked) {
return arrStacked == other && othStacked == array;
}
var index = -1,
result = true,
seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;
stack.set(array, other);
stack.set(other, array);
while (++index < arrLength) {
var arrValue = array[index],
othValue = other[index];
if (customizer) {
var compared = isPartial
? customizer(othValue, arrValue, index, other, array, stack)
: customizer(arrValue, othValue, index, array, other, stack);
}
if (compared !== undefined) {
if (compared) {
continue;
}
result = false;
break;
}
if (seen) {
if (!arraySome(other, function(othValue, othIndex) {
if (!cacheHas(seen, othIndex) &&
(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
return seen.push(othIndex);
}
})) {
result = false;
break;
}
} else if (!(
arrValue === othValue ||
equalFunc(arrValue, othValue, bitmask, customizer, stack)
)) {
result = false;
break;
}
}
stack['delete'](array);
stack['delete'](other);
return result;
}
module.exports = equalArrays;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayPush = __webpack_require__(52),
isArray = __webpack_require__(2);
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
var result = keysFunc(object);
return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
module.exports = baseGetAllKeys;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayFilter = __webpack_require__(237),
stubArray = __webpack_require__(105);
var objectProto = Object.prototype;
var propertyIsEnumerable = objectProto.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
if (object == null) {
return [];
}
object = Object(object);
return arrayFilter(nativeGetSymbols(object), function(symbol) {
return propertyIsEnumerable.call(object, symbol);
});
};
module.exports = getSymbols;
/***/ }),
 (function(module, exports) {
function stubArray() {
return [];
}
module.exports = stubArray;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseTimes = __webpack_require__(238),
isArguments = __webpack_require__(37),
isArray = __webpack_require__(2),
isBuffer = __webpack_require__(53),
isIndex = __webpack_require__(54),
isTypedArray = __webpack_require__(55);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
var isArr = isArray(value),
isArg = !isArr && isArguments(value),
isBuff = !isArr && !isArg && isBuffer(value),
isType = !isArr && !isArg && !isBuff && isTypedArray(value),
skipIndexes = isArr || isArg || isBuff || isType,
result = skipIndexes ? baseTimes(value.length, String) : [],
length = result.length;
for (var key in value) {
if ((inherited || hasOwnProperty.call(value, key)) &&
!(skipIndexes && (
key == 'length' ||
(isBuff && (key == 'offset' || key == 'parent')) ||
(isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
isIndex(key, length)
))) {
result.push(key);
}
}
return result;
}
module.exports = arrayLikeKeys;
/***/ }),
 (function(module, exports) {
module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};
/***/ }),
 (function(module, exports) {
function overArg(func, transform) {
return function(arg) {
return func(transform(arg));
};
}
module.exports = overArg;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11),
root = __webpack_require__(6);
var WeakMap = getNative(root, 'WeakMap');
module.exports = WeakMap;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(8);
function isStrictComparable(value) {
return value === value && !isObject(value);
}
module.exports = isStrictComparable;
/***/ }),
 (function(module, exports) {
function matchesStrictComparable(key, srcValue) {
return function(object) {
if (object == null) {
return false;
}
return object[key] === srcValue &&
(srcValue !== undefined || (key in Object(object)));
};
}
module.exports = matchesStrictComparable;
/***/ }),
 (function(module, exports) {
function arrayMap(array, iteratee) {
var index = -1,
length = array == null ? 0 : array.length,
result = Array(length);
while (++index < length) {
result[index] = iteratee(array[index], index, array);
}
return result;
}
module.exports = arrayMap;
/***/ }),
 (function(module, exports) {
function baseProperty(key) {
return function(object) {
return object == null ? undefined : object[key];
};
}
module.exports = baseProperty;
/***/ }),
 (function(module, exports) {
function baseFindIndex(array, predicate, fromIndex, fromRight) {
var length = array.length,
index = fromIndex + (fromRight ? 1 : -1);
while ((fromRight ? index-- : ++index < length)) {
if (predicate(array[index], index, array)) {
return index;
}
}
return -1;
}
module.exports = baseFindIndex;
/***/ }),
 (function(module, exports, __webpack_require__) {
var toFinite = __webpack_require__(261);
function toInteger(value) {
var result = toFinite(value),
remainder = result % 1;
return result === result ? (remainder ? result - remainder : result) : 0;
}
module.exports = toInteger;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.inQuad = inQuad;
exports.outQuad = outQuad;
exports.inOutQuad = inOutQuad;
exports.inCubic = inCubic;
exports.outCubic = outCubic;
exports.inOutCubic = inOutCubic;
exports.inQuart = inQuart;
exports.outQuart = outQuart;
exports.inOutQuart = inOutQuart;
exports.inQuint = inQuint;
exports.outQuint = outQuint;
exports.inOutQuint = inOutQuint;
exports.inSine = inSine;
exports.outSine = outSine;
exports.inOutSine = inOutSine;
exports.inExpo = inExpo;
exports.outExpo = outExpo;
exports.inOutExpo = inOutExpo;
exports.inCirc = inCirc;
exports.outCirc = outCirc;
exports.inOutCirc = inOutCirc;
exports.outBounce = outBounce;
exports.inBack = inBack;
exports.outBack = outBack;
exports.inOutBack = inOutBack;
exports.inElastic = inElastic;
exports.outElastic = outElastic;
exports.inOutElastic = inOutElastic;
exports.swingFromTo = swingFromTo;
exports.swingFrom = swingFrom;
exports.swingTo = swingTo;
exports.bounce = bounce;
exports.bouncePast = bouncePast;
exports.easeInOut = exports.easeOut = exports.easeIn = exports.ease = void 0;
var _bezierEasing = _interopRequireDefault(__webpack_require__(117)); // Easing functions adapted from Thomas Fuchs & Jeremy Kahn
var magicSwing = 1.70158;
var ease = (0, _bezierEasing["default"])(0.25, 0.1, 0.25, 1.0);
exports.ease = ease;
var easeIn = (0, _bezierEasing["default"])(0.42, 0.0, 1.0, 1.0);
exports.easeIn = easeIn;
var easeOut = (0, _bezierEasing["default"])(0.0, 0.0, 0.58, 1.0);
exports.easeOut = easeOut;
var easeInOut = (0, _bezierEasing["default"])(0.42, 0.0, 0.58, 1.0);
exports.easeInOut = easeInOut;
function inQuad(pos) {
return Math.pow(pos, 2);
}
function outQuad(pos) {
return -(Math.pow(pos - 1, 2) - 1);
}
function inOutQuad(pos) {
if ((pos /= 0.5) < 1) {
return 0.5 * Math.pow(pos, 2);
}
return -0.5 * ((pos -= 2) * pos - 2);
}
function inCubic(pos) {
return Math.pow(pos, 3);
}
function outCubic(pos) {
return Math.pow(pos - 1, 3) + 1;
}
function inOutCubic(pos) {
if ((pos /= 0.5) < 1) {
return 0.5 * Math.pow(pos, 3);
}
return 0.5 * (Math.pow(pos - 2, 3) + 2);
}
function inQuart(pos) {
return Math.pow(pos, 4);
}
function outQuart(pos) {
return -(Math.pow(pos - 1, 4) - 1);
}
function inOutQuart(pos) {
if ((pos /= 0.5) < 1) {
return 0.5 * Math.pow(pos, 4);
}
return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
}
function inQuint(pos) {
return Math.pow(pos, 5);
}
function outQuint(pos) {
return Math.pow(pos - 1, 5) + 1;
}
function inOutQuint(pos) {
if ((pos /= 0.5) < 1) {
return 0.5 * Math.pow(pos, 5);
}
return 0.5 * (Math.pow(pos - 2, 5) + 2);
}
function inSine(pos) {
return -Math.cos(pos * (Math.PI / 2)) + 1;
}
function outSine(pos) {
return Math.sin(pos * (Math.PI / 2));
}
function inOutSine(pos) {
return -0.5 * (Math.cos(Math.PI * pos) - 1);
}
function inExpo(pos) {
return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
}
function outExpo(pos) {
return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
}
function inOutExpo(pos) {
if (pos === 0) {
return 0;
}
if (pos === 1) {
return 1;
}
if ((pos /= 0.5) < 1) {
return 0.5 * Math.pow(2, 10 * (pos - 1));
}
return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
}
function inCirc(pos) {
return -(Math.sqrt(1 - pos * pos) - 1);
}
function outCirc(pos) {
return Math.sqrt(1 - Math.pow(pos - 1, 2));
}
function inOutCirc(pos) {
if ((pos /= 0.5) < 1) {
return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
}
return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
}
function outBounce(pos) {
if (pos < 1 / 2.75) {
return 7.5625 * pos * pos;
} else if (pos < 2 / 2.75) {
return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
} else if (pos < 2.5 / 2.75) {
return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
} else {
return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
}
}
function inBack(pos) {
var s = magicSwing;
return pos * pos * ((s + 1) * pos - s);
}
function outBack(pos) {
var s = magicSwing;
return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
}
function inOutBack(pos) {
var s = magicSwing;
if ((pos /= 0.5) < 1) {
return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
}
return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
}
function inElastic(pos) {
var s = magicSwing;
var p = 0;
var a = 1;
if (pos === 0) {
return 0;
}
if (pos === 1) {
return 1;
}
if (!p) {
p = 0.3;
}
if (a < 1) {
a = 1;
s = p / 4;
} else {
s = p / (2 * Math.PI) * Math.asin(1 / a);
}
return -(a * Math.pow(2, 10 * (pos -= 1)) * Math.sin((pos - s) * (2 * Math.PI) / p));
}
function outElastic(pos) {
var s = magicSwing;
var p = 0;
var a = 1;
if (pos === 0) {
return 0;
}
if (pos === 1) {
return 1;
}
if (!p) {
p = 0.3;
}
if (a < 1) {
a = 1;
s = p / 4;
} else {
s = p / (2 * Math.PI) * Math.asin(1 / a);
}
return a * Math.pow(2, -10 * pos) * Math.sin((pos - s) * (2 * Math.PI) / p) + 1;
}
function inOutElastic(pos) {
var s = magicSwing;
var p = 0;
var a = 1;
if (pos === 0) {
return 0;
}
if ((pos /= 1 / 2) === 2) {
return 1;
}
if (!p) {
p = 0.3 * 1.5;
}
if (a < 1) {
a = 1;
s = p / 4;
} else {
s = p / (2 * Math.PI) * Math.asin(1 / a);
}
if (pos < 1) {
return -0.5 * (a * Math.pow(2, 10 * (pos -= 1)) * Math.sin((pos - s) * (2 * Math.PI) / p));
}
return a * Math.pow(2, -10 * (pos -= 1)) * Math.sin((pos - s) * (2 * Math.PI) / p) * 0.5 + 1;
}
function swingFromTo(pos) {
var s = magicSwing;
return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
}
function swingFrom(pos) {
var s = magicSwing;
return pos * pos * ((s + 1) * pos - s);
}
function swingTo(pos) {
var s = magicSwing;
return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
}
function bounce(pos) {
if (pos < 1 / 2.75) {
return 7.5625 * pos * pos;
} else if (pos < 2 / 2.75) {
return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
} else if (pos < 2.5 / 2.75) {
return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
} else {
return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
}
}
function bouncePast(pos) {
if (pos < 1 / 2.75) {
return 7.5625 * pos * pos;
} else if (pos < 2 / 2.75) {
return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
} else if (pos < 2.5 / 2.75) {
return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
} else {
return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
}
}
/***/ }),
 (function(module, exports) {
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;
var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
var float32ArraySupported = typeof Float32Array === 'function';
function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
function binarySubdivide (aX, aA, aB, mX1, mX2) {
var currentX, currentT, i = 0;
do {
currentT = aA + (aB - aA) / 2.0;
currentX = calcBezier(currentT, mX1, mX2) - aX;
if (currentX > 0.0) {
aB = currentT;
} else {
aA = currentT;
}
} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
return currentT;
}
function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
var currentSlope = getSlope(aGuessT, mX1, mX2);
if (currentSlope === 0.0) {
return aGuessT;
}
var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}
module.exports = function bezier (mX1, mY1, mX2, mY2) {
if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
throw new Error('bezier x values must be in [0, 1] range');
}
var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
if (mX1 !== mY1 || mX2 !== mY2) {
for (var i = 0; i < kSplineTableSize; ++i) {
sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
}
}
function getTForX (aX) {
var intervalStart = 0.0;
var currentSample = 1;
var lastSample = kSplineTableSize - 1;
for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
intervalStart += kSampleStepSize;
}
--currentSample;
var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
var guessForT = intervalStart + dist * kSampleStepSize;
var initialSlope = getSlope(guessForT, mX1, mX2);
if (initialSlope >= NEWTON_MIN_SLOPE) {
return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
} else if (initialSlope === 0.0) {
return guessForT;
} else {
return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
}
}
return function BezierEasing (x) {
if (mX1 === mY1 && mX2 === mY2) {
return x; // linear
}
if (x === 0) {
return 0;
}
if (x === 1) {
return 1;
}
return calcBezier(getTForX(x), mY1, mY2);
};
};
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault2 = __webpack_require__(1);
var _toConsumableArray2 = _interopRequireDefault2(__webpack_require__(119));
var _interopRequireDefault = __webpack_require__(1);
var _interopRequireWildcard = __webpack_require__(18);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.optimizeFloat = optimizeFloat;
exports.createBezierEasing = createBezierEasing;
exports.applyEasing = applyEasing;
var easings = _interopRequireWildcard(__webpack_require__(116));
var _bezierEasing = _interopRequireDefault(__webpack_require__(117));
function optimizeFloat(value) {
var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
var base = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
var pow = Math.pow(base, digits);
var _float = Number(Math.round(value * pow) / pow);
return Math.abs(_float) > 0.0001 ? _float : 0;
}
function createBezierEasing(easing) {
return (0, _bezierEasing["default"]).apply(void 0, (0, _toConsumableArray2["default"])(easing));
}
function applyEasing(easing, position, customEasingFn) {
if (position === 0) {
return 0;
}
if (position === 1) {
return 1;
}
if (customEasingFn) {
return optimizeFloat(position > 0 ? customEasingFn(position) : position);
}
return optimizeFloat(position > 0 && easing && easings[easing] ? easings[easing](position) : position);
}
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayWithoutHoles = __webpack_require__(264);
var iterableToArray = __webpack_require__(265);
var nonIterableSpread = __webpack_require__(266);
function _toConsumableArray(arr) {
return arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
var _defineProperty2 = _interopRequireDefault(__webpack_require__(21));
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.isPluginType = isPluginType;
exports.clearPlugin = exports.renderPlugin = exports.createPluginInstance = exports.getPluginDestination = exports.getPluginDuration = exports.getPluginOrigin = exports.getPluginConfig = void 0;
var _IX2LottieUtils = __webpack_require__(268);
var _constants = __webpack_require__(4);
var _IX2BrowserSupport = __webpack_require__(48); // eslint-disable-next-line webflow/module-top-level-imports, webflow/packages-must-be-defined
var pluginMethodMap = (0, _defineProperty2["default"])({}, _constants.ActionTypeConsts.PLUGIN_LOTTIE, {
getConfig: _IX2LottieUtils.getPluginConfig,
getOrigin: _IX2LottieUtils.getPluginOrigin,
getDuration: _IX2LottieUtils.getPluginDuration,
getDestination: _IX2LottieUtils.getPluginDestination,
createInstance: _IX2LottieUtils.createPluginInstance,
render: _IX2LottieUtils.renderPlugin,
clear: _IX2LottieUtils.clearPlugin
});
function isPluginType(actionTypeId) {
return actionTypeId === _constants.ActionTypeConsts.PLUGIN_LOTTIE;
}
var pluginMethod = function pluginMethod(methodName) {
return function (actionTypeId) {
if (!_IX2BrowserSupport.IS_BROWSER_ENV) {
return function () {
return null;
};
}
var plugin = pluginMethodMap[actionTypeId];
if (!plugin) {
throw new Error("IX2 no plugin configured for: ".concat(actionTypeId));
}
var method = plugin[methodName];
if (!method) {
throw new Error("IX2 invalid plugin method: ".concat(methodName));
}
return method;
};
};
var getPluginConfig = pluginMethod('getConfig');
exports.getPluginConfig = getPluginConfig;
var getPluginOrigin = pluginMethod('getOrigin');
exports.getPluginOrigin = getPluginOrigin;
var getPluginDuration = pluginMethod('getDuration');
exports.getPluginDuration = getPluginDuration;
var getPluginDestination = pluginMethod('getDestination');
exports.getPluginDestination = getPluginDestination;
var createPluginInstance = pluginMethod('createInstance');
exports.createPluginInstance = createPluginInstance;
var renderPlugin = pluginMethod('render');
exports.renderPlugin = renderPlugin;
var clearPlugin = pluginMethod('clear');
exports.clearPlugin = clearPlugin;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseForOwn = __webpack_require__(122),
createBaseEach = __webpack_require__(275);
var baseEach = createBaseEach(baseForOwn);
module.exports = baseEach;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseFor = __webpack_require__(273),
keys = __webpack_require__(36);
function baseForOwn(object, iteratee) {
return object && baseFor(object, iteratee, keys);
}
module.exports = baseForOwn;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault2 = __webpack_require__(1);
var _toConsumableArray2 = _interopRequireDefault2(__webpack_require__(119));
var _interopRequireWildcard = __webpack_require__(18);
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.observeRequests = observeRequests;
exports.startEngine = startEngine;
exports.stopEngine = stopEngine;
exports.stopAllActionGroups = stopAllActionGroups;
exports.stopActionGroup = stopActionGroup;
exports.startActionGroup = startActionGroup;
var _extends2 = _interopRequireDefault(__webpack_require__(31));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(282));
var _find = _interopRequireDefault(__webpack_require__(95));
var _get = _interopRequireDefault(__webpack_require__(60));
var _size = _interopRequireDefault(__webpack_require__(283));
var _omitBy = _interopRequireDefault(__webpack_require__(289));
var _isEmpty = _interopRequireDefault(__webpack_require__(301));
var _mapValues = _interopRequireDefault(__webpack_require__(302));
var _forEach = _interopRequireDefault(__webpack_require__(303));
var _throttle = _interopRequireDefault(__webpack_require__(306));
var _constants = __webpack_require__(4);
var _shared = __webpack_require__(14);
var _IX2EngineActions = __webpack_require__(65);
var elementApi = _interopRequireWildcard(__webpack_require__(309));
var _IX2VanillaEvents = _interopRequireDefault(__webpack_require__(310));
var QuickEffectsIdList = Object.keys(_constants.QuickEffectIds);
var isQuickEffect = function isQuickEffect(actionTypeId) {
return QuickEffectsIdList.includes(actionTypeId);
};
var _constants$IX2EngineC = _constants.IX2EngineConstants,
COLON_DELIMITER = _constants$IX2EngineC.COLON_DELIMITER,
BOUNDARY_SELECTOR = _constants$IX2EngineC.BOUNDARY_SELECTOR,
HTML_ELEMENT = _constants$IX2EngineC.HTML_ELEMENT,
RENDER_GENERAL = _constants$IX2EngineC.RENDER_GENERAL,
W_MOD_IX = _constants$IX2EngineC.W_MOD_IX;
var _shared$IX2VanillaUti = _shared.IX2VanillaUtils,
getAffectedElements = _shared$IX2VanillaUti.getAffectedElements,
getElementId = _shared$IX2VanillaUti.getElementId,
getDestinationValues = _shared$IX2VanillaUti.getDestinationValues,
observeStore = _shared$IX2VanillaUti.observeStore,
getInstanceId = _shared$IX2VanillaUti.getInstanceId,
renderHTMLElement = _shared$IX2VanillaUti.renderHTMLElement,
clearAllStyles = _shared$IX2VanillaUti.clearAllStyles,
getMaxDurationItemIndex = _shared$IX2VanillaUti.getMaxDurationItemIndex,
getComputedStyle = _shared$IX2VanillaUti.getComputedStyle,
getInstanceOrigin = _shared$IX2VanillaUti.getInstanceOrigin,
reduceListToGroup = _shared$IX2VanillaUti.reduceListToGroup,
shouldNamespaceEventParameter = _shared$IX2VanillaUti.shouldNamespaceEventParameter,
getNamespacedParameterId = _shared$IX2VanillaUti.getNamespacedParameterId,
shouldAllowMediaQuery = _shared$IX2VanillaUti.shouldAllowMediaQuery,
cleanupHTMLElement = _shared$IX2VanillaUti.cleanupHTMLElement,
stringifyTarget = _shared$IX2VanillaUti.stringifyTarget,
mediaQueriesEqual = _shared$IX2VanillaUti.mediaQueriesEqual,
shallowEqual = _shared$IX2VanillaUti.shallowEqual;
var _shared$IX2VanillaPlu = _shared.IX2VanillaPlugins,
isPluginType = _shared$IX2VanillaPlu.isPluginType,
createPluginInstance = _shared$IX2VanillaPlu.createPluginInstance,
getPluginDuration = _shared$IX2VanillaPlu.getPluginDuration;
var ua = navigator.userAgent;
var IS_MOBILE_SAFARI = ua.match(/iPad/i) || ua.match(/iPhone/); // Keep throttled events at ~80fps to reduce reflows while maintaining render accuracy
var THROTTLED_EVENT_WAIT = 12; // $FlowFixMe
function observeRequests(store) {
observeStore({
store: store,
select: function select(_ref) {
var ixRequest = _ref.ixRequest;
return ixRequest.preview;
},
onChange: handlePreviewRequest
});
observeStore({
store: store,
select: function select(_ref2) {
var ixRequest = _ref2.ixRequest;
return ixRequest.playback;
},
onChange: handlePlaybackRequest
});
observeStore({
store: store,
select: function select(_ref3) {
var ixRequest = _ref3.ixRequest;
return ixRequest.stop;
},
onChange: handleStopRequest
});
observeStore({
store: store,
select: function select(_ref4) {
var ixRequest = _ref4.ixRequest;
return ixRequest.clear;
},
onChange: handleClearRequest
});
}
function observeMediaQueryChange(store) {
observeStore({
store: store,
select: function select(_ref5) {
var ixSession = _ref5.ixSession;
return ixSession.mediaQueryKey;
},
onChange: function onChange() {
stopEngine(store);
clearAllStyles({
store: store,
elementApi: elementApi
});
startEngine({
store: store,
allowEvents: true
});
dispatchPageUpdateEvent();
}
});
}
function observeOneRenderTick(store, onTick) {
var unsubscribe = observeStore({
store: store,
select: function select(_ref6) {
var ixSession = _ref6.ixSession;
return ixSession.tick;
},
onChange: function onChange(tick) {
onTick(tick);
unsubscribe();
}
});
}
function handlePreviewRequest(_ref7, store) {
var rawData = _ref7.rawData,
defer = _ref7.defer;
var start = function start() {
startEngine({
store: store,
rawData: rawData,
allowEvents: true
});
dispatchPageUpdateEvent();
};
defer ? setTimeout(start, 0) : start();
}
function dispatchPageUpdateEvent() {
document.dispatchEvent(new CustomEvent('IX2_PAGE_UPDATE'));
}
function handlePlaybackRequest(playback, store) {
var actionTypeId = playback.actionTypeId,
actionListId = playback.actionListId,
actionItemId = playback.actionItemId,
eventId = playback.eventId,
allowEvents = playback.allowEvents,
immediate = playback.immediate,
testManual = playback.testManual,
_playback$verbose = playback.verbose,
verbose = _playback$verbose === void 0 ? true : _playback$verbose;
var rawData = playback.rawData;
if (actionListId && actionItemId && rawData && immediate) {
var actionList = rawData.actionLists[actionListId];
if (actionList) {
rawData = reduceListToGroup({
actionList: actionList,
actionItemId: actionItemId,
rawData: rawData
});
}
}
startEngine({
store: store,
rawData: rawData,
allowEvents: allowEvents,
testManual: testManual
});
if (actionListId && actionTypeId === _constants.ActionTypeConsts.GENERAL_START_ACTION || isQuickEffect(actionTypeId)) {
stopActionGroup({
store: store,
actionListId: actionListId
});
renderInitialGroup({
store: store,
actionListId: actionListId,
eventId: eventId
});
var started = startActionGroup({
store: store,
eventId: eventId,
actionListId: actionListId,
immediate: immediate,
verbose: verbose
});
if (verbose && started) {
store.dispatch((0, _IX2EngineActions.actionListPlaybackChanged)({
actionListId: actionListId,
isPlaying: !immediate
}));
}
}
}
function handleStopRequest(_ref8, store) {
var actionListId = _ref8.actionListId;
if (actionListId) {
stopActionGroup({
store: store,
actionListId: actionListId
});
} else {
stopAllActionGroups({
store: store
});
}
stopEngine(store);
}
function handleClearRequest(state, store) {
stopEngine(store);
clearAllStyles({
store: store,
elementApi: elementApi
});
} // $FlowFixMe
function startEngine(_ref9) {
var store = _ref9.store,
rawData = _ref9.rawData,
allowEvents = _ref9.allowEvents,
testManual = _ref9.testManual;
var _store$getState = store.getState(),
ixSession = _store$getState.ixSession;
if (rawData) {
store.dispatch((0, _IX2EngineActions.rawDataImported)(rawData));
}
if (!ixSession.active) {
store.dispatch((0, _IX2EngineActions.sessionInitialized)({
hasBoundaryNodes: Boolean(document.querySelector(BOUNDARY_SELECTOR)),
reducedMotion: // $FlowFixMe - Remove this attribute on beta launch
document.body.hasAttribute('data-wf-ix-vacation') && window.matchMedia('(prefers-reduced-motion)').matches
}));
if (allowEvents) {
bindEvents(store);
addDocumentClass();
if (store.getState().ixSession.hasDefinedMediaQueries) {
observeMediaQueryChange(store);
}
}
store.dispatch((0, _IX2EngineActions.sessionStarted)());
startRenderLoop(store, testManual);
}
}
function addDocumentClass() {
var _document = document,
documentElement = _document.documentElement; // $FlowFixMe
if (documentElement.className.indexOf(W_MOD_IX) === -1) {
documentElement.className += " ".concat(W_MOD_IX);
}
}
function startRenderLoop(store, testManual) {
var handleFrame = function handleFrame(now) {
var _store$getState2 = store.getState(),
ixSession = _store$getState2.ixSession,
ixParameters = _store$getState2.ixParameters;
if (ixSession.active) {
store.dispatch((0, _IX2EngineActions.animationFrameChanged)(now, ixParameters));
if (testManual) {
observeOneRenderTick(store, handleFrame);
} else {
requestAnimationFrame(handleFrame);
}
}
};
handleFrame(window.performance.now());
} // $FlowFixMe
function stopEngine(store) {
var _store$getState3 = store.getState(),
ixSession = _store$getState3.ixSession;
if (ixSession.active) {
var eventListeners = ixSession.eventListeners;
eventListeners.forEach(clearEventListener);
store.dispatch((0, _IX2EngineActions.sessionStopped)());
}
}
function clearEventListener(_ref10) {
var target = _ref10.target,
listenerParams = _ref10.listenerParams;
target.removeEventListener.apply(target, listenerParams);
}
function createGroupInstances(_ref11) {
var store = _ref11.store,
eventStateKey = _ref11.eventStateKey,
eventTarget = _ref11.eventTarget,
eventId = _ref11.eventId,
eventConfig = _ref11.eventConfig,
actionListId = _ref11.actionListId,
parameterGroup = _ref11.parameterGroup,
smoothing = _ref11.smoothing,
restingValue = _ref11.restingValue;
var _store$getState4 = store.getState(),
ixData = _store$getState4.ixData,
ixSession = _store$getState4.ixSession;
var events = ixData.events;
var event = events[eventId];
var eventTypeId = event.eventTypeId;
var targetCache = {};
var instanceActionGroups = {};
var instanceConfigs = [];
var continuousActionGroups = parameterGroup.continuousActionGroups;
var parameterId = parameterGroup.id;
if (shouldNamespaceEventParameter(eventTypeId, eventConfig)) {
parameterId = getNamespacedParameterId(eventStateKey, parameterId);
} // Limit affected elements when event target is within a boundary node
var eventElementRoot = ixSession.hasBoundaryNodes && eventTarget ? elementApi.getClosestElement(eventTarget, BOUNDARY_SELECTOR) : null;
continuousActionGroups.forEach(function (actionGroup) {
var keyframe = actionGroup.keyframe,
actionItems = actionGroup.actionItems;
actionItems.forEach(function (actionItem) {
var actionTypeId = actionItem.actionTypeId;
var target = actionItem.config.target;
if (!target) {
return;
}
var elementRoot = target.boundaryMode ? eventElementRoot : null;
var key = stringifyTarget(target) + COLON_DELIMITER + actionTypeId;
instanceActionGroups[key] = appendActionItem(instanceActionGroups[key], keyframe, actionItem);
if (!targetCache[key]) {
targetCache[key] = true;
var config = actionItem.config;
getAffectedElements({
config: config,
event: event,
eventTarget: eventTarget,
elementRoot: elementRoot,
elementApi: elementApi
}).forEach(function (element) {
instanceConfigs.push({
element: element,
key: key
});
});
}
});
});
instanceConfigs.forEach(function (_ref12) {
var element = _ref12.element,
key = _ref12.key;
var actionGroups = instanceActionGroups[key];
var actionItem = (0, _get["default"])(actionGroups, "[0].actionItems[0]", {});
var actionTypeId = actionItem.actionTypeId;
var pluginInstance = isPluginType(actionTypeId) ? // $FlowFixMe
createPluginInstance(actionTypeId)(element, actionItem) : null;
var destination = getDestinationValues({
element: element,
actionItem: actionItem,
elementApi: elementApi
}, // $FlowFixMe
pluginInstance);
createInstance({
store: store,
element: element,
eventId: eventId,
actionListId: actionListId,
actionItem: actionItem,
destination: destination,
continuous: true,
parameterId: parameterId,
actionGroups: actionGroups,
smoothing: smoothing,
restingValue: restingValue,
pluginInstance: pluginInstance
});
});
}
function appendActionItem() {
var actionGroups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
var keyframe = arguments.length > 1 ? arguments[1] : undefined;
var actionItem = arguments.length > 2 ? arguments[2] : undefined;
var newActionGroups = (0, _toConsumableArray2["default"])(actionGroups);
var groupIndex;
newActionGroups.some(function (group, index) {
if (group.keyframe === keyframe) {
groupIndex = index;
return true;
}
return false;
});
if (groupIndex == null) {
groupIndex = newActionGroups.length;
newActionGroups.push({
keyframe: keyframe,
actionItems: []
});
}
newActionGroups[groupIndex].actionItems.push(actionItem);
return newActionGroups;
}
function bindEvents(store) {
var _store$getState5 = store.getState(),
ixData = _store$getState5.ixData;
var eventTypeMap = ixData.eventTypeMap;
updateViewportWidth(store);
(0, _forEach["default"])(eventTypeMap, function (events, key) {
var logic = _IX2VanillaEvents["default"][key];
if (!logic) {
console.warn("IX2 event type not configured: ".concat(key));
return;
}
bindEventType({
logic: logic,
store: store,
events: events
});
});
var _store$getState6 = store.getState(),
ixSession = _store$getState6.ixSession;
if (ixSession.eventListeners.length) {
bindResizeEvents(store);
}
}
var WINDOW_RESIZE_EVENTS = ['resize', 'orientationchange'];
function bindResizeEvents(store) {
var handleResize = function handleResize() {
updateViewportWidth(store);
};
WINDOW_RESIZE_EVENTS.forEach(function (type) {
window.addEventListener(type, handleResize);
store.dispatch((0, _IX2EngineActions.eventListenerAdded)(window, [type, handleResize]));
});
handleResize();
}
function updateViewportWidth(store) {
var _store$getState7 = store.getState(),
ixSession = _store$getState7.ixSession,
ixData = _store$getState7.ixData;
var width = window.innerWidth;
if (width !== ixSession.viewportWidth) {
var mediaQueries = ixData.mediaQueries;
store.dispatch((0, _IX2EngineActions.viewportWidthChanged)({
width: width,
mediaQueries: mediaQueries
}));
}
}
var mapFoundValues = function mapFoundValues(object, iteratee) {
return (0, _omitBy["default"])((0, _mapValues["default"])(object, iteratee), _isEmpty["default"]);
};
var forEachEventTarget = function forEachEventTarget(eventTargets, eventCallback) {
(0, _forEach["default"])(eventTargets, function (elements, eventId) {
elements.forEach(function (element, index) {
var eventStateKey = eventId + COLON_DELIMITER + index;
eventCallback(element, eventId, eventStateKey);
});
});
};
var getAffectedForEvent = function getAffectedForEvent(event) {
var config = {
target: event.target,
targets: event.targets
};
return getAffectedElements({
config: config,
elementApi: elementApi
});
};
function bindEventType(_ref13) {
var logic = _ref13.logic,
store = _ref13.store,
events = _ref13.events;
injectBehaviorCSSFixes(events);
var eventTypes = logic.types,
eventHandler = logic.handler;
var _store$getState8 = store.getState(),
ixData = _store$getState8.ixData;
var actionLists = ixData.actionLists;
var eventTargets = mapFoundValues(events, getAffectedForEvent);
if (!(0, _size["default"])(eventTargets)) {
return;
}
(0, _forEach["default"])(eventTargets, function (elements, key) {
var event = events[key];
var eventAction = event.action,
eventId = event.id,
_event$mediaQueries = event.mediaQueries,
mediaQueries = _event$mediaQueries === void 0 ? ixData.mediaQueryKeys : _event$mediaQueries;
var actionListId = eventAction.config.actionListId;
if (!mediaQueriesEqual(mediaQueries, ixData.mediaQueryKeys)) {
store.dispatch((0, _IX2EngineActions.mediaQueriesDefined)());
}
if (eventAction.actionTypeId === _constants.ActionTypeConsts.GENERAL_CONTINUOUS_ACTION) {
var configs = Array.isArray(event.config) ? event.config : [event.config];
configs.forEach(function (eventConfig) {
var continuousParameterGroupId = eventConfig.continuousParameterGroupId;
var paramGroups = (0, _get["default"])(actionLists, "".concat(actionListId, ".continuousParameterGroups"), []);
var parameterGroup = (0, _find["default"])(paramGroups, function (_ref14) {
var id = _ref14.id;
return id === continuousParameterGroupId;
});
var smoothing = (eventConfig.smoothing || 0) / 100;
var restingValue = (eventConfig.restingState || 0) / 100;
if (!parameterGroup) {
return;
}
elements.forEach(function (eventTarget, index) {
var eventStateKey = eventId + COLON_DELIMITER + index;
createGroupInstances({
store: store,
eventStateKey: eventStateKey,
eventTarget: eventTarget,
eventId: eventId,
eventConfig: eventConfig,
actionListId: actionListId,
parameterGroup: parameterGroup,
smoothing: smoothing,
restingValue: restingValue
});
});
});
}
if (eventAction.actionTypeId === _constants.ActionTypeConsts.GENERAL_START_ACTION || isQuickEffect(eventAction.actionTypeId)) {
renderInitialGroup({
store: store,
actionListId: actionListId,
eventId: eventId
});
}
});
var handleEvent = function handleEvent(nativeEvent) {
var _store$getState9 = store.getState(),
ixSession = _store$getState9.ixSession;
forEachEventTarget(eventTargets, function (element, eventId, eventStateKey) {
var event = events[eventId];
var oldState = ixSession.eventState[eventStateKey];
var eventAction = event.action,
_event$mediaQueries2 = event.mediaQueries,
mediaQueries = _event$mediaQueries2 === void 0 ? ixData.mediaQueryKeys : _event$mediaQueries2; // Bypass event handler if current media query is not listed in event config
if (!shouldAllowMediaQuery(mediaQueries, ixSession.mediaQueryKey)) {
return;
}
var handleEventWithConfig = function handleEventWithConfig() {
var eventConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
var newState = eventHandler({
store: store,
element: element,
event: event,
eventConfig: eventConfig,
nativeEvent: nativeEvent,
eventStateKey: eventStateKey
}, oldState);
if (!shallowEqual(newState, oldState)) {
store.dispatch((0, _IX2EngineActions.eventStateChanged)(eventStateKey, newState));
}
};
if (eventAction.actionTypeId === _constants.ActionTypeConsts.GENERAL_CONTINUOUS_ACTION) {
var configs = Array.isArray(event.config) ? event.config : [event.config];
configs.forEach(handleEventWithConfig);
} else {
handleEventWithConfig();
}
});
};
var handleEventThrottled = (0, _throttle["default"])(handleEvent, THROTTLED_EVENT_WAIT);
var addListeners = function addListeners(_ref15) {
var _ref15$target = _ref15.target,
target = _ref15$target === void 0 ? document : _ref15$target,
types = _ref15.types,
shouldThrottle = _ref15.throttle;
types.split(' ').filter(Boolean).forEach(function (type) {
var handlerFunc = shouldThrottle ? handleEventThrottled : handleEvent; // $FlowFixMe
target.addEventListener(type, handlerFunc);
store.dispatch((0, _IX2EngineActions.eventListenerAdded)(target, [type, handlerFunc]));
});
};
if (Array.isArray(eventTypes)) {
eventTypes.forEach(addListeners);
} else if (typeof eventTypes === 'string') {
addListeners(logic);
}
}
function injectBehaviorCSSFixes(events) {
if (!IS_MOBILE_SAFARI) {
return;
}
var injectedSelectors = {};
var cssText = '';
for (var eventId in events) {
var _events$eventId = events[eventId],
eventTypeId = _events$eventId.eventTypeId,
target = _events$eventId.target;
var selector = elementApi.getQuerySelector(target); // $FlowFixMe
if (injectedSelectors[selector]) {
continue;
} // add a "cursor: pointer" style rule to ensure that CLICK events get fired for IOS devices
if (eventTypeId === _constants.EventTypeConsts.MOUSE_CLICK || eventTypeId === _constants.EventTypeConsts.MOUSE_SECOND_CLICK) {
injectedSelectors[selector] = true;
cssText += // $FlowFixMe
selector + '{' + 'cursor: pointer;' + 'touch-action: manipulation;' + '}';
}
}
if (cssText) {
var style = document.createElement('style');
style.textContent = cssText; // $FlowFixMe
document.body.appendChild(style);
}
}
function renderInitialGroup(_ref16) {
var store = _ref16.store,
actionListId = _ref16.actionListId,
eventId = _ref16.eventId;
var _store$getState10 = store.getState(),
ixData = _store$getState10.ixData,
ixSession = _store$getState10.ixSession;
var actionLists = ixData.actionLists,
events = ixData.events;
var event = events[eventId];
var actionList = actionLists[actionListId];
if (actionList && actionList.useFirstGroupAsInitialState) {
var initialStateItems = (0, _get["default"])(actionList, 'actionItemGroups[0].actionItems', []); // Bypass initial state render if current media query is not listed in event config
var mediaQueries = (0, _get["default"])(event, 'mediaQueries', ixData.mediaQueryKeys);
if (!shouldAllowMediaQuery(mediaQueries, ixSession.mediaQueryKey)) {
return;
}
initialStateItems.forEach(function (actionItem) {
var _itemConfig$target;
var itemConfig = actionItem.config,
actionTypeId = actionItem.actionTypeId;
var config = // When useEventTarget is explicitly true, use event target/targets to query elements
(itemConfig === null || itemConfig === void 0 ? void 0 : (_itemConfig$target = itemConfig.target) === null || _itemConfig$target === void 0 ? void 0 : _itemConfig$target.useEventTarget) === true ? {
target: event.target,
targets: event.targets
} : itemConfig;
var itemElements = getAffectedElements({
config: config,
event: event,
elementApi: elementApi
});
var shouldUsePlugin = isPluginType(actionTypeId);
itemElements.forEach(function (element) {
var pluginInstance = shouldUsePlugin ? // $FlowFixMe
createPluginInstance(actionTypeId)(element, actionItem) : null;
createInstance({
destination: getDestinationValues({
element: element,
actionItem: actionItem,
elementApi: elementApi
}, // $FlowFixMe
pluginInstance),
immediate: true,
store: store,
element: element,
eventId: eventId,
actionItem: actionItem,
actionListId: actionListId,
pluginInstance: pluginInstance
});
});
});
}
} // $FlowFixMe
function stopAllActionGroups(_ref17) {
var store = _ref17.store;
var _store$getState11 = store.getState(),
ixInstances = _store$getState11.ixInstances;
(0, _forEach["default"])(ixInstances, function (instance) {
if (!instance.continuous) {
var actionListId = instance.actionListId,
verbose = instance.verbose;
removeInstance(instance, store);
if (verbose) {
store.dispatch((0, _IX2EngineActions.actionListPlaybackChanged)({
actionListId: actionListId,
isPlaying: false
}));
}
}
});
} // $FlowFixMe
function stopActionGroup(_ref18) {
var store = _ref18.store,
eventId = _ref18.eventId,
eventTarget = _ref18.eventTarget,
eventStateKey = _ref18.eventStateKey,
actionListId = _ref18.actionListId;
var _store$getState12 = store.getState(),
ixInstances = _store$getState12.ixInstances,
ixSession = _store$getState12.ixSession; // Check for element boundary before stopping engine instances
var eventElementRoot = ixSession.hasBoundaryNodes && eventTarget ? elementApi.getClosestElement(eventTarget, BOUNDARY_SELECTOR) : null;
(0, _forEach["default"])(ixInstances, function (instance) {
var boundaryMode = (0, _get["default"])(instance, 'actionItem.config.target.boundaryMode'); // Validate event key if eventStateKey was provided, otherwise default to true
var validEventKey = eventStateKey ? instance.eventStateKey === eventStateKey : true; // Remove engine instances that match the required ids
if (instance.actionListId === actionListId && instance.eventId === eventId && validEventKey) {
if (eventElementRoot && boundaryMode && !elementApi.elementContains(eventElementRoot, instance.element)) {
return;
}
removeInstance(instance, store);
if (instance.verbose) {
store.dispatch((0, _IX2EngineActions.actionListPlaybackChanged)({
actionListId: actionListId,
isPlaying: false
}));
}
}
});
} // $FlowFixMe
function startActionGroup(_ref19) {
var store = _ref19.store,
eventId = _ref19.eventId,
eventTarget = _ref19.eventTarget,
eventStateKey = _ref19.eventStateKey,
actionListId = _ref19.actionListId,
_ref19$groupIndex = _ref19.groupIndex,
groupIndex = _ref19$groupIndex === void 0 ? 0 : _ref19$groupIndex,
immediate = _ref19.immediate,
verbose = _ref19.verbose;
var _event$action;
var _store$getState13 = store.getState(),
ixData = _store$getState13.ixData,
ixSession = _store$getState13.ixSession;
var events = ixData.events;
var event = events[eventId] || {};
var _event$mediaQueries3 = event.mediaQueries,
mediaQueries = _event$mediaQueries3 === void 0 ? ixData.mediaQueryKeys : _event$mediaQueries3;
var actionList = (0, _get["default"])(ixData, "actionLists.".concat(actionListId), {});
var actionItemGroups = actionList.actionItemGroups,
useFirstGroupAsInitialState = actionList.useFirstGroupAsInitialState; // Abort playback if no action groups
if (!actionItemGroups || !actionItemGroups.length) {
return false;
} // Reset to first group when event loop is configured
if (groupIndex >= actionItemGroups.length && (0, _get["default"])(event, 'config.loop')) {
groupIndex = 0;
} // Skip initial state group during action list playback, as it should already be applied
if (groupIndex === 0 && useFirstGroupAsInitialState) {
groupIndex++;
} // Identify first animated group and apply the initial QuickEffect delay
var isFirstGroup = groupIndex === 0 || groupIndex === 1 && useFirstGroupAsInitialState;
var instanceDelay = isFirstGroup && isQuickEffect((_event$action = event.action) === null || _event$action === void 0 ? void 0 : _event$action.actionTypeId) ? event.config.delay : undefined; // Abort playback if no action items exist at group index
var actionItems = (0, _get["default"])(actionItemGroups, [groupIndex, 'actionItems'], []);
if (!actionItems.length) {
return false;
} // Abort playback if current media query is not listed in event config
if (!shouldAllowMediaQuery(mediaQueries, ixSession.mediaQueryKey)) {
return false;
} // Limit affected elements when event target is within a boundary node
var eventElementRoot = ixSession.hasBoundaryNodes && eventTarget ? elementApi.getClosestElement(eventTarget, BOUNDARY_SELECTOR) : null;
var carrierIndex = getMaxDurationItemIndex(actionItems);
var groupStartResult = false;
actionItems.forEach(function (actionItem, actionIndex) {
var config = actionItem.config,
actionTypeId = actionItem.actionTypeId;
var shouldUsePlugin = isPluginType(actionTypeId);
var target = config.target;
if (!target) {
return;
}
var elementRoot = target.boundaryMode ? eventElementRoot : null;
var elements = getAffectedElements({
config: config,
event: event,
eventTarget: eventTarget,
elementRoot: elementRoot,
elementApi: elementApi
});
elements.forEach(function (element, elementIndex) {
var pluginInstance = shouldUsePlugin ? // $FlowFixMe
createPluginInstance(actionTypeId)(element, actionItem) : null;
var pluginDuration = shouldUsePlugin ? // $FlowFixMe
getPluginDuration(actionTypeId)(element, actionItem) : null;
groupStartResult = true;
var isCarrier = carrierIndex === actionIndex && elementIndex === 0;
var computedStyle = getComputedStyle({
element: element,
actionItem: actionItem
});
var destination = getDestinationValues({
element: element,
actionItem: actionItem,
elementApi: elementApi
}, // $FlowFixMe
pluginInstance);
createInstance({
store: store,
element: element,
actionItem: actionItem,
eventId: eventId,
eventTarget: eventTarget,
eventStateKey: eventStateKey,
actionListId: actionListId,
groupIndex: groupIndex,
isCarrier: isCarrier,
computedStyle: computedStyle,
destination: destination,
immediate: immediate,
verbose: verbose,
pluginInstance: pluginInstance,
pluginDuration: pluginDuration,
instanceDelay: instanceDelay
});
});
});
return groupStartResult;
}
function createInstance(options) {
var _ixData$events$eventI; // $FlowFixMe
var store = options.store,
computedStyle = options.computedStyle,
rest = (0, _objectWithoutPropertiesLoose2["default"])(options, ["store", "computedStyle"]);
var element = rest.element,
actionItem = rest.actionItem,
immediate = rest.immediate,
pluginInstance = rest.pluginInstance,
continuous = rest.continuous,
restingValue = rest.restingValue,
eventId = rest.eventId;
var autoStart = !continuous;
var instanceId = getInstanceId();
var _store$getState14 = store.getState(),
ixElements = _store$getState14.ixElements,
ixSession = _store$getState14.ixSession,
ixData = _store$getState14.ixData;
var elementId = getElementId(ixElements, element);
var _ref20 = ixElements[elementId] || {},
refState = _ref20.refState;
var refType = elementApi.getRefType(element);
var skipMotion = ixSession.reducedMotion && _constants.ReducedMotionTypes[actionItem.actionTypeId];
var skipToValue;
if (skipMotion && continuous) {
switch ((_ixData$events$eventI = ixData.events[eventId]) === null || _ixData$events$eventI === void 0 ? void 0 : _ixData$events$eventI.eventTypeId) {
case _constants.EventTypeConsts.MOUSE_MOVE:
case _constants.EventTypeConsts.MOUSE_MOVE_IN_VIEWPORT:
skipToValue = restingValue;
break;
default:
skipToValue = 0.5;
break;
}
}
var origin = getInstanceOrigin(element, refState, computedStyle, actionItem, elementApi, // $FlowFixMe
pluginInstance);
store.dispatch((0, _IX2EngineActions.instanceAdded)((0, _extends2["default"])({
instanceId: instanceId,
elementId: elementId,
origin: origin,
refType: refType,
skipMotion: skipMotion,
skipToValue: skipToValue
}, rest)));
dispatchCustomEvent(document.body, 'ix2-animation-started', instanceId);
if (immediate) {
renderImmediateInstance(store, instanceId);
return;
}
observeStore({
store: store,
select: function select(_ref21) {
var ixInstances = _ref21.ixInstances;
return ixInstances[instanceId];
},
onChange: handleInstanceChange
});
if (autoStart) {
store.dispatch((0, _IX2EngineActions.instanceStarted)(instanceId, ixSession.tick));
}
}
function removeInstance(instance, store) {
dispatchCustomEvent(document.body, 'ix2-animation-stopping', {
instanceId: instance.id,
state: store.getState()
});
var elementId = instance.elementId,
actionItem = instance.actionItem;
var _store$getState15 = store.getState(),
ixElements = _store$getState15.ixElements;
var _ref22 = ixElements[elementId] || {},
ref = _ref22.ref,
refType = _ref22.refType;
if (refType === HTML_ELEMENT) {
cleanupHTMLElement(ref, actionItem, elementApi);
}
store.dispatch((0, _IX2EngineActions.instanceRemoved)(instance.id));
}
function dispatchCustomEvent(element, eventName, detail) {
var event = document.createEvent('CustomEvent');
event.initCustomEvent(eventName, true, true, detail); // $FlowFixMe
element.dispatchEvent(event);
}
function renderImmediateInstance(store, instanceId) {
var _store$getState16 = store.getState(),
ixParameters = _store$getState16.ixParameters;
store.dispatch((0, _IX2EngineActions.instanceStarted)(instanceId, 0));
store.dispatch((0, _IX2EngineActions.animationFrameChanged)(performance.now(), ixParameters));
var _store$getState17 = store.getState(),
ixInstances = _store$getState17.ixInstances;
handleInstanceChange(ixInstances[instanceId], store);
}
function handleInstanceChange(instance, store) {
var active = instance.active,
continuous = instance.continuous,
complete = instance.complete,
elementId = instance.elementId,
actionItem = instance.actionItem,
actionTypeId = instance.actionTypeId,
renderType = instance.renderType,
current = instance.current,
groupIndex = instance.groupIndex,
eventId = instance.eventId,
eventTarget = instance.eventTarget,
eventStateKey = instance.eventStateKey,
actionListId = instance.actionListId,
isCarrier = instance.isCarrier,
styleProp = instance.styleProp,
verbose = instance.verbose,
pluginInstance = instance.pluginInstance; // Bypass render if current media query is not listed in event config
var _store$getState18 = store.getState(),
ixData = _store$getState18.ixData,
ixSession = _store$getState18.ixSession;
var events = ixData.events;
var event = events[eventId] || {};
var _event$mediaQueries4 = event.mediaQueries,
mediaQueries = _event$mediaQueries4 === void 0 ? ixData.mediaQueryKeys : _event$mediaQueries4;
if (!shouldAllowMediaQuery(mediaQueries, ixSession.mediaQueryKey)) {
return;
}
if (continuous || active || complete) {
if (current || renderType === RENDER_GENERAL && complete) {
store.dispatch((0, _IX2EngineActions.elementStateChanged)(elementId, actionTypeId, current, actionItem));
var _store$getState19 = store.getState(),
ixElements = _store$getState19.ixElements;
var _ref23 = ixElements[elementId] || {},
ref = _ref23.ref,
refType = _ref23.refType,
refState = _ref23.refState;
var actionState = refState && refState[actionTypeId]; // Choose render based on ref type
switch (refType) {
case HTML_ELEMENT:
{
renderHTMLElement(ref, refState, actionState, eventId, actionItem, styleProp, elementApi, renderType, pluginInstance);
break;
}
}
}
if (complete) {
if (isCarrier) {
var started = startActionGroup({
store: store,
eventId: eventId,
eventTarget: eventTarget,
eventStateKey: eventStateKey,
actionListId: actionListId,
groupIndex: groupIndex + 1,
verbose: verbose
});
if (verbose && !started) {
store.dispatch((0, _IX2EngineActions.actionListPlaybackChanged)({
actionListId: actionListId,
isPlaying: false
}));
}
}
removeInstance(instance, store);
}
}
}
/***/ }),
 (function(module, exports, __webpack_require__) {
var defineProperty = __webpack_require__(125);
function baseAssignValue(object, key, value) {
if (key == '__proto__' && defineProperty) {
defineProperty(object, key, {
'configurable': true,
'enumerable': true,
'value': value,
'writable': true
});
} else {
object[key] = value;
}
}
module.exports = baseAssignValue;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11);
var defineProperty = (function() {
try {
var func = getNative(Object, 'defineProperty');
func({}, '', {});
return func;
} catch (e) {}
}());
module.exports = defineProperty;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(8);
var objectCreate = Object.create;
var baseCreate = (function() {
function object() {}
return function(proto) {
if (!isObject(proto)) {
return {};
}
if (objectCreate) {
return objectCreate(proto);
}
object.prototype = proto;
var result = new object;
object.prototype = undefined;
return result;
};
}());
module.exports = baseCreate;
/***/ }),
 (function(module, exports, __webpack_require__) {
var metaMap = __webpack_require__(323),
noop = __webpack_require__(324);
var getData = !metaMap ? noop : function(func) {
return metaMap.get(func);
};
module.exports = getData;
/***/ }),
 (function(module, exports, __webpack_require__) {
var realNames = __webpack_require__(325);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function getFuncName(func) {
var result = (func.name + ''),
array = realNames[result],
length = hasOwnProperty.call(realNames, result) ? array.length : 0;
while (length--) {
var data = array[length],
otherFunc = data.func;
if (otherFunc == null || otherFunc == func) {
return data.name;
}
}
return result;
}
module.exports = getFuncName;
/***/ }),
 (function(module, exports, __webpack_require__) {
__webpack_require__(130);
__webpack_require__(132);
__webpack_require__(133);
__webpack_require__(134);
__webpack_require__(135);
__webpack_require__(25);
__webpack_require__(137);
__webpack_require__(332);
__webpack_require__(333);
__webpack_require__(334);
__webpack_require__(335);
__webpack_require__(336);
__webpack_require__(341);
module.exports = __webpack_require__(342);
/***/ }), (function(module, exports, __webpack_require__) {/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var $ = window.$;
var tram = __webpack_require__(69) && $.tram;
/*!
 * Webflow._ (aka) Underscore.js 1.6.0 (custom build)
 * _.each
 * _.map
 * _.find
 * _.filter
 * _.any
 * _.contains
 * _.delay
 * _.defer
 * _.throttle (webflow)
 * _.debounce
 * _.keys
 * _.has
 * _.now
 *
 * http://underscorejs.org
 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Underscore may be freely distributed under the MIT license.
 * @license MIT
 */
module.exports = function () {
var _ = {}; // Current version.
_.VERSION = '1.6.0-Webflow'; // Establish the object that gets returned to break out of a loop iteration.
var breaker = {}; // Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype,
ObjProto = Object.prototype,
FuncProto = Function.prototype;
var push = ArrayProto.push,
slice = ArrayProto.slice,
concat = ArrayProto.concat,
toString = ObjProto.toString,
hasOwnProperty = ObjProto.hasOwnProperty;
var nativeForEach = ArrayProto.forEach,
nativeMap = ArrayProto.map,
nativeReduce = ArrayProto.reduce,
nativeReduceRight = ArrayProto.reduceRight,
nativeFilter = ArrayProto.filter,
nativeEvery = ArrayProto.every,
nativeSome = ArrayProto.some,
nativeIndexOf = ArrayProto.indexOf,
nativeLastIndexOf = ArrayProto.lastIndexOf,
nativeIsArray = Array.isArray,
nativeKeys = Object.keys,
nativeBind = FuncProto.bind;
var each = _.each = _.forEach = function (obj, iterator, context) {
if (obj == null) return obj;
if (nativeForEach && obj.forEach === nativeForEach) {
obj.forEach(iterator, context); // eslint-disable-next-line no-implicit-coercion
} else if (obj.length === +obj.length) {
for (var i = 0, length = obj.length; i < length; i++) {
if (iterator.call(context, obj[i], i, obj) === breaker) return;
}
} else {
var keys = _.keys(obj); // eslint-disable-next-line no-redeclare
for (var i = 0, length = keys.length; i < length; i++) {
if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
}
}
return obj;
}; // Return the results of applying the iterator to each element.
_.map = _.collect = function (obj, iterator, context) {
var results = [];
if (obj == null) return results;
if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
each(obj, function (value, index, list) {
results.push(iterator.call(context, value, index, list));
});
return results;
}; // Return the first value which passes a truth test. Aliased as `detect`.
_.find = _.detect = function (obj, predicate, context) {
var result;
any(obj, function (value, index, list) {
if (predicate.call(context, value, index, list)) {
result = value;
return true;
}
});
return result;
}; // Return all the elements that pass a truth test.
_.filter = _.select = function (obj, predicate, context) {
var results = [];
if (obj == null) return results;
if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
each(obj, function (value, index, list) {
if (predicate.call(context, value, index, list)) results.push(value);
});
return results;
}; // Determine if at least one element in the object matches a truth test.
var any = _.some = _.any = function (obj, predicate, context) {
predicate || (predicate = _.identity);
var result = false;
if (obj == null) return result;
if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
each(obj, function (value, index, list) {
if (result || (result = predicate.call(context, value, index, list))) return breaker;
});
return !!result; // eslint-disable-line no-implicit-coercion
}; // Determine if the array or object contains a given value (using `===`).
_.contains = _.include = function (obj, target) {
if (obj == null) return false;
if (nativeIndexOf && obj.indexOf === nativeIndexOf) // eslint-disable-next-line eqeqeq
return obj.indexOf(target) != -1;
return any(obj, function (value) {
return value === target;
});
}; // Function (ahem) Functions
_.delay = function (func, wait) {
var args = slice.call(arguments, 2);
return setTimeout(function () {
return func.apply(null, args);
}, wait);
}; // Defers a function, scheduling it to run after the current call stack has
_.defer = function (func) {
return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
}; // Returns a function, that, when invoked, will only be triggered once every
_.throttle = function (func) {
var wait, args, context;
return function () {
if (wait) return;
wait = true;
args = arguments;
context = this;
tram.frame(function () {
wait = false;
func.apply(context, args);
});
};
}; // Returns a function, that, as long as it continues to be invoked, will not
_.debounce = function (func, wait, immediate) {
var timeout, args, context, timestamp, result;
var later = function later() {
var last = _.now() - timestamp;
if (last < wait) {
timeout = setTimeout(later, wait - last);
} else {
timeout = null;
if (!immediate) {
result = func.apply(context, args);
context = args = null;
}
}
};
return function () {
context = this;
args = arguments;
timestamp = _.now();
var callNow = immediate && !timeout;
if (!timeout) {
timeout = setTimeout(later, wait);
}
if (callNow) {
result = func.apply(context, args);
context = args = null;
}
return result;
};
}; // Object Functions
_.defaults = function (obj) {
if (!_.isObject(obj)) return obj;
for (var i = 1, length = arguments.length; i < length; i++) {
var source = arguments[i];
for (var prop in source) {
if (obj[prop] === void 0) obj[prop] = source[prop];
}
}
return obj;
}; // Retrieve the names of an object's properties.
_.keys = function (obj) {
if (!_.isObject(obj)) return [];
if (nativeKeys) return nativeKeys(obj);
var keys = [];
for (var key in obj) {
if (_.has(obj, key)) keys.push(key);
}
return keys;
}; // Shortcut function for checking if an object has a given property directly
_.has = function (obj, key) {
return hasOwnProperty.call(obj, key);
}; // Is a given variable an object?
_.isObject = function (obj) {
return obj === Object(obj);
}; // Utility Functions
_.now = Date.now || function () {
return new Date().getTime();
}; // By default, Underscore uses ERB-style template delimiters, change the
_.templateSettings = {
evaluate: /<%([\s\S]+?)%>/g,
interpolate: /<%=([\s\S]+?)%>/g,
escape: /<%-([\s\S]+?)%>/g
}; // When customizing `templateSettings`, if you don't want to define an
var noMatch = /(.)^/; // Certain characters need to be escaped so that they can be put into a
var escapes = {
"'": "'",
'\\': '\\',
'\r': 'r',
'\n': 'n',
"\u2028": 'u2028',
"\u2029": 'u2029'
};
var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
var escapeChar = function escapeChar(match) {
return '\\' + escapes[match];
}; // JavaScript micro-templating, similar to John Resig's implementation.
_.template = function (text, settings, oldSettings) {
if (!settings && oldSettings) settings = oldSettings;
settings = _.defaults({}, settings, _.templateSettings); // Combine delimiters into one regular expression via alternation.
var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g'); // Compile the template source, escaping string literals appropriately.
var index = 0;
var source = "__p+='";
text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
source += text.slice(index, offset).replace(escaper, escapeChar);
index = offset + match.length;
if (escape) {
source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
} else if (interpolate) {
source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
} else if (evaluate) {
source += "';\n" + evaluate + "\n__p+='";
} // Adobe VMs need the match returned to produce the correct offest.
return match;
});
source += "';\n"; // If a variable is not specified, place data values in local scope.
if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
try {
var render = new Function(settings.variable || 'obj', '_', source);
} catch (e) {
e.source = source;
throw e;
}
var template = function template(data) {
return render.call(this, data, _);
}; // Provide the compiled source as a convenience for precompilation.
var argument = settings.variable || 'obj';
template.source = 'function(' + argument + '){\n' + source + '}';
return template;
}; // Export underscore
return _;
}();
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
Webflow.define('edit', module.exports = function ($, _, options) {
options = options || {}; // Exit early in test env or when inside an iframe
if (Webflow.env('test') || Webflow.env('frame')) {
if (!options.fixture && !inCypress()) {
return {
exit: 1
};
}
}
var api = {};
var $win = $(window);
var $html = $(document.documentElement);
var location = document.location;
var hashchange = 'hashchange';
var loaded;
var loadEditor = options.load || load;
var hasLocalStorage = false;
try {
hasLocalStorage = localStorage && localStorage.getItem && localStorage.getItem('WebflowEditor');
} catch (e) {// SecurityError: browser storage has been disabled
}
if (hasLocalStorage) {
loadEditor();
} else if (location.search) {
if (/[?&](edit)(?:[=&?]|$)/.test(location.search) || /\?edit$/.test(location.href)) {
loadEditor();
}
} else {
$win.on(hashchange, checkHash).triggerHandler(hashchange);
}
function checkHash() {
if (loaded) {
return;
} // Load editor when hash contains `?edit`
if (/\?edit/.test(location.hash)) {
loadEditor();
}
}
function load() {
loaded = true; // Predefine global immediately to benefit Webflow.env
window.WebflowEditor = true;
$win.off(hashchange, checkHash);
checkThirdPartyCookieSupport(function (thirdPartyCookiesSupported) {
$.ajax({
url: cleanSlashes("https://editor-api.webflow.com" + '/api/editor/view'),
data: {
siteId: $html.attr('data-wf-site')
},
xhrFields: {
withCredentials: true
},
dataType: 'json',
crossDomain: true,
success: success(thirdPartyCookiesSupported)
});
});
}
function success(thirdPartyCookiesSupported) {
return function (data) {
if (!data) {
console.error('Could not load editor data');
return;
}
data.thirdPartyCookiesSupported = thirdPartyCookiesSupported;
getScript(prefix(data.bugReporterScriptPath), function () {
getScript(prefix(data.scriptPath), function () {
window.WebflowEditor(data);
});
});
};
}
function getScript(url, done) {
$.ajax({
type: 'GET',
url: url,
dataType: 'script',
cache: true
}).then(done, error);
}
function error(jqXHR, textStatus, errorThrown) {
console.error('Could not load editor script: ' + textStatus);
throw errorThrown;
}
function prefix(url) {
return url.indexOf('//') >= 0 ? url : cleanSlashes("https://editor-api.webflow.com" + url);
}
function cleanSlashes(url) {
return url.replace(/([^:])\/\//g, '$1/');
}
function checkThirdPartyCookieSupport(callback) {
var iframe = window.document.createElement('iframe');
iframe.src = "https://webflow.com" + '/site/third-party-cookie-check.html';
iframe.style.display = 'none';
iframe.sandbox = 'allow-scripts allow-same-origin';
var handleMessage = function handleMessage(event) {
if (event.data === 'WF_third_party_cookies_unsupported') {
cleanUpCookieCheckerIframe(iframe, handleMessage);
callback(false);
} else if (event.data === 'WF_third_party_cookies_supported') {
cleanUpCookieCheckerIframe(iframe, handleMessage);
callback(true);
}
};
iframe.onerror = function () {
cleanUpCookieCheckerIframe(iframe, handleMessage);
callback(false);
};
window.addEventListener('message', handleMessage, false);
window.document.body.appendChild(iframe);
}
function cleanUpCookieCheckerIframe(iframe, listener) {
window.removeEventListener('message', listener, false);
iframe.remove();
} // Export module
return api;
});
function inCypress() {
try {
return window.top.__Cypress__;
} catch (e) {
return false;
}
}
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
/*
 * This polyfill comes from https://github.com/WICG/focus-visible
 */
Webflow.define('focus-visible', module.exports = function () {
/**
* Applies the :focus-visible polyfill at the given scope.
* A scope in this case is either the top-level Document or a Shadow Root.
*
* @param {(Document|ShadowRoot)} scope
* @see https://github.com/WICG/focus-visible
*/
function applyFocusVisiblePolyfill(scope) {
var hadKeyboardEvent = true;
var hadFocusVisibleRecently = false;
var hadFocusVisibleRecentlyTimeout = null;
var inputTypesAllowlist = {
text: true,
search: true,
url: true,
tel: true,
email: true,
password: true,
number: true,
date: true,
month: true,
week: true,
time: true,
datetime: true,
'datetime-local': true
};
function isValidFocusTarget(el) {
if (el && el !== document && el.nodeName !== 'HTML' && el.nodeName !== 'BODY' && 'classList' in el && 'contains' in el.classList) {
return true;
}
return false;
}
function focusTriggersKeyboardModality(el) {
var type = el.type;
var tagName = el.tagName;
if (tagName === 'INPUT' && inputTypesAllowlist[type] && !el.readOnly) {
return true;
}
if (tagName === 'TEXTAREA' && !el.readOnly) {
return true;
}
if (el.isContentEditable) {
return true;
}
return false;
}
function addFocusVisibleAttribute(el) {
if (el.getAttribute('data-wf-focus-visible')) {
return;
}
el.setAttribute('data-wf-focus-visible', 'true');
}
function removeFocusVisibleAttribute(el) {
if (!el.getAttribute('data-wf-focus-visible')) {
return;
}
el.removeAttribute('data-wf-focus-visible');
}
/**
* If the most recent user interaction was via the keyboard;
* and the key press did not include a meta, alt/option, or control key;
* then the modality is keyboard. Otherwise, the modality is not keyboard.
* Apply `focus-visible` to any current active element and keep track
* of our keyboard modality state with `hadKeyboardEvent`.
* @param {KeyboardEvent} e
*/
function onKeyDown(e) {
if (e.metaKey || e.altKey || e.ctrlKey) {
return;
}
if (isValidFocusTarget(scope.activeElement)) {
addFocusVisibleAttribute(scope.activeElement);
}
hadKeyboardEvent = true;
}
function onPointerDown() {
hadKeyboardEvent = false;
}
function onFocus(e) {
if (!isValidFocusTarget(e.target)) {
return;
}
if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
addFocusVisibleAttribute(e.target);
}
}
function onBlur(e) {
if (!isValidFocusTarget(e.target)) {
return;
}
if (e.target.hasAttribute('data-wf-focus-visible')) {
hadFocusVisibleRecently = true;
window.clearTimeout(hadFocusVisibleRecentlyTimeout);
hadFocusVisibleRecentlyTimeout = window.setTimeout(function () {
hadFocusVisibleRecently = false;
}, 100);
removeFocusVisibleAttribute(e.target);
}
}
function onVisibilityChange() {
if (document.visibilityState === 'hidden') {
if (hadFocusVisibleRecently) {
hadKeyboardEvent = true;
}
addInitialPointerMoveListeners();
}
}
function addInitialPointerMoveListeners() {
document.addEventListener('mousemove', onInitialPointerMove);
document.addEventListener('mousedown', onInitialPointerMove);
document.addEventListener('mouseup', onInitialPointerMove);
document.addEventListener('pointermove', onInitialPointerMove);
document.addEventListener('pointerdown', onInitialPointerMove);
document.addEventListener('pointerup', onInitialPointerMove);
document.addEventListener('touchmove', onInitialPointerMove);
document.addEventListener('touchstart', onInitialPointerMove);
document.addEventListener('touchend', onInitialPointerMove);
}
function removeInitialPointerMoveListeners() {
document.removeEventListener('mousemove', onInitialPointerMove);
document.removeEventListener('mousedown', onInitialPointerMove);
document.removeEventListener('mouseup', onInitialPointerMove);
document.removeEventListener('pointermove', onInitialPointerMove);
document.removeEventListener('pointerdown', onInitialPointerMove);
document.removeEventListener('pointerup', onInitialPointerMove);
document.removeEventListener('touchmove', onInitialPointerMove);
document.removeEventListener('touchstart', onInitialPointerMove);
document.removeEventListener('touchend', onInitialPointerMove);
}
function onInitialPointerMove(e) {
if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
return;
}
hadKeyboardEvent = false;
removeInitialPointerMoveListeners();
} // For some kinds of state, we are interested in changes at the global scope
document.addEventListener('keydown', onKeyDown, true);
document.addEventListener('mousedown', onPointerDown, true);
document.addEventListener('pointerdown', onPointerDown, true);
document.addEventListener('touchstart', onPointerDown, true);
document.addEventListener('visibilitychange', onVisibilityChange, true);
addInitialPointerMoveListeners(); // For focus and blur, we specifically care about state changes in the local
scope.addEventListener('focus', onFocus, true);
scope.addEventListener('blur', onBlur, true);
}
function ready() {
if (typeof document !== 'undefined') {
try {
document.querySelector(':focus-visible');
} catch (e) {
applyFocusVisiblePolyfill(document);
}
}
} // Export module
return {
ready: ready
};
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3); // polyfill based off of https://github.com/matteobad/focus-within-polyfill
Webflow.define('focus-within', module.exports = function () {
function computeEventPath(node) {
var path = [node];
var parent = null;
while (parent = node.parentNode || node.host || node.defaultView) {
path.push(parent);
node = parent;
}
return path;
}
function addFocusWithinAttribute(el) {
if (typeof el.getAttribute !== 'function' || el.getAttribute('data-wf-focus-within')) {
return;
}
el.setAttribute('data-wf-focus-within', 'true');
}
function removeFocusWithinAttribute(el) {
if (typeof el.getAttribute !== 'function' || !el.getAttribute('data-wf-focus-within')) {
return;
}
el.removeAttribute('data-wf-focus-within');
}
function loadFocusWithinPolyfill() {
var handler = function handler(e) {
var running;
function action() {
running = false;
if ('blur' === e.type) {
Array.prototype.slice.call(computeEventPath(e.target)).forEach(removeFocusWithinAttribute);
}
if ('focus' === e.type) {
Array.prototype.slice.call(computeEventPath(e.target)).forEach(addFocusWithinAttribute);
}
}
if (!running) {
window.requestAnimationFrame(action);
running = true;
}
};
document.addEventListener('focus', handler, true);
document.addEventListener('blur', handler, true);
addFocusWithinAttribute(document.body);
return true;
}
function ready() {
if (typeof document !== 'undefined' && document.body.hasAttribute('data-wf-focus-within')) {
try {
document.querySelector(':focus-within');
} catch (e) {
loadFocusWithinPolyfill();
}
}
} // Export module
return {
ready: ready
};
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
/*
 * Safari has a weird bug where it doesn't support :focus for links with hrefs,
 * buttons, and input[type=button|submit], so we listen for mousedown events
 * instead and force the element to emit a focus event in those cases.
 * See these webkit bugs for reference:
 * https://bugs.webkit.org/show_bug.cgi?id=22261
 * https://bugs.webkit.org/show_bug.cgi?id=229895
 */
Webflow.define('focus', module.exports = function () {
var capturedEvents = [];
var capturing = false;
function captureEvent(e) {
if (capturing) {
e.preventDefault();
e.stopPropagation();
e.stopImmediatePropagation();
capturedEvents.unshift(e);
}
}
function isPolyfilledFocusEvent(e) {
var el = e.target;
var tag = el.tagName;
return /^a$/i.test(tag) && el.href != null || // (A)
/^(button|textarea)$/i.test(tag) && el.disabled !== true || // (B) (C)
/^input$/i.test(tag) && /^(button|reset|submit|radio|checkbox)$/i.test(el.type) && !el.disabled || // (D)
!/^(button|input|textarea|select|a)$/i.test(tag) && !Number.isNaN(Number.parseFloat(el.tabIndex)) || // (E)
/^audio$/i.test(tag) || // (F)
/^video$/i.test(tag) && el.controls === true // (G)
;
}
function handler(e) {
if (isPolyfilledFocusEvent(e)) {
capturing = true;
setTimeout(function () {
capturing = false; // trigger focus event
e.target.focus(); // re-dispatch captured mouse events in order
while (capturedEvents.length > 0) {
var event = capturedEvents.pop();
event.target.dispatchEvent(new MouseEvent(event.type, event));
}
}, 0);
}
}
function ready() {
if (typeof document !== 'undefined' && document.body.hasAttribute('data-wf-focus-within') && Webflow.env.safari) {
document.addEventListener('mousedown', handler, true);
document.addEventListener('mouseup', captureEvent, true);
document.addEventListener('click', captureEvent, true);
}
} // Export module
return {
ready: ready
};
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var $ = window.jQuery;
var api = {};
var eventQueue = [];
var namespace = '.w-ix';
var eventTriggers = {
reset: function reset(i, el) {
el.__wf_intro = null;
},
intro: function intro(i, el) {
if (el.__wf_intro) {
return;
}
el.__wf_intro = true;
$(el).triggerHandler(api.types.INTRO);
},
outro: function outro(i, el) {
if (!el.__wf_intro) {
return;
}
el.__wf_intro = null;
$(el).triggerHandler(api.types.OUTRO);
}
};
api.triggers = {};
api.types = {
INTRO: 'w-ix-intro' + namespace,
OUTRO: 'w-ix-outro' + namespace
}; // Trigger any events in queue + restore trigger methods
api.init = function () {
var count = eventQueue.length;
for (var i = 0; i < count; i++) {
var memo = eventQueue[i];
memo[0](0, memo[1]);
}
eventQueue = [];
$.extend(api.triggers, eventTriggers);
}; // Replace all triggers with async wrapper to queue events until init
api.async = function () {
for (var key in eventTriggers) {
var func = eventTriggers[key];
if (!eventTriggers.hasOwnProperty(key)) {
continue;
} // Replace trigger method with async wrapper
api.triggers[key] = function (i, el) {
eventQueue.push([func, el]);
};
}
}; // Default triggers to async queue
api.async();
module.exports = api;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
var ix2 = __webpack_require__(138);
ix2.setEnv(Webflow.env);
Webflow.define('ix2', module.exports = function () {
return ix2;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireWildcard = __webpack_require__(18);
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.setEnv = setEnv;
exports.init = init;
exports.destroy = destroy;
exports.actions = exports.store = void 0;
__webpack_require__(139);
var _redux = __webpack_require__(87);
var _IX2Reducer = _interopRequireDefault(__webpack_require__(186));
var _IX2VanillaEngine = __webpack_require__(123);
var actions = _interopRequireWildcard(__webpack_require__(65));
exports.actions = actions; // Array.includes needed for IE11 @packages/systems/ix2/shared/utils/quick-effects
var store = (0, _redux.createStore)(_IX2Reducer["default"]);
exports.store = store;
function setEnv(env) {
if (env()) {
(0, _IX2VanillaEngine.observeRequests)(store);
}
}
function init(rawData) {
destroy();
(0, _IX2VanillaEngine.startEngine)({
store: store,
rawData: rawData,
allowEvents: true
});
}
function destroy() {
(0, _IX2VanillaEngine.stopEngine)(store);
}
/***/ }),
 (function(module, exports, __webpack_require__) {
var parent = __webpack_require__(140);
module.exports = parent;
/***/ }),
 (function(module, exports, __webpack_require__) {
var parent = __webpack_require__(141);
module.exports = parent;
/***/ }),
 (function(module, exports, __webpack_require__) {
__webpack_require__(142);
var entryUnbind = __webpack_require__(174);
module.exports = entryUnbind('Array', 'includes');
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var $ = __webpack_require__(143);
var $includes = __webpack_require__(85).includes;
var addToUnscopables = __webpack_require__(169);
$({ target: 'Array', proto: true }, {
includes: function includes(el ) {
return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
}
});
addToUnscopables('includes');
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var getOwnPropertyDescriptor = __webpack_require__(70).f;
var createNonEnumerableProperty = __webpack_require__(43);
var redefine = __webpack_require__(157);
var setGlobal = __webpack_require__(42);
var copyConstructorProperties = __webpack_require__(161);
var isForced = __webpack_require__(168);
module.exports = function (options, source) {
var TARGET = options.target;
var GLOBAL = options.global;
var STATIC = options.stat;
var FORCED, target, key, targetProperty, sourceProperty, descriptor;
if (GLOBAL) {
target = global;
} else if (STATIC) {
target = global[TARGET] || setGlobal(TARGET, {});
} else {
target = (global[TARGET] || {}).prototype;
}
if (target) for (key in source) {
sourceProperty = source[key];
if (options.noTargetGet) {
descriptor = getOwnPropertyDescriptor(target, key);
targetProperty = descriptor && descriptor.value;
} else targetProperty = target[key];
FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
if (!FORCED && targetProperty !== undefined) {
if (typeof sourceProperty == typeof targetProperty) continue;
copyConstructorProperties(sourceProperty, targetProperty);
}
if (options.sham || (targetProperty && targetProperty.sham)) {
createNonEnumerableProperty(sourceProperty, 'sham', true);
}
redefine(target, key, sourceProperty, options);
}
};
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var $propertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
var descriptor = getOwnPropertyDescriptor(this, V);
return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var uncurryThis = __webpack_require__(5);
var fails = __webpack_require__(19);
var classof = __webpack_require__(146);
var Object = global.Object;
var split = uncurryThis(''.split);
module.exports = fails(function () {
return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
return classof(it) == 'String' ? split(it, '') : Object(it);
} : Object;
/***/ }),
 (function(module, exports, __webpack_require__) {
var uncurryThis = __webpack_require__(5);
var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);
module.exports = function (it) {
return stringSlice(toString(it), 8, -1);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var call = __webpack_require__(40);
var isObject = __webpack_require__(20);
var isSymbol = __webpack_require__(74);
var getMethod = __webpack_require__(151);
var ordinaryToPrimitive = __webpack_require__(154);
var wellKnownSymbol = __webpack_require__(77);
var TypeError = global.TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
module.exports = function (input, pref) {
if (!isObject(input) || isSymbol(input)) return input;
var exoticToPrim = getMethod(input, TO_PRIMITIVE);
var result;
if (exoticToPrim) {
if (pref === undefined) pref = 'default';
result = call(exoticToPrim, input, pref);
if (!isObject(result) || isSymbol(result)) return result;
throw TypeError("Can't convert object to primitive value");
}
if (pref === undefined) pref = 'number';
return ordinaryToPrimitive(input, pref);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var uncurryThis = __webpack_require__(5);
module.exports = uncurryThis({}.isPrototypeOf);
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var userAgent = __webpack_require__(150);
var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
match = v8.split('.');
version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}
if (!version && userAgent) {
match = userAgent.match(/Edge\/(\d+)/);
if (!match || match[1] >= 74) {
match = userAgent.match(/Chrome\/(\d+)/);
if (match) version = +match[1];
}
}
module.exports = version;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getBuiltIn = __webpack_require__(28);
module.exports = getBuiltIn('navigator', 'userAgent') || '';
/***/ }),
 (function(module, exports, __webpack_require__) {
var aCallable = __webpack_require__(152);
module.exports = function (V, P) {
var func = V[P];
return func == null ? undefined : aCallable(func);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var isCallable = __webpack_require__(7);
var tryToString = __webpack_require__(153);
var TypeError = global.TypeError;
module.exports = function (argument) {
if (isCallable(argument)) return argument;
throw TypeError(tryToString(argument) + ' is not a function');
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var String = global.String;
module.exports = function (argument) {
try {
return String(argument);
} catch (error) {
return 'Object';
}
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var call = __webpack_require__(40);
var isCallable = __webpack_require__(7);
var isObject = __webpack_require__(20);
var TypeError = global.TypeError;
module.exports = function (input, pref) {
var fn, val;
if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
throw TypeError("Can't convert object to primitive value");
};
/***/ }),
 (function(module, exports) {
module.exports = false;
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var requireObjectCoercible = __webpack_require__(72);
var Object = global.Object;
module.exports = function (argument) {
return Object(requireObjectCoercible(argument));
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var isCallable = __webpack_require__(7);
var hasOwn = __webpack_require__(9);
var createNonEnumerableProperty = __webpack_require__(43);
var setGlobal = __webpack_require__(42);
var inspectSource = __webpack_require__(82);
var InternalStateModule = __webpack_require__(158);
var CONFIGURABLE_FUNCTION_NAME = __webpack_require__(160).CONFIGURABLE;
var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');
(module.exports = function (O, key, value, options) {
var unsafe = options ? !!options.unsafe : false;
var simple = options ? !!options.enumerable : false;
var noTargetGet = options ? !!options.noTargetGet : false;
var name = options && options.name !== undefined ? options.name : key;
var state;
if (isCallable(value)) {
if (String(name).slice(0, 7) === 'Symbol(') {
name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
}
if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
createNonEnumerableProperty(value, 'name', name);
}
state = enforceInternalState(value);
if (!state.source) {
state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
}
}
if (O === global) {
if (simple) O[key] = value;
else setGlobal(key, value);
return;
} else if (!unsafe) {
delete O[key];
} else if (!noTargetGet && O[key]) {
simple = true;
}
if (simple) O[key] = value;
else createNonEnumerableProperty(O, key, value);
})(Function.prototype, 'toString', function toString() {
return isCallable(this) && getInternalState(this).source || inspectSource(this);
});
/***/ }),
 (function(module, exports, __webpack_require__) {
var NATIVE_WEAK_MAP = __webpack_require__(159);
var global = __webpack_require__(0);
var uncurryThis = __webpack_require__(5);
var isObject = __webpack_require__(20);
var createNonEnumerableProperty = __webpack_require__(43);
var hasOwn = __webpack_require__(9);
var shared = __webpack_require__(41);
var sharedKey = __webpack_require__(83);
var hiddenKeys = __webpack_require__(44);
var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;
var enforce = function (it) {
return has(it) ? get(it) : set(it, {});
};
var getterFor = function (TYPE) {
return function (it) {
var state;
if (!isObject(it) || (state = get(it)).type !== TYPE) {
throw TypeError('Incompatible receiver, ' + TYPE + ' required');
} return state;
};
};
if (NATIVE_WEAK_MAP || shared.state) {
var store = shared.state || (shared.state = new WeakMap());
var wmget = uncurryThis(store.get);
var wmhas = uncurryThis(store.has);
var wmset = uncurryThis(store.set);
set = function (it, metadata) {
if (wmhas(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
metadata.facade = it;
wmset(store, it, metadata);
return metadata;
};
get = function (it) {
return wmget(store, it) || {};
};
has = function (it) {
return wmhas(store, it);
};
} else {
var STATE = sharedKey('state');
hiddenKeys[STATE] = true;
set = function (it, metadata) {
if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
metadata.facade = it;
createNonEnumerableProperty(it, STATE, metadata);
return metadata;
};
get = function (it) {
return hasOwn(it, STATE) ? it[STATE] : {};
};
has = function (it) {
return hasOwn(it, STATE);
};
}
module.exports = {
set: set,
get: get,
has: has,
enforce: enforce,
getterFor: getterFor
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var isCallable = __webpack_require__(7);
var inspectSource = __webpack_require__(82);
var WeakMap = global.WeakMap;
module.exports = isCallable(WeakMap) && /native code/.test(inspectSource(WeakMap));
/***/ }),
 (function(module, exports, __webpack_require__) {
var DESCRIPTORS = __webpack_require__(13);
var hasOwn = __webpack_require__(9);
var FunctionPrototype = Function.prototype;
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn(FunctionPrototype, 'name');
var PROPER = EXISTS && (function something() {  }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));
module.exports = {
EXISTS: EXISTS,
PROPER: PROPER,
CONFIGURABLE: CONFIGURABLE
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var hasOwn = __webpack_require__(9);
var ownKeys = __webpack_require__(162);
var getOwnPropertyDescriptorModule = __webpack_require__(70);
var definePropertyModule = __webpack_require__(29);
module.exports = function (target, source) {
var keys = ownKeys(source);
var defineProperty = definePropertyModule.f;
var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
for (var i = 0; i < keys.length; i++) {
var key = keys[i];
if (!hasOwn(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
}
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var getBuiltIn = __webpack_require__(28);
var uncurryThis = __webpack_require__(5);
var getOwnPropertyNamesModule = __webpack_require__(163);
var getOwnPropertySymbolsModule = __webpack_require__(167);
var anObject = __webpack_require__(30);
var concat = uncurryThis([].concat);
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
var keys = getOwnPropertyNamesModule.f(anObject(it));
var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var internalObjectKeys = __webpack_require__(84);
var enumBugKeys = __webpack_require__(45);
var hiddenKeys = enumBugKeys.concat('length', 'prototype');
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
return internalObjectKeys(O, hiddenKeys);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var toIntegerOrInfinity = __webpack_require__(86);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
var integer = toIntegerOrInfinity(index);
return integer < 0 ? max(integer + length, 0) : min(integer, length);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var toLength = __webpack_require__(166);
module.exports = function (obj) {
return toLength(obj.length);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var toIntegerOrInfinity = __webpack_require__(86);
var min = Math.min;
module.exports = function (argument) {
return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};
/***/ }),
 (function(module, exports) {
exports.f = Object.getOwnPropertySymbols;
/***/ }),
 (function(module, exports, __webpack_require__) {
var fails = __webpack_require__(19);
var isCallable = __webpack_require__(7);
var replacement = /#|\.prototype\./;
var isForced = function (feature, detection) {
var value = data[normalize(feature)];
return value == POLYFILL ? true
: value == NATIVE ? false
: isCallable(detection) ? fails(detection)
: !!detection;
};
var normalize = isForced.normalize = function (string) {
return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
module.exports = isForced;
/***/ }),
 (function(module, exports, __webpack_require__) {
var wellKnownSymbol = __webpack_require__(77);
var create = __webpack_require__(170);
var definePropertyModule = __webpack_require__(29);
var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;
if (ArrayPrototype[UNSCOPABLES] == undefined) {
definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
configurable: true,
value: create(null)
});
}
module.exports = function (key) {
ArrayPrototype[UNSCOPABLES][key] = true;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var anObject = __webpack_require__(30);
var defineProperties = __webpack_require__(171);
var enumBugKeys = __webpack_require__(45);
var hiddenKeys = __webpack_require__(44);
var html = __webpack_require__(173);
var documentCreateElement = __webpack_require__(81);
var sharedKey = __webpack_require__(83);
var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');
var EmptyConstructor = function () {  };
var scriptTag = function (content) {
return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};
var NullProtoObjectViaActiveX = function (activeXDocument) {
activeXDocument.write(scriptTag(''));
activeXDocument.close();
var temp = activeXDocument.parentWindow.Object;
activeXDocument = null; // avoid memory leak
return temp;
};
var NullProtoObjectViaIFrame = function () {
var iframe = documentCreateElement('iframe');
var JS = 'java' + SCRIPT + ':';
var iframeDocument;
iframe.style.display = 'none';
html.appendChild(iframe);
iframe.src = String(JS);
iframeDocument = iframe.contentWindow.document;
iframeDocument.open();
iframeDocument.write(scriptTag('document.F=Object'));
iframeDocument.close();
return iframeDocument.F;
};
var activeXDocument;
var NullProtoObject = function () {
try {
activeXDocument = new ActiveXObject('htmlfile');
} catch (error) {  }
NullProtoObject = typeof document != 'undefined'
? document.domain && activeXDocument
? NullProtoObjectViaActiveX(activeXDocument) // old IE
: NullProtoObjectViaIFrame()
: NullProtoObjectViaActiveX(activeXDocument); // WSH
var length = enumBugKeys.length;
while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
return NullProtoObject();
};
hiddenKeys[IE_PROTO] = true;
module.exports = Object.create || function create(O, Properties) {
var result;
if (O !== null) {
EmptyConstructor[PROTOTYPE] = anObject(O);
result = new EmptyConstructor();
EmptyConstructor[PROTOTYPE] = null;
result[IE_PROTO] = O;
} else result = NullProtoObject();
return Properties === undefined ? result : defineProperties(result, Properties);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var DESCRIPTORS = __webpack_require__(13);
var definePropertyModule = __webpack_require__(29);
var anObject = __webpack_require__(30);
var toIndexedObject = __webpack_require__(27);
var objectKeys = __webpack_require__(172);
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
anObject(O);
var props = toIndexedObject(Properties);
var keys = objectKeys(Properties);
var length = keys.length;
var index = 0;
var key;
while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
return O;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var internalObjectKeys = __webpack_require__(84);
var enumBugKeys = __webpack_require__(45);
module.exports = Object.keys || function keys(O) {
return internalObjectKeys(O, enumBugKeys);
};
/***/ }),
 (function(module, exports, __webpack_require__) {
var getBuiltIn = __webpack_require__(28);
module.exports = getBuiltIn('document', 'documentElement');
/***/ }),
 (function(module, exports, __webpack_require__) {
var global = __webpack_require__(0);
var uncurryThis = __webpack_require__(5);
module.exports = function (CONSTRUCTOR, METHOD) {
return uncurryThis(global[CONSTRUCTOR].prototype[METHOD]);
};
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89);
 var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(178);
 var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(179);
var nullTag = '[object Null]',
undefinedTag = '[object Undefined]';
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;
function baseGetTag(value) {
if (value == null) {
return value === undefined ? undefinedTag : nullTag;
}
return (symToStringTag && symToStringTag in Object(value))
? Object(_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
: Object(_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}
 __webpack_exports__["default"] = (baseGetTag);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(177);
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();
 __webpack_exports__["default"] = (root);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
(function(global) {
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
 __webpack_exports__["default"] = (freeGlobal);
}.call(this, __webpack_require__(26)))
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;
function getRawTag(value) {
var isOwn = hasOwnProperty.call(value, symToStringTag),
tag = value[symToStringTag];
try {
value[symToStringTag] = undefined;
var unmasked = true;
} catch (e) {}
var result = nativeObjectToString.call(value);
if (unmasked) {
if (isOwn) {
value[symToStringTag] = tag;
} else {
delete value[symToStringTag];
}
}
return result;
}
 __webpack_exports__["default"] = (getRawTag);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
return nativeObjectToString.call(value);
}
 __webpack_exports__["default"] = (objectToString);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(181);
var getPrototype = Object(_overArg_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object.getPrototypeOf, Object);
 __webpack_exports__["default"] = (getPrototype);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
function overArg(func, transform) {
return function(arg) {
return func(transform(arg));
};
}
 __webpack_exports__["default"] = (overArg);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
function isObjectLike(value) {
return value != null && typeof value == 'object';
}
 __webpack_exports__["default"] = (isObjectLike);
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
(function(global, module) { var _ponyfill_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(185);
var root;
if (typeof self !== 'undefined') {
root = self;
} else if (typeof window !== 'undefined') {
root = window;
} else if (typeof global !== 'undefined') {
root = global;
} else if (true) {
root = module;
} else {}
var result = Object(_ponyfill_js__WEBPACK_IMPORTED_MODULE_0__["default"])(root);
 __webpack_exports__["default"] = (result);
}.call(this, __webpack_require__(26), __webpack_require__(184)(module)))
/***/ }),
 (function(module, exports) {
module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};
/***/ }),
 (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return symbolObservablePonyfill; });
function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;
	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}
	return result;
};
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = void 0;
var _redux = __webpack_require__(87);
var _IX2DataReducer = __webpack_require__(187);
var _IX2RequestReducer = __webpack_require__(193);
var _IX2SessionReducer = __webpack_require__(194);
var _shared = __webpack_require__(14);
var _IX2InstancesReducer = __webpack_require__(280);
var _IX2ParametersReducer = __webpack_require__(281);
var ixElements = _shared.IX2ElementsReducer.ixElements;
var _default = (0, _redux.combineReducers)({
ixData: _IX2DataReducer.ixData,
ixRequest: _IX2RequestReducer.ixRequest,
ixSession: _IX2SessionReducer.ixSession,
ixElements: ixElements,
ixInstances: _IX2InstancesReducer.ixInstances,
ixParameters: _IX2ParametersReducer.ixParameters
});
exports["default"] = _default;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ixData = void 0;
var _constants = __webpack_require__(4);
var IX2_RAW_DATA_IMPORTED = _constants.IX2EngineActionTypes.IX2_RAW_DATA_IMPORTED;
var ixData = function ixData() {
var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.freeze({});
var action = arguments.length > 1 ? arguments[1] : undefined;
switch (action.type) {
case IX2_RAW_DATA_IMPORTED:
{
return action.payload.ixData || Object.freeze({});
}
default:
{
return state;
}
}
};
exports.ixData = ixData;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.QuickEffectDirectionConsts = exports.QuickEffectIds = exports.EventLimitAffectedElements = exports.EventContinuousMouseAxes = exports.EventBasedOn = exports.EventAppliesTo = exports.EventTypeConsts = void 0;
var EventTypeConsts = {
NAVBAR_OPEN: 'NAVBAR_OPEN',
NAVBAR_CLOSE: 'NAVBAR_CLOSE',
TAB_ACTIVE: 'TAB_ACTIVE',
TAB_INACTIVE: 'TAB_INACTIVE',
SLIDER_ACTIVE: 'SLIDER_ACTIVE',
SLIDER_INACTIVE: 'SLIDER_INACTIVE',
DROPDOWN_OPEN: 'DROPDOWN_OPEN',
DROPDOWN_CLOSE: 'DROPDOWN_CLOSE',
MOUSE_CLICK: 'MOUSE_CLICK',
MOUSE_SECOND_CLICK: 'MOUSE_SECOND_CLICK',
MOUSE_DOWN: 'MOUSE_DOWN',
MOUSE_UP: 'MOUSE_UP',
MOUSE_OVER: 'MOUSE_OVER',
MOUSE_OUT: 'MOUSE_OUT',
MOUSE_MOVE: 'MOUSE_MOVE',
MOUSE_MOVE_IN_VIEWPORT: 'MOUSE_MOVE_IN_VIEWPORT',
SCROLL_INTO_VIEW: 'SCROLL_INTO_VIEW',
SCROLL_OUT_OF_VIEW: 'SCROLL_OUT_OF_VIEW',
SCROLLING_IN_VIEW: 'SCROLLING_IN_VIEW',
ECOMMERCE_CART_OPEN: 'ECOMMERCE_CART_OPEN',
ECOMMERCE_CART_CLOSE: 'ECOMMERCE_CART_CLOSE',
PAGE_START: 'PAGE_START',
PAGE_FINISH: 'PAGE_FINISH',
PAGE_SCROLL_UP: 'PAGE_SCROLL_UP',
PAGE_SCROLL_DOWN: 'PAGE_SCROLL_DOWN',
PAGE_SCROLL: 'PAGE_SCROLL'
};
exports.EventTypeConsts = EventTypeConsts;
var EventAppliesTo = {
ELEMENT: 'ELEMENT',
CLASS: 'CLASS',
PAGE: 'PAGE'
};
exports.EventAppliesTo = EventAppliesTo;
var EventBasedOn = {
ELEMENT: 'ELEMENT',
VIEWPORT: 'VIEWPORT'
};
exports.EventBasedOn = EventBasedOn;
var EventContinuousMouseAxes = {
X_AXIS: 'X_AXIS',
Y_AXIS: 'Y_AXIS'
};
exports.EventContinuousMouseAxes = EventContinuousMouseAxes;
var EventLimitAffectedElements = {
CHILDREN: 'CHILDREN',
SIBLINGS: 'SIBLINGS',
IMMEDIATE_CHILDREN: 'IMMEDIATE_CHILDREN'
};
exports.EventLimitAffectedElements = EventLimitAffectedElements;
var QuickEffectIds = {
FADE_EFFECT: 'FADE_EFFECT',
SLIDE_EFFECT: 'SLIDE_EFFECT',
GROW_EFFECT: 'GROW_EFFECT',
SHRINK_EFFECT: 'SHRINK_EFFECT',
SPIN_EFFECT: 'SPIN_EFFECT',
FLY_EFFECT: 'FLY_EFFECT',
POP_EFFECT: 'POP_EFFECT',
FLIP_EFFECT: 'FLIP_EFFECT',
JIGGLE_EFFECT: 'JIGGLE_EFFECT',
PULSE_EFFECT: 'PULSE_EFFECT',
DROP_EFFECT: 'DROP_EFFECT',
BLINK_EFFECT: 'BLINK_EFFECT',
BOUNCE_EFFECT: 'BOUNCE_EFFECT',
FLIP_LEFT_TO_RIGHT_EFFECT: 'FLIP_LEFT_TO_RIGHT_EFFECT',
FLIP_RIGHT_TO_LEFT_EFFECT: 'FLIP_RIGHT_TO_LEFT_EFFECT',
RUBBER_BAND_EFFECT: 'RUBBER_BAND_EFFECT',
JELLO_EFFECT: 'JELLO_EFFECT',
GROW_BIG_EFFECT: 'GROW_BIG_EFFECT',
SHRINK_BIG_EFFECT: 'SHRINK_BIG_EFFECT',
PLUGIN_LOTTIE_EFFECT: 'PLUGIN_LOTTIE_EFFECT'
};
exports.QuickEffectIds = QuickEffectIds;
var QuickEffectDirectionConsts = {
LEFT: 'LEFT',
RIGHT: 'RIGHT',
BOTTOM: 'BOTTOM',
TOP: 'TOP',
BOTTOM_LEFT: 'BOTTOM_LEFT',
BOTTOM_RIGHT: 'BOTTOM_RIGHT',
TOP_RIGHT: 'TOP_RIGHT',
TOP_LEFT: 'TOP_LEFT',
CLOCKWISE: 'CLOCKWISE',
COUNTER_CLOCKWISE: 'COUNTER_CLOCKWISE'
};
exports.QuickEffectDirectionConsts = QuickEffectDirectionConsts;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.InteractionTypeConsts = void 0;
var InteractionTypeConsts = {
MOUSE_CLICK_INTERACTION: 'MOUSE_CLICK_INTERACTION',
MOUSE_HOVER_INTERACTION: 'MOUSE_HOVER_INTERACTION',
MOUSE_MOVE_INTERACTION: 'MOUSE_MOVE_INTERACTION',
SCROLL_INTO_VIEW_INTERACTION: 'SCROLL_INTO_VIEW_INTERACTION',
SCROLLING_IN_VIEW_INTERACTION: 'SCROLLING_IN_VIEW_INTERACTION',
MOUSE_MOVE_IN_VIEWPORT_INTERACTION: 'MOUSE_MOVE_IN_VIEWPORT_INTERACTION',
PAGE_IS_SCROLLING_INTERACTION: 'PAGE_IS_SCROLLING_INTERACTION',
PAGE_LOAD_INTERACTION: 'PAGE_LOAD_INTERACTION',
PAGE_SCROLLED_INTERACTION: 'PAGE_SCROLLED_INTERACTION',
NAVBAR_INTERACTION: 'NAVBAR_INTERACTION',
DROPDOWN_INTERACTION: 'DROPDOWN_INTERACTION',
ECOMMERCE_CART_INTERACTION: 'ECOMMERCE_CART_INTERACTION',
TAB_INTERACTION: 'TAB_INTERACTION',
SLIDER_INTERACTION: 'SLIDER_INTERACTION'
};
exports.InteractionTypeConsts = InteractionTypeConsts;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
var _defineProperty2 = _interopRequireDefault(__webpack_require__(21));
var _ReducedMotionTypes;
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ReducedMotionTypes = void 0;
var _animationActions = __webpack_require__(94);
var _animationActions$Act = _animationActions.ActionTypeConsts,
TRANSFORM_MOVE = _animationActions$Act.TRANSFORM_MOVE,
TRANSFORM_SCALE = _animationActions$Act.TRANSFORM_SCALE,
TRANSFORM_ROTATE = _animationActions$Act.TRANSFORM_ROTATE,
TRANSFORM_SKEW = _animationActions$Act.TRANSFORM_SKEW,
STYLE_SIZE = _animationActions$Act.STYLE_SIZE,
STYLE_FILTER = _animationActions$Act.STYLE_FILTER;
var ReducedMotionTypes = (_ReducedMotionTypes = {}, (0, _defineProperty2["default"])(_ReducedMotionTypes, TRANSFORM_MOVE, true), (0, _defineProperty2["default"])(_ReducedMotionTypes, TRANSFORM_SCALE, true), (0, _defineProperty2["default"])(_ReducedMotionTypes, TRANSFORM_ROTATE, true), (0, _defineProperty2["default"])(_ReducedMotionTypes, TRANSFORM_SKEW, true), (0, _defineProperty2["default"])(_ReducedMotionTypes, STYLE_SIZE, true), (0, _defineProperty2["default"])(_ReducedMotionTypes, STYLE_FILTER, true), _ReducedMotionTypes);
exports.ReducedMotionTypes = ReducedMotionTypes;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.IX2_TEST_FRAME_RENDERED = exports.IX2_MEDIA_QUERIES_DEFINED = exports.IX2_VIEWPORT_WIDTH_CHANGED = exports.IX2_ACTION_LIST_PLAYBACK_CHANGED = exports.IX2_ELEMENT_STATE_CHANGED = exports.IX2_INSTANCE_REMOVED = exports.IX2_INSTANCE_STARTED = exports.IX2_INSTANCE_ADDED = exports.IX2_PARAMETER_CHANGED = exports.IX2_ANIMATION_FRAME_CHANGED = exports.IX2_EVENT_STATE_CHANGED = exports.IX2_EVENT_LISTENER_ADDED = exports.IX2_CLEAR_REQUESTED = exports.IX2_STOP_REQUESTED = exports.IX2_PLAYBACK_REQUESTED = exports.IX2_PREVIEW_REQUESTED = exports.IX2_SESSION_STOPPED = exports.IX2_SESSION_STARTED = exports.IX2_SESSION_INITIALIZED = exports.IX2_RAW_DATA_IMPORTED = void 0;
var IX2_RAW_DATA_IMPORTED = 'IX2_RAW_DATA_IMPORTED';
exports.IX2_RAW_DATA_IMPORTED = IX2_RAW_DATA_IMPORTED;
var IX2_SESSION_INITIALIZED = 'IX2_SESSION_INITIALIZED';
exports.IX2_SESSION_INITIALIZED = IX2_SESSION_INITIALIZED;
var IX2_SESSION_STARTED = 'IX2_SESSION_STARTED';
exports.IX2_SESSION_STARTED = IX2_SESSION_STARTED;
var IX2_SESSION_STOPPED = 'IX2_SESSION_STOPPED';
exports.IX2_SESSION_STOPPED = IX2_SESSION_STOPPED;
var IX2_PREVIEW_REQUESTED = 'IX2_PREVIEW_REQUESTED';
exports.IX2_PREVIEW_REQUESTED = IX2_PREVIEW_REQUESTED;
var IX2_PLAYBACK_REQUESTED = 'IX2_PLAYBACK_REQUESTED';
exports.IX2_PLAYBACK_REQUESTED = IX2_PLAYBACK_REQUESTED;
var IX2_STOP_REQUESTED = 'IX2_STOP_REQUESTED';
exports.IX2_STOP_REQUESTED = IX2_STOP_REQUESTED;
var IX2_CLEAR_REQUESTED = 'IX2_CLEAR_REQUESTED';
exports.IX2_CLEAR_REQUESTED = IX2_CLEAR_REQUESTED;
var IX2_EVENT_LISTENER_ADDED = 'IX2_EVENT_LISTENER_ADDED';
exports.IX2_EVENT_LISTENER_ADDED = IX2_EVENT_LISTENER_ADDED;
var IX2_EVENT_STATE_CHANGED = 'IX2_EVENT_STATE_CHANGED';
exports.IX2_EVENT_STATE_CHANGED = IX2_EVENT_STATE_CHANGED;
var IX2_ANIMATION_FRAME_CHANGED = 'IX2_ANIMATION_FRAME_CHANGED';
exports.IX2_ANIMATION_FRAME_CHANGED = IX2_ANIMATION_FRAME_CHANGED;
var IX2_PARAMETER_CHANGED = 'IX2_PARAMETER_CHANGED';
exports.IX2_PARAMETER_CHANGED = IX2_PARAMETER_CHANGED;
var IX2_INSTANCE_ADDED = 'IX2_INSTANCE_ADDED';
exports.IX2_INSTANCE_ADDED = IX2_INSTANCE_ADDED;
var IX2_INSTANCE_STARTED = 'IX2_INSTANCE_STARTED';
exports.IX2_INSTANCE_STARTED = IX2_INSTANCE_STARTED;
var IX2_INSTANCE_REMOVED = 'IX2_INSTANCE_REMOVED';
exports.IX2_INSTANCE_REMOVED = IX2_INSTANCE_REMOVED;
var IX2_ELEMENT_STATE_CHANGED = 'IX2_ELEMENT_STATE_CHANGED';
exports.IX2_ELEMENT_STATE_CHANGED = IX2_ELEMENT_STATE_CHANGED;
var IX2_ACTION_LIST_PLAYBACK_CHANGED = 'IX2_ACTION_LIST_PLAYBACK_CHANGED';
exports.IX2_ACTION_LIST_PLAYBACK_CHANGED = IX2_ACTION_LIST_PLAYBACK_CHANGED;
var IX2_VIEWPORT_WIDTH_CHANGED = 'IX2_VIEWPORT_WIDTH_CHANGED';
exports.IX2_VIEWPORT_WIDTH_CHANGED = IX2_VIEWPORT_WIDTH_CHANGED;
var IX2_MEDIA_QUERIES_DEFINED = 'IX2_MEDIA_QUERIES_DEFINED';
exports.IX2_MEDIA_QUERIES_DEFINED = IX2_MEDIA_QUERIES_DEFINED;
var IX2_TEST_FRAME_RENDERED = 'IX2_TEST_FRAME_RENDERED';
exports.IX2_TEST_FRAME_RENDERED = IX2_TEST_FRAME_RENDERED;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.RENDER_PLUGIN = exports.RENDER_STYLE = exports.RENDER_GENERAL = exports.RENDER_TRANSFORM = exports.ABSTRACT_NODE = exports.PLAIN_OBJECT = exports.HTML_ELEMENT = exports.PRESERVE_3D = exports.PARENT = exports.SIBLINGS = exports.IMMEDIATE_CHILDREN = exports.CHILDREN = exports.BAR_DELIMITER = exports.COLON_DELIMITER = exports.COMMA_DELIMITER = exports.AUTO = exports.WILL_CHANGE = exports.FLEX = exports.DISPLAY = exports.COLOR = exports.BORDER_COLOR = exports.BACKGROUND = exports.BACKGROUND_COLOR = exports.HEIGHT = exports.WIDTH = exports.FILTER = exports.OPACITY = exports.SKEW_Y = exports.SKEW_X = exports.SKEW = exports.ROTATE_Z = exports.ROTATE_Y = exports.ROTATE_X = exports.SCALE_3D = exports.SCALE_Z = exports.SCALE_Y = exports.SCALE_X = exports.TRANSLATE_3D = exports.TRANSLATE_Z = exports.TRANSLATE_Y = exports.TRANSLATE_X = exports.TRANSFORM = exports.CONFIG_UNIT = exports.CONFIG_Z_UNIT = exports.CONFIG_Y_UNIT = exports.CONFIG_X_UNIT = exports.CONFIG_VALUE = exports.CONFIG_Z_VALUE = exports.CONFIG_Y_VALUE = exports.CONFIG_X_VALUE = exports.BOUNDARY_SELECTOR = exports.W_MOD_IX = exports.W_MOD_JS = exports.WF_PAGE = exports.IX2_ID_DELIMITER = void 0;
var IX2_ID_DELIMITER = '|';
exports.IX2_ID_DELIMITER = IX2_ID_DELIMITER;
var WF_PAGE = 'data-wf-page';
exports.WF_PAGE = WF_PAGE;
var W_MOD_JS = 'w-mod-js';
exports.W_MOD_JS = W_MOD_JS;
var W_MOD_IX = 'w-mod-ix';
exports.W_MOD_IX = W_MOD_IX;
var BOUNDARY_SELECTOR = '.w-dyn-item';
exports.BOUNDARY_SELECTOR = BOUNDARY_SELECTOR;
var CONFIG_X_VALUE = 'xValue';
exports.CONFIG_X_VALUE = CONFIG_X_VALUE;
var CONFIG_Y_VALUE = 'yValue';
exports.CONFIG_Y_VALUE = CONFIG_Y_VALUE;
var CONFIG_Z_VALUE = 'zValue';
exports.CONFIG_Z_VALUE = CONFIG_Z_VALUE;
var CONFIG_VALUE = 'value';
exports.CONFIG_VALUE = CONFIG_VALUE;
var CONFIG_X_UNIT = 'xUnit';
exports.CONFIG_X_UNIT = CONFIG_X_UNIT;
var CONFIG_Y_UNIT = 'yUnit';
exports.CONFIG_Y_UNIT = CONFIG_Y_UNIT;
var CONFIG_Z_UNIT = 'zUnit';
exports.CONFIG_Z_UNIT = CONFIG_Z_UNIT;
var CONFIG_UNIT = 'unit';
exports.CONFIG_UNIT = CONFIG_UNIT;
var TRANSFORM = 'transform';
exports.TRANSFORM = TRANSFORM;
var TRANSLATE_X = 'translateX';
exports.TRANSLATE_X = TRANSLATE_X;
var TRANSLATE_Y = 'translateY';
exports.TRANSLATE_Y = TRANSLATE_Y;
var TRANSLATE_Z = 'translateZ';
exports.TRANSLATE_Z = TRANSLATE_Z;
var TRANSLATE_3D = 'translate3d';
exports.TRANSLATE_3D = TRANSLATE_3D;
var SCALE_X = 'scaleX';
exports.SCALE_X = SCALE_X;
var SCALE_Y = 'scaleY';
exports.SCALE_Y = SCALE_Y;
var SCALE_Z = 'scaleZ';
exports.SCALE_Z = SCALE_Z;
var SCALE_3D = 'scale3d';
exports.SCALE_3D = SCALE_3D;
var ROTATE_X = 'rotateX';
exports.ROTATE_X = ROTATE_X;
var ROTATE_Y = 'rotateY';
exports.ROTATE_Y = ROTATE_Y;
var ROTATE_Z = 'rotateZ';
exports.ROTATE_Z = ROTATE_Z;
var SKEW = 'skew';
exports.SKEW = SKEW;
var SKEW_X = 'skewX';
exports.SKEW_X = SKEW_X;
var SKEW_Y = 'skewY';
exports.SKEW_Y = SKEW_Y;
var OPACITY = 'opacity';
exports.OPACITY = OPACITY;
var FILTER = 'filter';
exports.FILTER = FILTER;
var WIDTH = 'width';
exports.WIDTH = WIDTH;
var HEIGHT = 'height';
exports.HEIGHT = HEIGHT;
var BACKGROUND_COLOR = 'backgroundColor';
exports.BACKGROUND_COLOR = BACKGROUND_COLOR;
var BACKGROUND = 'background';
exports.BACKGROUND = BACKGROUND;
var BORDER_COLOR = 'borderColor';
exports.BORDER_COLOR = BORDER_COLOR;
var COLOR = 'color';
exports.COLOR = COLOR;
var DISPLAY = 'display';
exports.DISPLAY = DISPLAY;
var FLEX = 'flex';
exports.FLEX = FLEX;
var WILL_CHANGE = 'willChange';
exports.WILL_CHANGE = WILL_CHANGE;
var AUTO = 'AUTO';
exports.AUTO = AUTO;
var COMMA_DELIMITER = ',';
exports.COMMA_DELIMITER = COMMA_DELIMITER;
var COLON_DELIMITER = ':';
exports.COLON_DELIMITER = COLON_DELIMITER;
var BAR_DELIMITER = '|';
exports.BAR_DELIMITER = BAR_DELIMITER;
var CHILDREN = 'CHILDREN';
exports.CHILDREN = CHILDREN;
var IMMEDIATE_CHILDREN = 'IMMEDIATE_CHILDREN';
exports.IMMEDIATE_CHILDREN = IMMEDIATE_CHILDREN;
var SIBLINGS = 'SIBLINGS';
exports.SIBLINGS = SIBLINGS;
var PARENT = 'PARENT';
exports.PARENT = PARENT;
var PRESERVE_3D = 'preserve-3d';
exports.PRESERVE_3D = PRESERVE_3D;
var HTML_ELEMENT = 'HTML_ELEMENT';
exports.HTML_ELEMENT = HTML_ELEMENT;
var PLAIN_OBJECT = 'PLAIN_OBJECT';
exports.PLAIN_OBJECT = PLAIN_OBJECT;
var ABSTRACT_NODE = 'ABSTRACT_NODE';
exports.ABSTRACT_NODE = ABSTRACT_NODE;
var RENDER_TRANSFORM = 'RENDER_TRANSFORM';
exports.RENDER_TRANSFORM = RENDER_TRANSFORM;
var RENDER_GENERAL = 'RENDER_GENERAL';
exports.RENDER_GENERAL = RENDER_GENERAL;
var RENDER_STYLE = 'RENDER_STYLE';
exports.RENDER_STYLE = RENDER_STYLE;
var RENDER_PLUGIN = 'RENDER_PLUGIN';
exports.RENDER_PLUGIN = RENDER_PLUGIN;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault2 = __webpack_require__(1);
var _defineProperty2 = _interopRequireDefault2(__webpack_require__(21));
var _Object$create;
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ixRequest = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(31));
var _constants = __webpack_require__(4);
var _timm = __webpack_require__(22);
var _constants$IX2EngineA = _constants.IX2EngineActionTypes,
IX2_PREVIEW_REQUESTED = _constants$IX2EngineA.IX2_PREVIEW_REQUESTED,
IX2_PLAYBACK_REQUESTED = _constants$IX2EngineA.IX2_PLAYBACK_REQUESTED,
IX2_STOP_REQUESTED = _constants$IX2EngineA.IX2_STOP_REQUESTED,
IX2_CLEAR_REQUESTED = _constants$IX2EngineA.IX2_CLEAR_REQUESTED;
var initialState = {
preview: {},
playback: {},
stop: {},
clear: {}
};
var stateKeys = Object.create(null, (_Object$create = {}, (0, _defineProperty2["default"])(_Object$create, IX2_PREVIEW_REQUESTED, {
value: 'preview'
}), (0, _defineProperty2["default"])(_Object$create, IX2_PLAYBACK_REQUESTED, {
value: 'playback'
}), (0, _defineProperty2["default"])(_Object$create, IX2_STOP_REQUESTED, {
value: 'stop'
}), (0, _defineProperty2["default"])(_Object$create, IX2_CLEAR_REQUESTED, {
value: 'clear'
}), _Object$create));
var ixRequest = function ixRequest() {
var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
var action = arguments.length > 1 ? arguments[1] : undefined;
if (action.type in stateKeys) {
var key = [stateKeys[action.type]];
return (0, _timm.setIn)(state, [key], (0, _extends2["default"])({}, action.payload));
}
return state;
};
exports.ixRequest = ixRequest;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ixSession = void 0;
var _constants = __webpack_require__(4);
var _timm = __webpack_require__(22);
var _constants$IX2EngineA = _constants.IX2EngineActionTypes,
IX2_SESSION_INITIALIZED = _constants$IX2EngineA.IX2_SESSION_INITIALIZED,
IX2_SESSION_STARTED = _constants$IX2EngineA.IX2_SESSION_STARTED,
IX2_TEST_FRAME_RENDERED = _constants$IX2EngineA.IX2_TEST_FRAME_RENDERED,
IX2_SESSION_STOPPED = _constants$IX2EngineA.IX2_SESSION_STOPPED,
IX2_EVENT_LISTENER_ADDED = _constants$IX2EngineA.IX2_EVENT_LISTENER_ADDED,
IX2_EVENT_STATE_CHANGED = _constants$IX2EngineA.IX2_EVENT_STATE_CHANGED,
IX2_ANIMATION_FRAME_CHANGED = _constants$IX2EngineA.IX2_ANIMATION_FRAME_CHANGED,
IX2_ACTION_LIST_PLAYBACK_CHANGED = _constants$IX2EngineA.IX2_ACTION_LIST_PLAYBACK_CHANGED,
IX2_VIEWPORT_WIDTH_CHANGED = _constants$IX2EngineA.IX2_VIEWPORT_WIDTH_CHANGED,
IX2_MEDIA_QUERIES_DEFINED = _constants$IX2EngineA.IX2_MEDIA_QUERIES_DEFINED;
var initialState = {
active: false,
tick: 0,
eventListeners: [],
eventState: {},
playbackState: {},
viewportWidth: 0,
mediaQueryKey: null,
hasBoundaryNodes: false,
hasDefinedMediaQueries: false,
reducedMotion: false
};
var TEST_FRAME_STEPS_SIZE = 20; // $FlowFixMe
var ixSession = function ixSession() {
var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
var action = arguments.length > 1 ? arguments[1] : undefined;
switch (action.type) {
case IX2_SESSION_INITIALIZED:
{
var _action$payload = action.payload,
hasBoundaryNodes = _action$payload.hasBoundaryNodes,
reducedMotion = _action$payload.reducedMotion;
return (0, _timm.merge)(state, {
hasBoundaryNodes: hasBoundaryNodes,
reducedMotion: reducedMotion
});
}
case IX2_SESSION_STARTED:
{
return (0, _timm.set)(state, 'active', true);
}
case IX2_TEST_FRAME_RENDERED:
{
var _action$payload$step = action.payload.step,
step = _action$payload$step === void 0 ? TEST_FRAME_STEPS_SIZE : _action$payload$step;
return (0, _timm.set)(state, 'tick', state.tick + step);
}
case IX2_SESSION_STOPPED:
{
return initialState;
}
case IX2_ANIMATION_FRAME_CHANGED:
{
var now = action.payload.now;
return (0, _timm.set)(state, 'tick', now);
}
case IX2_EVENT_LISTENER_ADDED:
{
var eventListeners = (0, _timm.addLast)(state.eventListeners, action.payload);
return (0, _timm.set)(state, 'eventListeners', eventListeners);
}
case IX2_EVENT_STATE_CHANGED:
{
var _action$payload2 = action.payload,
stateKey = _action$payload2.stateKey,
newState = _action$payload2.newState;
return (0, _timm.setIn)(state, ['eventState', stateKey], newState);
}
case IX2_ACTION_LIST_PLAYBACK_CHANGED:
{
var _action$payload3 = action.payload,
actionListId = _action$payload3.actionListId,
isPlaying = _action$payload3.isPlaying;
return (0, _timm.setIn)(state, ['playbackState', actionListId], isPlaying);
}
case IX2_VIEWPORT_WIDTH_CHANGED:
{
var _action$payload4 = action.payload,
width = _action$payload4.width,
mediaQueries = _action$payload4.mediaQueries;
var mediaQueryCount = mediaQueries.length;
var mediaQueryKey = null;
for (var i = 0; i < mediaQueryCount; i++) {
var _mediaQueries$i = mediaQueries[i],
key = _mediaQueries$i.key,
min = _mediaQueries$i.min,
max = _mediaQueries$i.max;
if (width >= min && width <= max) {
mediaQueryKey = key;
break;
}
}
return (0, _timm.merge)(state, {
viewportWidth: width,
mediaQueryKey: mediaQueryKey
});
}
case IX2_MEDIA_QUERIES_DEFINED:
{
return (0, _timm.set)(state, 'hasDefinedMediaQueries', true);
}
default:
{
return state;
}
}
};
exports.ixSession = ixSession;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIsMatch = __webpack_require__(196),
getMatchData = __webpack_require__(248),
matchesStrictComparable = __webpack_require__(111);
function baseMatches(source) {
var matchData = getMatchData(source);
if (matchData.length == 1 && matchData[0][2]) {
return matchesStrictComparable(matchData[0][0], matchData[0][1]);
}
return function(object) {
return object === source || baseIsMatch(object, source, matchData);
};
}
module.exports = baseMatches;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Stack = __webpack_require__(97),
baseIsEqual = __webpack_require__(101);
var COMPARE_PARTIAL_FLAG = 1,
COMPARE_UNORDERED_FLAG = 2;
function baseIsMatch(object, source, matchData, customizer) {
var index = matchData.length,
length = index,
noCustomizer = !customizer;
if (object == null) {
return !length;
}
object = Object(object);
while (index--) {
var data = matchData[index];
if ((noCustomizer && data[2])
? data[1] !== object[data[0]]
: !(data[0] in object)
) {
return false;
}
}
while (++index < length) {
data = matchData[index];
var key = data[0],
objValue = object[key],
srcValue = data[1];
if (noCustomizer && data[2]) {
if (objValue === undefined && !(key in object)) {
return false;
}
} else {
var stack = new Stack;
if (customizer) {
var result = customizer(objValue, srcValue, key, object, source, stack);
}
if (!(result === undefined
? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
: result
)) {
return false;
}
}
}
return true;
}
module.exports = baseIsMatch;
/***/ }),
 (function(module, exports) {
function listCacheClear() {
this.__data__ = [];
this.size = 0;
}
module.exports = listCacheClear;
/***/ }),
 (function(module, exports, __webpack_require__) {
var assocIndexOf = __webpack_require__(33);
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
var data = this.__data__,
index = assocIndexOf(data, key);
if (index < 0) {
return false;
}
var lastIndex = data.length - 1;
if (index == lastIndex) {
data.pop();
} else {
splice.call(data, index, 1);
}
--this.size;
return true;
}
module.exports = listCacheDelete;
/***/ }),
 (function(module, exports, __webpack_require__) {
var assocIndexOf = __webpack_require__(33);
function listCacheGet(key) {
var data = this.__data__,
index = assocIndexOf(data, key);
return index < 0 ? undefined : data[index][1];
}
module.exports = listCacheGet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var assocIndexOf = __webpack_require__(33);
function listCacheHas(key) {
return assocIndexOf(this.__data__, key) > -1;
}
module.exports = listCacheHas;
/***/ }),
 (function(module, exports, __webpack_require__) {
var assocIndexOf = __webpack_require__(33);
function listCacheSet(key, value) {
var data = this.__data__,
index = assocIndexOf(data, key);
if (index < 0) {
++this.size;
data.push([key, value]);
} else {
data[index][1] = value;
}
return this;
}
module.exports = listCacheSet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var ListCache = __webpack_require__(32);
function stackClear() {
this.__data__ = new ListCache;
this.size = 0;
}
module.exports = stackClear;
/***/ }),
 (function(module, exports) {
function stackDelete(key) {
var data = this.__data__,
result = data['delete'](key);
this.size = data.size;
return result;
}
module.exports = stackDelete;
/***/ }),
 (function(module, exports) {
function stackGet(key) {
return this.__data__.get(key);
}
module.exports = stackGet;
/***/ }),
 (function(module, exports) {
function stackHas(key) {
return this.__data__.has(key);
}
module.exports = stackHas;
/***/ }),
 (function(module, exports, __webpack_require__) {
var ListCache = __webpack_require__(32),
Map = __webpack_require__(50),
MapCache = __webpack_require__(51);
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
var data = this.__data__;
if (data instanceof ListCache) {
var pairs = data.__data__;
if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
pairs.push([key, value]);
this.size = ++data.size;
return this;
}
data = this.__data__ = new MapCache(pairs);
}
data.set(key, value);
this.size = data.size;
return this;
}
module.exports = stackSet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isFunction = __webpack_require__(98),
isMasked = __webpack_require__(210),
isObject = __webpack_require__(8),
toSource = __webpack_require__(100);
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto = Function.prototype,
objectProto = Object.prototype;
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var reIsNative = RegExp('^' +
funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
.replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);
function baseIsNative(value) {
if (!isObject(value) || isMasked(value)) {
return false;
}
var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
return pattern.test(toSource(value));
}
module.exports = baseIsNative;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Symbol = __webpack_require__(23);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
function getRawTag(value) {
var isOwn = hasOwnProperty.call(value, symToStringTag),
tag = value[symToStringTag];
try {
value[symToStringTag] = undefined;
var unmasked = true;
} catch (e) {}
var result = nativeObjectToString.call(value);
if (unmasked) {
if (isOwn) {
value[symToStringTag] = tag;
} else {
delete value[symToStringTag];
}
}
return result;
}
module.exports = getRawTag;
/***/ }),
 (function(module, exports) {
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString(value) {
return nativeObjectToString.call(value);
}
module.exports = objectToString;
/***/ }),
 (function(module, exports, __webpack_require__) {
var coreJsData = __webpack_require__(211);
var maskSrcKey = (function() {
var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
return uid ? ('Symbol(src)_1.' + uid) : '';
}());
function isMasked(func) {
return !!maskSrcKey && (maskSrcKey in func);
}
module.exports = isMasked;
/***/ }),
 (function(module, exports, __webpack_require__) {
var root = __webpack_require__(6);
var coreJsData = root['__core-js_shared__'];
module.exports = coreJsData;
/***/ }),
 (function(module, exports) {
function getValue(object, key) {
return object == null ? undefined : object[key];
}
module.exports = getValue;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Hash = __webpack_require__(214),
ListCache = __webpack_require__(32),
Map = __webpack_require__(50);
function mapCacheClear() {
this.size = 0;
this.__data__ = {
'hash': new Hash,
'map': new (Map || ListCache),
'string': new Hash
};
}
module.exports = mapCacheClear;
/***/ }),
 (function(module, exports, __webpack_require__) {
var hashClear = __webpack_require__(215),
hashDelete = __webpack_require__(216),
hashGet = __webpack_require__(217),
hashHas = __webpack_require__(218),
hashSet = __webpack_require__(219);
function Hash(entries) {
var index = -1,
length = entries == null ? 0 : entries.length;
this.clear();
while (++index < length) {
var entry = entries[index];
this.set(entry[0], entry[1]);
}
}
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
module.exports = Hash;
/***/ }),
 (function(module, exports, __webpack_require__) {
var nativeCreate = __webpack_require__(34);
function hashClear() {
this.__data__ = nativeCreate ? nativeCreate(null) : {};
this.size = 0;
}
module.exports = hashClear;
/***/ }),
 (function(module, exports) {
function hashDelete(key) {
var result = this.has(key) && delete this.__data__[key];
this.size -= result ? 1 : 0;
return result;
}
module.exports = hashDelete;
/***/ }),
 (function(module, exports, __webpack_require__) {
var nativeCreate = __webpack_require__(34);
var HASH_UNDEFINED = '__lodash_hash_undefined__';
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function hashGet(key) {
var data = this.__data__;
if (nativeCreate) {
var result = data[key];
return result === HASH_UNDEFINED ? undefined : result;
}
return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
module.exports = hashGet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var nativeCreate = __webpack_require__(34);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function hashHas(key) {
var data = this.__data__;
return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}
module.exports = hashHas;
/***/ }),
 (function(module, exports, __webpack_require__) {
var nativeCreate = __webpack_require__(34);
var HASH_UNDEFINED = '__lodash_hash_undefined__';
function hashSet(key, value) {
var data = this.__data__;
this.size += this.has(key) ? 0 : 1;
data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
return this;
}
module.exports = hashSet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getMapData = __webpack_require__(35);
function mapCacheDelete(key) {
var result = getMapData(this, key)['delete'](key);
this.size -= result ? 1 : 0;
return result;
}
module.exports = mapCacheDelete;
/***/ }),
 (function(module, exports) {
function isKeyable(value) {
var type = typeof value;
return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
? (value !== '__proto__')
: (value === null);
}
module.exports = isKeyable;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getMapData = __webpack_require__(35);
function mapCacheGet(key) {
return getMapData(this, key).get(key);
}
module.exports = mapCacheGet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getMapData = __webpack_require__(35);
function mapCacheHas(key) {
return getMapData(this, key).has(key);
}
module.exports = mapCacheHas;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getMapData = __webpack_require__(35);
function mapCacheSet(key, value) {
var data = getMapData(this, key),
size = data.size;
data.set(key, value);
this.size += data.size == size ? 0 : 1;
return this;
}
module.exports = mapCacheSet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Stack = __webpack_require__(97),
equalArrays = __webpack_require__(102),
equalByTag = __webpack_require__(231),
equalObjects = __webpack_require__(235),
getTag = __webpack_require__(59),
isArray = __webpack_require__(2),
isBuffer = __webpack_require__(53),
isTypedArray = __webpack_require__(55);
var COMPARE_PARTIAL_FLAG = 1;
var argsTag = '[object Arguments]',
arrayTag = '[object Array]',
objectTag = '[object Object]';
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
var objIsArr = isArray(object),
othIsArr = isArray(other),
objTag = objIsArr ? arrayTag : getTag(object),
othTag = othIsArr ? arrayTag : getTag(other);
objTag = objTag == argsTag ? objectTag : objTag;
othTag = othTag == argsTag ? objectTag : othTag;
var objIsObj = objTag == objectTag,
othIsObj = othTag == objectTag,
isSameTag = objTag == othTag;
if (isSameTag && isBuffer(object)) {
if (!isBuffer(other)) {
return false;
}
objIsArr = true;
objIsObj = false;
}
if (isSameTag && !objIsObj) {
stack || (stack = new Stack);
return (objIsArr || isTypedArray(object))
? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
: equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
}
if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
if (objIsWrapped || othIsWrapped) {
var objUnwrapped = objIsWrapped ? object.value() : object,
othUnwrapped = othIsWrapped ? other.value() : other;
stack || (stack = new Stack);
return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
}
}
if (!isSameTag) {
return false;
}
stack || (stack = new Stack);
return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
module.exports = baseIsEqualDeep;
/***/ }),
 (function(module, exports, __webpack_require__) {
var MapCache = __webpack_require__(51),
setCacheAdd = __webpack_require__(227),
setCacheHas = __webpack_require__(228);
function SetCache(values) {
var index = -1,
length = values == null ? 0 : values.length;
this.__data__ = new MapCache;
while (++index < length) {
this.add(values[index]);
}
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
module.exports = SetCache;
/***/ }),
 (function(module, exports) {
var HASH_UNDEFINED = '__lodash_hash_undefined__';
function setCacheAdd(value) {
this.__data__.set(value, HASH_UNDEFINED);
return this;
}
module.exports = setCacheAdd;
/***/ }),
 (function(module, exports) {
function setCacheHas(value) {
return this.__data__.has(value);
}
module.exports = setCacheHas;
/***/ }),
 (function(module, exports) {
function arraySome(array, predicate) {
var index = -1,
length = array == null ? 0 : array.length;
while (++index < length) {
if (predicate(array[index], index, array)) {
return true;
}
}
return false;
}
module.exports = arraySome;
/***/ }),
 (function(module, exports) {
function cacheHas(cache, key) {
return cache.has(key);
}
module.exports = cacheHas;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Symbol = __webpack_require__(23),
Uint8Array = __webpack_require__(232),
eq = __webpack_require__(49),
equalArrays = __webpack_require__(102),
mapToArray = __webpack_require__(233),
setToArray = __webpack_require__(234);
var COMPARE_PARTIAL_FLAG = 1,
COMPARE_UNORDERED_FLAG = 2;
var boolTag = '[object Boolean]',
dateTag = '[object Date]',
errorTag = '[object Error]',
mapTag = '[object Map]',
numberTag = '[object Number]',
regexpTag = '[object RegExp]',
setTag = '[object Set]',
stringTag = '[object String]',
symbolTag = '[object Symbol]';
var arrayBufferTag = '[object ArrayBuffer]',
dataViewTag = '[object DataView]';
var symbolProto = Symbol ? Symbol.prototype : undefined,
symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
switch (tag) {
case dataViewTag:
if ((object.byteLength != other.byteLength) ||
(object.byteOffset != other.byteOffset)) {
return false;
}
object = object.buffer;
other = other.buffer;
case arrayBufferTag:
if ((object.byteLength != other.byteLength) ||
!equalFunc(new Uint8Array(object), new Uint8Array(other))) {
return false;
}
return true;
case boolTag:
case dateTag:
case numberTag:
return eq(+object, +other);
case errorTag:
return object.name == other.name && object.message == other.message;
case regexpTag:
case stringTag:
return object == (other + '');
case mapTag:
var convert = mapToArray;
case setTag:
var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
convert || (convert = setToArray);
if (object.size != other.size && !isPartial) {
return false;
}
var stacked = stack.get(object);
if (stacked) {
return stacked == other;
}
bitmask |= COMPARE_UNORDERED_FLAG;
stack.set(object, other);
var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
stack['delete'](object);
return result;
case symbolTag:
if (symbolValueOf) {
return symbolValueOf.call(object) == symbolValueOf.call(other);
}
}
return false;
}
module.exports = equalByTag;
/***/ }),
 (function(module, exports, __webpack_require__) {
var root = __webpack_require__(6);
var Uint8Array = root.Uint8Array;
module.exports = Uint8Array;
/***/ }),
 (function(module, exports) {
function mapToArray(map) {
var index = -1,
result = Array(map.size);
map.forEach(function(value, key) {
result[++index] = [key, value];
});
return result;
}
module.exports = mapToArray;
/***/ }),
 (function(module, exports) {
function setToArray(set) {
var index = -1,
result = Array(set.size);
set.forEach(function(value) {
result[++index] = value;
});
return result;
}
module.exports = setToArray;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getAllKeys = __webpack_require__(236);
var COMPARE_PARTIAL_FLAG = 1;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
objProps = getAllKeys(object),
objLength = objProps.length,
othProps = getAllKeys(other),
othLength = othProps.length;
if (objLength != othLength && !isPartial) {
return false;
}
var index = objLength;
while (index--) {
var key = objProps[index];
if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
return false;
}
}
var objStacked = stack.get(object);
var othStacked = stack.get(other);
if (objStacked && othStacked) {
return objStacked == other && othStacked == object;
}
var result = true;
stack.set(object, other);
stack.set(other, object);
var skipCtor = isPartial;
while (++index < objLength) {
key = objProps[index];
var objValue = object[key],
othValue = other[key];
if (customizer) {
var compared = isPartial
? customizer(othValue, objValue, key, other, object, stack)
: customizer(objValue, othValue, key, object, other, stack);
}
if (!(compared === undefined
? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
: compared
)) {
result = false;
break;
}
skipCtor || (skipCtor = key == 'constructor');
}
if (result && !skipCtor) {
var objCtor = object.constructor,
othCtor = other.constructor;
if (objCtor != othCtor &&
('constructor' in object && 'constructor' in other) &&
!(typeof objCtor == 'function' && objCtor instanceof objCtor &&
typeof othCtor == 'function' && othCtor instanceof othCtor)) {
result = false;
}
}
stack['delete'](object);
stack['delete'](other);
return result;
}
module.exports = equalObjects;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetAllKeys = __webpack_require__(103),
getSymbols = __webpack_require__(104),
keys = __webpack_require__(36);
function getAllKeys(object) {
return baseGetAllKeys(object, keys, getSymbols);
}
module.exports = getAllKeys;
/***/ }),
 (function(module, exports) {
function arrayFilter(array, predicate) {
var index = -1,
length = array == null ? 0 : array.length,
resIndex = 0,
result = [];
while (++index < length) {
var value = array[index];
if (predicate(value, index, array)) {
result[resIndex++] = value;
}
}
return result;
}
module.exports = arrayFilter;
/***/ }),
 (function(module, exports) {
function baseTimes(n, iteratee) {
var index = -1,
result = Array(n);
while (++index < n) {
result[index] = iteratee(index);
}
return result;
}
module.exports = baseTimes;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetTag = __webpack_require__(15),
isObjectLike = __webpack_require__(12);
var argsTag = '[object Arguments]';
function baseIsArguments(value) {
return isObjectLike(value) && baseGetTag(value) == argsTag;
}
module.exports = baseIsArguments;
/***/ }),
 (function(module, exports) {
function stubFalse() {
return false;
}
module.exports = stubFalse;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetTag = __webpack_require__(15),
isLength = __webpack_require__(56),
isObjectLike = __webpack_require__(12);
var argsTag = '[object Arguments]',
arrayTag = '[object Array]',
boolTag = '[object Boolean]',
dateTag = '[object Date]',
errorTag = '[object Error]',
funcTag = '[object Function]',
mapTag = '[object Map]',
numberTag = '[object Number]',
objectTag = '[object Object]',
regexpTag = '[object RegExp]',
setTag = '[object Set]',
stringTag = '[object String]',
weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
dataViewTag = '[object DataView]',
float32Tag = '[object Float32Array]',
float64Tag = '[object Float64Array]',
int8Tag = '[object Int8Array]',
int16Tag = '[object Int16Array]',
int32Tag = '[object Int32Array]',
uint8Tag = '[object Uint8Array]',
uint8ClampedTag = '[object Uint8ClampedArray]',
uint16Tag = '[object Uint16Array]',
uint32Tag = '[object Uint32Array]';
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
return isObjectLike(value) &&
isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
module.exports = baseIsTypedArray;
/***/ }),
 (function(module, exports) {
function baseUnary(func) {
return function(value) {
return func(value);
};
}
module.exports = baseUnary;
/***/ }),
 (function(module, exports, __webpack_require__) {
(function(module) {var freeGlobal = __webpack_require__(99);
var freeExports =  true && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal.process;
var nodeUtil = (function() {
try {
var types = freeModule && freeModule.require && freeModule.require('util').types;
if (types) {
return types;
}
return freeProcess && freeProcess.binding && freeProcess.binding('util');
} catch (e) {}
}());
module.exports = nodeUtil;
}.call(this, __webpack_require__(107)(module)))
/***/ }),
 (function(module, exports, __webpack_require__) {
var overArg = __webpack_require__(108);
var nativeKeys = overArg(Object.keys, Object);
module.exports = nativeKeys;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11),
root = __webpack_require__(6);
var DataView = getNative(root, 'DataView');
module.exports = DataView;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11),
root = __webpack_require__(6);
var Promise = getNative(root, 'Promise');
module.exports = Promise;
/***/ }),
 (function(module, exports, __webpack_require__) {
var getNative = __webpack_require__(11),
root = __webpack_require__(6);
var Set = getNative(root, 'Set');
module.exports = Set;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isStrictComparable = __webpack_require__(110),
keys = __webpack_require__(36);
function getMatchData(object) {
var result = keys(object),
length = result.length;
while (length--) {
var key = result[length],
value = object[key];
result[length] = [key, value, isStrictComparable(value)];
}
return result;
}
module.exports = getMatchData;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIsEqual = __webpack_require__(101),
get = __webpack_require__(60),
hasIn = __webpack_require__(255),
isKey = __webpack_require__(62),
isStrictComparable = __webpack_require__(110),
matchesStrictComparable = __webpack_require__(111),
toKey = __webpack_require__(24);
var COMPARE_PARTIAL_FLAG = 1,
COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty(path, srcValue) {
if (isKey(path) && isStrictComparable(srcValue)) {
return matchesStrictComparable(toKey(path), srcValue);
}
return function(object) {
var objValue = get(object, path);
return (objValue === undefined && objValue === srcValue)
? hasIn(object, path)
: baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
};
}
module.exports = baseMatchesProperty;
/***/ }),
 (function(module, exports, __webpack_require__) {
var memoizeCapped = __webpack_require__(251);
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped(function(string) {
var result = [];
if (string.charCodeAt(0) === 46 ) {
result.push('');
}
string.replace(rePropName, function(match, number, quote, subString) {
result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
});
return result;
});
module.exports = stringToPath;
/***/ }),
 (function(module, exports, __webpack_require__) {
var memoize = __webpack_require__(252);
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
var result = memoize(func, function(key) {
if (cache.size === MAX_MEMOIZE_SIZE) {
cache.clear();
}
return key;
});
var cache = result.cache;
return result;
}
module.exports = memoizeCapped;
/***/ }),
 (function(module, exports, __webpack_require__) {
var MapCache = __webpack_require__(51);
var FUNC_ERROR_TEXT = 'Expected a function';
function memoize(func, resolver) {
if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
throw new TypeError(FUNC_ERROR_TEXT);
}
var memoized = function() {
var args = arguments,
key = resolver ? resolver.apply(this, args) : args[0],
cache = memoized.cache;
if (cache.has(key)) {
return cache.get(key);
}
var result = func.apply(this, args);
memoized.cache = cache.set(key, result) || cache;
return result;
};
memoized.cache = new (memoize.Cache || MapCache);
return memoized;
}
memoize.Cache = MapCache;
module.exports = memoize;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseToString = __webpack_require__(254);
function toString(value) {
return value == null ? '' : baseToString(value);
}
module.exports = toString;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Symbol = __webpack_require__(23),
arrayMap = __webpack_require__(112),
isArray = __webpack_require__(2),
isSymbol = __webpack_require__(39);
var INFINITY = 1 / 0;
var symbolProto = Symbol ? Symbol.prototype : undefined,
symbolToString = symbolProto ? symbolProto.toString : undefined;
function baseToString(value) {
if (typeof value == 'string') {
return value;
}
if (isArray(value)) {
return arrayMap(value, baseToString) + '';
}
if (isSymbol(value)) {
return symbolToString ? symbolToString.call(value) : '';
}
var result = (value + '');
return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}
module.exports = baseToString;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseHasIn = __webpack_require__(256),
hasPath = __webpack_require__(257);
function hasIn(object, path) {
return object != null && hasPath(object, path, baseHasIn);
}
module.exports = hasIn;
/***/ }),
 (function(module, exports) {
function baseHasIn(object, key) {
return object != null && key in Object(object);
}
module.exports = baseHasIn;
/***/ }),
 (function(module, exports, __webpack_require__) {
var castPath = __webpack_require__(38),
isArguments = __webpack_require__(37),
isArray = __webpack_require__(2),
isIndex = __webpack_require__(54),
isLength = __webpack_require__(56),
toKey = __webpack_require__(24);
function hasPath(object, path, hasFunc) {
path = castPath(path, object);
var index = -1,
length = path.length,
result = false;
while (++index < length) {
var key = toKey(path[index]);
if (!(result = object != null && hasFunc(object, key))) {
break;
}
object = object[key];
}
if (result || ++index != length) {
return result;
}
length = object == null ? 0 : object.length;
return !!length && isLength(length) && isIndex(key, length) &&
(isArray(object) || isArguments(object));
}
module.exports = hasPath;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseProperty = __webpack_require__(113),
basePropertyDeep = __webpack_require__(259),
isKey = __webpack_require__(62),
toKey = __webpack_require__(24);
function property(path) {
return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
module.exports = property;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGet = __webpack_require__(61);
function basePropertyDeep(path) {
return function(object) {
return baseGet(object, path);
};
}
module.exports = basePropertyDeep;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseFindIndex = __webpack_require__(114),
baseIteratee = __webpack_require__(10),
toInteger = __webpack_require__(115);
var nativeMax = Math.max;
function findIndex(array, predicate, fromIndex) {
var length = array == null ? 0 : array.length;
if (!length) {
return -1;
}
var index = fromIndex == null ? 0 : toInteger(fromIndex);
if (index < 0) {
index = nativeMax(length + index, 0);
}
return baseFindIndex(array, baseIteratee(predicate, 3), index);
}
module.exports = findIndex;
/***/ }),
 (function(module, exports, __webpack_require__) {
var toNumber = __webpack_require__(64);
var INFINITY = 1 / 0,
MAX_INTEGER = 1.7976931348623157e+308;
function toFinite(value) {
if (!value) {
return value === 0 ? value : 0;
}
value = toNumber(value);
if (value === INFINITY || value === -INFINITY) {
var sign = (value < 0 ? -1 : 1);
return sign * MAX_INTEGER;
}
return value === value ? value : 0;
}
module.exports = toFinite;
/***/ }),
 (function(module, exports, __webpack_require__) {
var trimmedEndIndex = __webpack_require__(263);
var reTrimStart = /^\s+/;
function baseTrim(string) {
return string
? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
: string;
}
module.exports = baseTrim;
/***/ }),
 (function(module, exports) {
var reWhitespace = /\s/;
function trimmedEndIndex(string) {
var index = string.length;
while (index-- && reWhitespace.test(string.charAt(index))) {}
return index;
}
module.exports = trimmedEndIndex;
/***/ }),
 (function(module, exports) {
function _arrayWithoutHoles(arr) {
if (Array.isArray(arr)) {
for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
arr2[i] = arr[i];
}
return arr2;
}
}
module.exports = _arrayWithoutHoles;
/***/ }),
 (function(module, exports) {
function _iterableToArray(iter) {
if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
module.exports = _iterableToArray;
/***/ }),
 (function(module, exports) {
function _nonIterableSpread() {
throw new TypeError("Invalid attempt to spread non-iterable instance");
}
module.exports = _nonIterableSpread;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.createElementState = createElementState;
exports.mergeActionState = mergeActionState;
exports.ixElements = void 0;
var _timm = __webpack_require__(22);
var _constants = __webpack_require__(4);
var _constants$IX2EngineC = _constants.IX2EngineConstants,
HTML_ELEMENT = _constants$IX2EngineC.HTML_ELEMENT,
PLAIN_OBJECT = _constants$IX2EngineC.PLAIN_OBJECT,
ABSTRACT_NODE = _constants$IX2EngineC.ABSTRACT_NODE,
CONFIG_X_VALUE = _constants$IX2EngineC.CONFIG_X_VALUE,
CONFIG_Y_VALUE = _constants$IX2EngineC.CONFIG_Y_VALUE,
CONFIG_Z_VALUE = _constants$IX2EngineC.CONFIG_Z_VALUE,
CONFIG_VALUE = _constants$IX2EngineC.CONFIG_VALUE,
CONFIG_X_UNIT = _constants$IX2EngineC.CONFIG_X_UNIT,
CONFIG_Y_UNIT = _constants$IX2EngineC.CONFIG_Y_UNIT,
CONFIG_Z_UNIT = _constants$IX2EngineC.CONFIG_Z_UNIT,
CONFIG_UNIT = _constants$IX2EngineC.CONFIG_UNIT;
var _constants$IX2EngineA = _constants.IX2EngineActionTypes,
IX2_SESSION_STOPPED = _constants$IX2EngineA.IX2_SESSION_STOPPED,
IX2_INSTANCE_ADDED = _constants$IX2EngineA.IX2_INSTANCE_ADDED,
IX2_ELEMENT_STATE_CHANGED = _constants$IX2EngineA.IX2_ELEMENT_STATE_CHANGED;
var initialState = {};
var refState = 'refState';
var ixElements = function ixElements() {
var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
switch (action.type) {
case IX2_SESSION_STOPPED:
{
return initialState;
}
case IX2_INSTANCE_ADDED:
{
var _action$payload = action.payload,
elementId = _action$payload.elementId,
ref = _action$payload.element,
origin = _action$payload.origin,
actionItem = _action$payload.actionItem,
refType = _action$payload.refType;
var actionTypeId = actionItem.actionTypeId;
var newState = state; // Create new ref entry if it doesn't exist
if ((0, _timm.getIn)(newState, [elementId, ref]) !== ref) {
newState = createElementState(newState, ref, refType, elementId, actionItem);
} // Merge origin values into ref state
return mergeActionState(newState, elementId, actionTypeId, origin, actionItem);
}
case IX2_ELEMENT_STATE_CHANGED:
{
var _action$payload2 = action.payload,
_elementId = _action$payload2.elementId,
_actionTypeId = _action$payload2.actionTypeId,
current = _action$payload2.current,
_actionItem = _action$payload2.actionItem;
return mergeActionState(state, _elementId, _actionTypeId, current, _actionItem);
}
default:
{
return state;
}
}
};
exports.ixElements = ixElements;
function createElementState(state, ref, refType, elementId, actionItem) {
var refId = refType === PLAIN_OBJECT ? (0, _timm.getIn)(actionItem, ['config', 'target', 'objectId']) : null;
return (0, _timm.mergeIn)(state, [elementId], {
id: elementId,
ref: ref,
refId: refId,
refType: refType
});
}
function mergeActionState(state, elementId, actionTypeId, actionState, // FIXME: weak type is used
actionItem) {
var units = pickUnits(actionItem);
var mergePath = [elementId, refState, actionTypeId];
return (0, _timm.mergeIn)(state, mergePath, actionState, units);
}
var valueUnitPairs = [[CONFIG_X_VALUE, CONFIG_X_UNIT], [CONFIG_Y_VALUE, CONFIG_Y_UNIT], [CONFIG_Z_VALUE, CONFIG_Z_UNIT], [CONFIG_VALUE, CONFIG_UNIT]]; // FIXME: weak type is used
function pickUnits(actionItem) {
var config = actionItem.config;
return valueUnitPairs.reduce(function (result, pair) {
var valueKey = pair[0];
var unitKey = pair[1];
var configValue = config[valueKey];
var configUnit = config[unitKey];
if (configValue != null && configUnit != null) {
result[unitKey] = configUnit;
}
return result;
}, {});
}
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.clearPlugin = exports.renderPlugin = exports.createPluginInstance = exports.getPluginDestination = exports.getPluginOrigin = exports.getPluginDuration = exports.getPluginConfig = void 0;
var getPluginConfig = function getPluginConfig(actionItemConfig) {
return actionItemConfig.value;
}; // $FlowFixMe
exports.getPluginConfig = getPluginConfig;
var getPluginDuration = function getPluginDuration(element, actionItem) {
if (actionItem.config.duration !== 'auto') {
return null;
}
var duration = parseFloat(element.getAttribute('data-duration'));
if (duration > 0) {
return duration * 1000;
}
return parseFloat(element.getAttribute('data-default-duration')) * 1000;
}; // $FlowFixMe
exports.getPluginDuration = getPluginDuration;
var getPluginOrigin = function getPluginOrigin(refState) {
return refState || {
value: 0
};
}; // $FlowFixMe
exports.getPluginOrigin = getPluginOrigin;
var getPluginDestination = function getPluginDestination(actionItemConfig) {
return {
value: actionItemConfig.value
};
}; // $FlowFixMe
exports.getPluginDestination = getPluginDestination;
var createPluginInstance = function createPluginInstance(element) {
var instance = window.Webflow.require('lottie').createInstance(element);
instance.stop();
instance.setSubframe(true);
return instance;
}; // $FlowFixMe
exports.createPluginInstance = createPluginInstance;
var renderPlugin = function renderPlugin(pluginInstance, refState, actionItem) {
if (!pluginInstance) {
return;
}
var percent = refState[actionItem.actionTypeId].value / 100;
pluginInstance.goToFrame(pluginInstance.frames * percent);
}; // $FlowFixMe
exports.renderPlugin = renderPlugin;
var clearPlugin = function clearPlugin(element) {
var instance = window.Webflow.require('lottie').createInstance(element);
instance.stop();
};
exports.clearPlugin = clearPlugin;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault2 = __webpack_require__(1);
var _typeof2 = _interopRequireDefault2(__webpack_require__(17));
var _defineProperty2 = _interopRequireDefault2(__webpack_require__(21));
var _Object$freeze, _Object$freeze2, _transformDefaults;
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.getInstanceId = getInstanceId;
exports.getElementId = getElementId;
exports.reifyState = reifyState;
exports.observeStore = observeStore;
exports.getAffectedElements = getAffectedElements;
exports.getComputedStyle = getComputedStyle;
exports.getInstanceOrigin = getInstanceOrigin;
exports.getDestinationValues = getDestinationValues;
exports.getRenderType = getRenderType;
exports.getStyleProp = getStyleProp;
exports.renderHTMLElement = renderHTMLElement;
exports.clearAllStyles = clearAllStyles;
exports.cleanupHTMLElement = cleanupHTMLElement;
exports.getMaxDurationItemIndex = getMaxDurationItemIndex;
exports.getActionListProgress = getActionListProgress;
exports.reduceListToGroup = reduceListToGroup;
exports.shouldNamespaceEventParameter = shouldNamespaceEventParameter;
exports.getNamespacedParameterId = getNamespacedParameterId;
exports.shouldAllowMediaQuery = shouldAllowMediaQuery;
exports.mediaQueriesEqual = mediaQueriesEqual;
exports.stringifyTarget = stringifyTarget;
Object.defineProperty(exports, "shallowEqual", {
enumerable: true,
get: function get() {
return _shallowEqual["default"];
}
});
exports.getItemConfigByKey = void 0;
var _defaultTo = _interopRequireDefault(__webpack_require__(270));
var _reduce = _interopRequireDefault(__webpack_require__(271));
var _findLast = _interopRequireDefault(__webpack_require__(277));
var _timm = __webpack_require__(22);
var _constants = __webpack_require__(4);
var _shallowEqual = _interopRequireDefault(__webpack_require__(279));
var _IX2EasingUtils = __webpack_require__(118);
var _IX2VanillaPlugins = __webpack_require__(120);
var _IX2BrowserSupport = __webpack_require__(48);
var _constants$IX2EngineC = _constants.IX2EngineConstants,
BACKGROUND = _constants$IX2EngineC.BACKGROUND,
TRANSFORM = _constants$IX2EngineC.TRANSFORM,
TRANSLATE_3D = _constants$IX2EngineC.TRANSLATE_3D,
SCALE_3D = _constants$IX2EngineC.SCALE_3D,
ROTATE_X = _constants$IX2EngineC.ROTATE_X,
ROTATE_Y = _constants$IX2EngineC.ROTATE_Y,
ROTATE_Z = _constants$IX2EngineC.ROTATE_Z,
SKEW = _constants$IX2EngineC.SKEW,
PRESERVE_3D = _constants$IX2EngineC.PRESERVE_3D,
FLEX = _constants$IX2EngineC.FLEX,
OPACITY = _constants$IX2EngineC.OPACITY,
FILTER = _constants$IX2EngineC.FILTER,
WIDTH = _constants$IX2EngineC.WIDTH,
HEIGHT = _constants$IX2EngineC.HEIGHT,
BACKGROUND_COLOR = _constants$IX2EngineC.BACKGROUND_COLOR,
BORDER_COLOR = _constants$IX2EngineC.BORDER_COLOR,
COLOR = _constants$IX2EngineC.COLOR,
CHILDREN = _constants$IX2EngineC.CHILDREN,
IMMEDIATE_CHILDREN = _constants$IX2EngineC.IMMEDIATE_CHILDREN,
SIBLINGS = _constants$IX2EngineC.SIBLINGS,
PARENT = _constants$IX2EngineC.PARENT,
DISPLAY = _constants$IX2EngineC.DISPLAY,
WILL_CHANGE = _constants$IX2EngineC.WILL_CHANGE,
AUTO = _constants$IX2EngineC.AUTO,
COMMA_DELIMITER = _constants$IX2EngineC.COMMA_DELIMITER,
COLON_DELIMITER = _constants$IX2EngineC.COLON_DELIMITER,
BAR_DELIMITER = _constants$IX2EngineC.BAR_DELIMITER,
RENDER_TRANSFORM = _constants$IX2EngineC.RENDER_TRANSFORM,
RENDER_GENERAL = _constants$IX2EngineC.RENDER_GENERAL,
RENDER_STYLE = _constants$IX2EngineC.RENDER_STYLE,
RENDER_PLUGIN = _constants$IX2EngineC.RENDER_PLUGIN;
var _constants$ActionType = _constants.ActionTypeConsts,
TRANSFORM_MOVE = _constants$ActionType.TRANSFORM_MOVE,
TRANSFORM_SCALE = _constants$ActionType.TRANSFORM_SCALE,
TRANSFORM_ROTATE = _constants$ActionType.TRANSFORM_ROTATE,
TRANSFORM_SKEW = _constants$ActionType.TRANSFORM_SKEW,
STYLE_OPACITY = _constants$ActionType.STYLE_OPACITY,
STYLE_FILTER = _constants$ActionType.STYLE_FILTER,
STYLE_SIZE = _constants$ActionType.STYLE_SIZE,
STYLE_BACKGROUND_COLOR = _constants$ActionType.STYLE_BACKGROUND_COLOR,
STYLE_BORDER = _constants$ActionType.STYLE_BORDER,
STYLE_TEXT_COLOR = _constants$ActionType.STYLE_TEXT_COLOR,
GENERAL_DISPLAY = _constants$ActionType.GENERAL_DISPLAY;
var OBJECT_VALUE = 'OBJECT_VALUE';
var trim = function trim(v) {
return v.trim();
};
var colorStyleProps = Object.freeze((_Object$freeze = {}, (0, _defineProperty2["default"])(_Object$freeze, STYLE_BACKGROUND_COLOR, BACKGROUND_COLOR), (0, _defineProperty2["default"])(_Object$freeze, STYLE_BORDER, BORDER_COLOR), (0, _defineProperty2["default"])(_Object$freeze, STYLE_TEXT_COLOR, COLOR), _Object$freeze));
var willChangeProps = Object.freeze((_Object$freeze2 = {}, (0, _defineProperty2["default"])(_Object$freeze2, _IX2BrowserSupport.TRANSFORM_PREFIXED, TRANSFORM), (0, _defineProperty2["default"])(_Object$freeze2, BACKGROUND_COLOR, BACKGROUND), (0, _defineProperty2["default"])(_Object$freeze2, OPACITY, OPACITY), (0, _defineProperty2["default"])(_Object$freeze2, FILTER, FILTER), (0, _defineProperty2["default"])(_Object$freeze2, WIDTH, WIDTH), (0, _defineProperty2["default"])(_Object$freeze2, HEIGHT, HEIGHT), _Object$freeze2));
var objectCache = {};
var instanceCount = 1;
function getInstanceId() {
return 'i' + instanceCount++;
}
var elementCount = 1; // $FlowFixMe
function getElementId(ixElements, ref) {
for (var key in ixElements) {
var ixEl = ixElements[key];
if (ixEl && ixEl.ref === ref) {
return ixEl.id;
}
}
return 'e' + elementCount++;
} // $FlowFixMe
function reifyState() {
var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
events = _ref2.events,
actionLists = _ref2.actionLists,
site = _ref2.site;
var eventTypeMap = (0, _reduce["default"])(events, function (result, event) {
var eventTypeId = event.eventTypeId;
if (!result[eventTypeId]) {
result[eventTypeId] = {};
}
result[eventTypeId][event.id] = event;
return result;
}, {});
var mediaQueries = site && site.mediaQueries;
var mediaQueryKeys = [];
if (mediaQueries) {
mediaQueryKeys = mediaQueries.map(function (mq) {
return mq.key;
});
} else {
mediaQueries = [];
console.warn("IX2 missing mediaQueries in site data");
}
return {
ixData: {
events: events,
actionLists: actionLists,
eventTypeMap: eventTypeMap,
mediaQueries: mediaQueries,
mediaQueryKeys: mediaQueryKeys
}
};
}
var strictEqual = function strictEqual(a, b) {
return a === b;
}; // $FlowFixMe
function observeStore(_ref3) {
var store = _ref3.store,
select = _ref3.select,
onChange = _ref3.onChange,
_ref3$comparator = _ref3.comparator,
comparator = _ref3$comparator === void 0 ? strictEqual : _ref3$comparator;
var getState = store.getState,
subscribe = store.subscribe;
var unsubscribe = subscribe(handleChange);
var currentState = select(getState());
function handleChange() {
var nextState = select(getState());
if (nextState == null) {
unsubscribe();
return;
}
if (!comparator(nextState, currentState)) {
currentState = nextState;
onChange(currentState, store);
}
}
return unsubscribe;
}
function normalizeTarget(target) {
var type = (0, _typeof2["default"])(target);
if (type === 'string') {
return {
id: target
};
} else if (target != null && type === 'object') {
var id = target.id,
objectId = target.objectId,
selector = target.selector,
selectorGuids = target.selectorGuids,
appliesTo = target.appliesTo,
useEventTarget = target.useEventTarget;
return {
id: id,
objectId: objectId,
selector: selector,
selectorGuids: selectorGuids,
appliesTo: appliesTo,
useEventTarget: useEventTarget
};
}
return {};
}
function getAffectedElements(_ref4) {
var config = _ref4.config,
event = _ref4.event,
eventTarget = _ref4.eventTarget,
elementRoot = _ref4.elementRoot,
elementApi = _ref4.elementApi;
var _ref, _event$action, _event$action$config;
if (!elementApi) {
throw new Error('IX2 missing elementApi');
}
var targets = config.targets;
if (Array.isArray(targets) && targets.length > 0) {
return targets.reduce(function (accumulator, target) {
return accumulator.concat(getAffectedElements({
config: {
target: target
},
event: event,
eventTarget: eventTarget,
elementRoot: elementRoot,
elementApi: elementApi
}));
}, []);
}
var getValidDocument = elementApi.getValidDocument,
getQuerySelector = elementApi.getQuerySelector,
queryDocument = elementApi.queryDocument,
getChildElements = elementApi.getChildElements,
getSiblingElements = elementApi.getSiblingElements,
matchSelector = elementApi.matchSelector,
elementContains = elementApi.elementContains,
isSiblingNode = elementApi.isSiblingNode;
var target = config.target;
if (!target) {
return [];
}
var _normalizeTarget = normalizeTarget(target),
id = _normalizeTarget.id,
objectId = _normalizeTarget.objectId,
selector = _normalizeTarget.selector,
selectorGuids = _normalizeTarget.selectorGuids,
appliesTo = _normalizeTarget.appliesTo,
useEventTarget = _normalizeTarget.useEventTarget;
if (objectId) {
var ref = objectCache[objectId] || (objectCache[objectId] = {});
return [ref];
}
if (appliesTo === _constants.EventAppliesTo.PAGE) {
var doc = getValidDocument(id);
return doc ? [doc] : [];
}
var overrides = (_ref = event === null || event === void 0 ? void 0 : (_event$action = event.action) === null || _event$action === void 0 ? void 0 : (_event$action$config = _event$action.config) === null || _event$action$config === void 0 ? void 0 : _event$action$config.affectedElements) !== null && _ref !== void 0 ? _ref : {};
var override = overrides[id || selector] || {};
var validOverride = Boolean(override.id || override.selector);
var limitAffectedElements;
var baseSelector;
var finalSelector;
var eventTargetSelector = event && getQuerySelector(normalizeTarget(event.target));
if (validOverride) {
limitAffectedElements = override.limitAffectedElements;
baseSelector = eventTargetSelector;
finalSelector = getQuerySelector(override);
} else {
baseSelector = finalSelector = getQuerySelector({
id: id,
selector: selector,
selectorGuids: selectorGuids
});
}
if (event && useEventTarget) {
var eventTargets = eventTarget && (finalSelector || useEventTarget === true) ? [eventTarget] : queryDocument(eventTargetSelector);
if (finalSelector) {
if (useEventTarget === PARENT) {
return queryDocument(finalSelector).filter(function (parentElement) {
return eventTargets.some(function (targetElement) {
return elementContains(parentElement, targetElement);
});
});
}
if (useEventTarget === CHILDREN) {
return queryDocument(finalSelector).filter(function (childElement) {
return eventTargets.some(function (targetElement) {
return elementContains(targetElement, childElement);
});
});
}
if (useEventTarget === SIBLINGS) {
return queryDocument(finalSelector).filter(function (siblingElement) {
return eventTargets.some(function (targetElement) {
return isSiblingNode(targetElement, siblingElement);
});
});
}
}
return eventTargets;
}
if (baseSelector == null || finalSelector == null) {
return [];
}
if (_IX2BrowserSupport.IS_BROWSER_ENV && elementRoot) {
return queryDocument(finalSelector).filter(function (element) {
return elementRoot.contains(element);
});
}
if (limitAffectedElements === CHILDREN) {
return queryDocument(baseSelector, finalSelector);
} else if (limitAffectedElements === IMMEDIATE_CHILDREN) {
return getChildElements(queryDocument(baseSelector)).filter(matchSelector(finalSelector));
} else if (limitAffectedElements === SIBLINGS) {
return getSiblingElements(queryDocument(baseSelector)).filter(matchSelector(finalSelector));
} else {
return queryDocument(finalSelector);
}
} // $FlowFixMe
function getComputedStyle(_ref5) {
var element = _ref5.element,
actionItem = _ref5.actionItem;
if (!_IX2BrowserSupport.IS_BROWSER_ENV) {
return {};
}
var actionTypeId = actionItem.actionTypeId;
switch (actionTypeId) {
case STYLE_SIZE:
case STYLE_BACKGROUND_COLOR:
case STYLE_BORDER:
case STYLE_TEXT_COLOR:
case GENERAL_DISPLAY:
return window.getComputedStyle(element);
default:
return {};
}
}
var pxValueRegex = /px/;
var getFilterDefaults = function getFilterDefaults(actionState, filters) {
return filters.reduce(function (result, filter) {
if (result[filter.type] == null) {
result[filter.type] = filterDefaults[filter.type];
}
return result;
}, actionState || {});
};
function getInstanceOrigin( // $FlowFixMe
element) {
var refState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
var computedStyle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
var // $FlowFixMe
actionItem = arguments.length > 3 ? arguments[3] : undefined;
var // $FlowFixMe
elementApi = arguments.length > 4 ? arguments[4] : undefined;
var getStyle = elementApi.getStyle;
var actionTypeId = actionItem.actionTypeId,
config = actionItem.config;
if ((0, _IX2VanillaPlugins.isPluginType)(actionTypeId)) {
return (0, _IX2VanillaPlugins.getPluginOrigin)(actionTypeId)(refState[actionTypeId]);
}
switch (actionTypeId) {
case TRANSFORM_MOVE:
case TRANSFORM_SCALE:
case TRANSFORM_ROTATE:
case TRANSFORM_SKEW:
return refState[actionTypeId] || transformDefaults[actionTypeId];
case STYLE_FILTER:
return getFilterDefaults(refState[actionTypeId], actionItem.config.filters);
case STYLE_OPACITY:
return {
value: (0, _defaultTo["default"])(parseFloat(getStyle(element, OPACITY)), 1.0)
};
case STYLE_SIZE:
{
var inlineWidth = getStyle(element, WIDTH);
var inlineHeight = getStyle(element, HEIGHT);
var widthValue;
var heightValue; // When destination unit is 'AUTO', ensure origin values are in px
if (config.widthUnit === AUTO) {
widthValue = pxValueRegex.test(inlineWidth) ? parseFloat(inlineWidth) : parseFloat(computedStyle.width);
} else {
widthValue = (0, _defaultTo["default"])(parseFloat(inlineWidth), parseFloat(computedStyle.width));
}
if (config.heightUnit === AUTO) {
heightValue = pxValueRegex.test(inlineHeight) ? parseFloat(inlineHeight) : parseFloat(computedStyle.height);
} else {
heightValue = (0, _defaultTo["default"])(parseFloat(inlineHeight), parseFloat(computedStyle.height));
}
return {
widthValue: widthValue,
heightValue: heightValue
};
}
case STYLE_BACKGROUND_COLOR:
case STYLE_BORDER:
case STYLE_TEXT_COLOR:
return parseColor({
element: element,
actionTypeId: actionTypeId,
computedStyle: computedStyle,
getStyle: getStyle
});
case GENERAL_DISPLAY:
return {
value: (0, _defaultTo["default"])(getStyle(element, DISPLAY), computedStyle.display)
};
case OBJECT_VALUE:
return refState[actionTypeId] || {
value: 0
};
default:
return;
}
}
var reduceFilters = function reduceFilters(result, filter) {
if (filter) {
result[filter.type] = filter.value || 0;
}
return result;
}; // $FlowFixMe
var getItemConfigByKey = function getItemConfigByKey(actionTypeId, key, config) {
if ((0, _IX2VanillaPlugins.isPluginType)(actionTypeId)) {
return (0, _IX2VanillaPlugins.getPluginConfig)(actionTypeId)(config, key);
}
switch (actionTypeId) {
case STYLE_FILTER:
{
var filter = (0, _findLast["default"])(config.filters, function (_ref6) {
var type = _ref6.type;
return type === key;
});
return filter ? filter.value : 0;
}
default:
return config[key];
}
}; // $FlowFixMe
exports.getItemConfigByKey = getItemConfigByKey;
function getDestinationValues(_ref7) {
var element = _ref7.element,
actionItem = _ref7.actionItem,
elementApi = _ref7.elementApi;
var actionTypeId = actionItem.actionTypeId;
if ((0, _IX2VanillaPlugins.isPluginType)(actionTypeId)) {
return (0, _IX2VanillaPlugins.getPluginDestination)(actionTypeId)(actionItem.config);
}
switch (actionTypeId) {
case TRANSFORM_MOVE:
case TRANSFORM_SCALE:
case TRANSFORM_ROTATE:
case TRANSFORM_SKEW:
{
var _actionItem$config = actionItem.config,
xValue = _actionItem$config.xValue,
yValue = _actionItem$config.yValue,
zValue = _actionItem$config.zValue;
return {
xValue: xValue,
yValue: yValue,
zValue: zValue
};
}
case STYLE_SIZE:
{
var getStyle = elementApi.getStyle,
setStyle = elementApi.setStyle,
getProperty = elementApi.getProperty;
var _actionItem$config2 = actionItem.config,
widthUnit = _actionItem$config2.widthUnit,
heightUnit = _actionItem$config2.heightUnit;
var _actionItem$config3 = actionItem.config,
widthValue = _actionItem$config3.widthValue,
heightValue = _actionItem$config3.heightValue;
if (!_IX2BrowserSupport.IS_BROWSER_ENV) {
return {
widthValue: widthValue,
heightValue: heightValue
};
}
if (widthUnit === AUTO) {
var temp = getStyle(element, WIDTH);
setStyle(element, WIDTH, '');
widthValue = getProperty(element, 'offsetWidth');
setStyle(element, WIDTH, temp);
}
if (heightUnit === AUTO) {
var _temp = getStyle(element, HEIGHT);
setStyle(element, HEIGHT, '');
heightValue = getProperty(element, 'offsetHeight');
setStyle(element, HEIGHT, _temp);
}
return {
widthValue: widthValue,
heightValue: heightValue
};
}
case STYLE_BACKGROUND_COLOR:
case STYLE_BORDER:
case STYLE_TEXT_COLOR:
{
var _actionItem$config4 = actionItem.config,
rValue = _actionItem$config4.rValue,
gValue = _actionItem$config4.gValue,
bValue = _actionItem$config4.bValue,
aValue = _actionItem$config4.aValue;
return {
rValue: rValue,
gValue: gValue,
bValue: bValue,
aValue: aValue
};
}
case STYLE_FILTER:
{
return actionItem.config.filters.reduce(reduceFilters, {});
}
default:
{
var value = actionItem.config.value;
return {
value: value
};
}
}
} // $FlowFixMe
function getRenderType(actionTypeId) {
if (/^TRANSFORM_/.test(actionTypeId)) {
return RENDER_TRANSFORM;
}
if (/^STYLE_/.test(actionTypeId)) {
return RENDER_STYLE;
}
if (/^GENERAL_/.test(actionTypeId)) {
return RENDER_GENERAL;
}
if (/^PLUGIN_/.test(actionTypeId)) {
return RENDER_PLUGIN;
}
} // $FlowFixMe
function getStyleProp(renderType, actionTypeId) {
return renderType === RENDER_STYLE ? actionTypeId.replace('STYLE_', '').toLowerCase() : null;
}
function renderHTMLElement( // $FlowFixMe
element, // $FlowFixMe
refState, // $FlowFixMe
actionState, // $FlowFixMe
eventId, // $FlowFixMe
actionItem, // $FlowFixMe
styleProp, // $FlowFixMe
elementApi, // $FlowFixMe
renderType, // $FlowFixMe
pluginInstance) {
switch (renderType) {
case RENDER_TRANSFORM:
{
return renderTransform(element, refState, actionState, actionItem, elementApi);
}
case RENDER_STYLE:
{
return renderStyle(element, refState, actionState, actionItem, styleProp, elementApi);
}
case RENDER_GENERAL:
{
return renderGeneral(element, actionItem, elementApi);
}
case RENDER_PLUGIN:
{
var actionTypeId = actionItem.actionTypeId;
if ((0, _IX2VanillaPlugins.isPluginType)(actionTypeId)) {
return (0, _IX2VanillaPlugins.renderPlugin)(actionTypeId)(pluginInstance, refState, actionItem);
}
}
}
}
var transformDefaults = (_transformDefaults = {}, (0, _defineProperty2["default"])(_transformDefaults, TRANSFORM_MOVE, Object.freeze({
xValue: 0,
yValue: 0,
zValue: 0
})), (0, _defineProperty2["default"])(_transformDefaults, TRANSFORM_SCALE, Object.freeze({
xValue: 1,
yValue: 1,
zValue: 1
})), (0, _defineProperty2["default"])(_transformDefaults, TRANSFORM_ROTATE, Object.freeze({
xValue: 0,
yValue: 0,
zValue: 0
})), (0, _defineProperty2["default"])(_transformDefaults, TRANSFORM_SKEW, Object.freeze({
xValue: 0,
yValue: 0
})), _transformDefaults);
var filterDefaults = Object.freeze({
blur: 0,
'hue-rotate': 0,
invert: 0,
grayscale: 0,
saturate: 100,
sepia: 0,
contrast: 100,
brightness: 100
});
var getFilterUnit = function getFilterUnit(filterType, actionItemConfig) {
var filter = (0, _findLast["default"])(actionItemConfig.filters, function (_ref8) {
var type = _ref8.type;
return type === filterType;
});
if (filter && filter.unit) {
return filter.unit;
}
switch (filterType) {
case 'blur':
return 'px';
case 'hue-rotate':
return 'deg';
default:
return '%';
}
};
var transformKeys = Object.keys(transformDefaults);
function renderTransform(element, refState, actionState, actionItem, elementApi) {
var newTransform = transformKeys.map(function (actionTypeId) {
var defaults = transformDefaults[actionTypeId];
var _ref9 = refState[actionTypeId] || {},
_ref9$xValue = _ref9.xValue,
xValue = _ref9$xValue === void 0 ? defaults.xValue : _ref9$xValue,
_ref9$yValue = _ref9.yValue,
yValue = _ref9$yValue === void 0 ? defaults.yValue : _ref9$yValue,
_ref9$zValue = _ref9.zValue,
zValue = _ref9$zValue === void 0 ? defaults.zValue : _ref9$zValue,
_ref9$xUnit = _ref9.xUnit,
xUnit = _ref9$xUnit === void 0 ? '' : _ref9$xUnit,
_ref9$yUnit = _ref9.yUnit,
yUnit = _ref9$yUnit === void 0 ? '' : _ref9$yUnit,
_ref9$zUnit = _ref9.zUnit,
zUnit = _ref9$zUnit === void 0 ? '' : _ref9$zUnit;
switch (actionTypeId) {
case TRANSFORM_MOVE:
return "".concat(TRANSLATE_3D, "(").concat(xValue).concat(xUnit, ", ").concat(yValue).concat(yUnit, ", ").concat(zValue).concat(zUnit, ")");
case TRANSFORM_SCALE:
return "".concat(SCALE_3D, "(").concat(xValue).concat(xUnit, ", ").concat(yValue).concat(yUnit, ", ").concat(zValue).concat(zUnit, ")");
case TRANSFORM_ROTATE:
return "".concat(ROTATE_X, "(").concat(xValue).concat(xUnit, ") ").concat(ROTATE_Y, "(").concat(yValue).concat(yUnit, ") ").concat(ROTATE_Z, "(").concat(zValue).concat(zUnit, ")");
case TRANSFORM_SKEW:
return "".concat(SKEW, "(").concat(xValue).concat(xUnit, ", ").concat(yValue).concat(yUnit, ")");
default:
return '';
}
}).join(' ');
var setStyle = elementApi.setStyle;
addWillChange(element, _IX2BrowserSupport.TRANSFORM_PREFIXED, elementApi);
setStyle(element, _IX2BrowserSupport.TRANSFORM_PREFIXED, newTransform); // Set transform-style: preserve-3d
if (hasDefined3dTransform(actionItem, actionState)) {
setStyle(element, _IX2BrowserSupport.TRANSFORM_STYLE_PREFIXED, PRESERVE_3D);
}
}
function renderFilter(element, actionState, actionItemConfig, elementApi) {
var filterValue = (0, _reduce["default"])(actionState, function (result, value, type) {
return "".concat(result, " ").concat(type, "(").concat(value).concat(getFilterUnit(type, actionItemConfig), ")");
}, '');
var setStyle = elementApi.setStyle;
addWillChange(element, FILTER, elementApi);
setStyle(element, FILTER, filterValue);
}
function hasDefined3dTransform(_ref10, _ref11) {
var actionTypeId = _ref10.actionTypeId;
var xValue = _ref11.xValue,
yValue = _ref11.yValue,
zValue = _ref11.zValue;
return actionTypeId === TRANSFORM_MOVE && zValue !== undefined || // SCALE_Z
actionTypeId === TRANSFORM_SCALE && zValue !== undefined || // ROTATE_X or ROTATE_Y
actionTypeId === TRANSFORM_ROTATE && (xValue !== undefined || yValue !== undefined);
}
var paramCapture = '\\(([^)]+)\\)';
var rgbValidRegex = /^rgb/;
var rgbMatchRegex = RegExp("rgba?".concat(paramCapture));
function getFirstMatch(regex, value) {
var match = regex.exec(value);
return match ? match[1] : '';
}
function parseColor(_ref12) {
var element = _ref12.element,
actionTypeId = _ref12.actionTypeId,
computedStyle = _ref12.computedStyle,
getStyle = _ref12.getStyle;
var prop = colorStyleProps[actionTypeId];
var inlineValue = getStyle(element, prop);
var value = rgbValidRegex.test(inlineValue) ? inlineValue : computedStyle[prop];
var matches = getFirstMatch(rgbMatchRegex, value).split(COMMA_DELIMITER);
return {
rValue: (0, _defaultTo["default"])(parseInt(matches[0], 10), 255),
gValue: (0, _defaultTo["default"])(parseInt(matches[1], 10), 255),
bValue: (0, _defaultTo["default"])(parseInt(matches[2], 10), 255),
aValue: (0, _defaultTo["default"])(parseFloat(matches[3]), 1)
};
}
function renderStyle(element, refState, actionState, actionItem, styleProp, elementApi) {
var setStyle = elementApi.setStyle;
var actionTypeId = actionItem.actionTypeId,
config = actionItem.config;
switch (actionTypeId) {
case STYLE_SIZE:
{
var _actionItem$config5 = actionItem.config,
_actionItem$config5$w = _actionItem$config5.widthUnit,
widthUnit = _actionItem$config5$w === void 0 ? '' : _actionItem$config5$w,
_actionItem$config5$h = _actionItem$config5.heightUnit,
heightUnit = _actionItem$config5$h === void 0 ? '' : _actionItem$config5$h;
var widthValue = actionState.widthValue,
heightValue = actionState.heightValue;
if (widthValue !== undefined) {
if (widthUnit === AUTO) {
widthUnit = 'px';
}
addWillChange(element, WIDTH, elementApi);
setStyle(element, WIDTH, widthValue + widthUnit);
}
if (heightValue !== undefined) {
if (heightUnit === AUTO) {
heightUnit = 'px';
}
addWillChange(element, HEIGHT, elementApi);
setStyle(element, HEIGHT, heightValue + heightUnit);
}
break;
}
case STYLE_FILTER:
{
renderFilter(element, actionState, config, elementApi);
break;
}
case STYLE_BACKGROUND_COLOR:
case STYLE_BORDER:
case STYLE_TEXT_COLOR:
{
var prop = colorStyleProps[actionTypeId];
var rValue = Math.round(actionState.rValue);
var gValue = Math.round(actionState.gValue);
var bValue = Math.round(actionState.bValue);
var aValue = actionState.aValue;
addWillChange(element, prop, elementApi);
setStyle(element, prop, aValue >= 1 ? "rgb(".concat(rValue, ",").concat(gValue, ",").concat(bValue, ")") : "rgba(".concat(rValue, ",").concat(gValue, ",").concat(bValue, ",").concat(aValue, ")"));
break;
}
default:
{
var _config$unit = config.unit,
unit = _config$unit === void 0 ? '' : _config$unit;
addWillChange(element, styleProp, elementApi);
setStyle(element, styleProp, actionState.value + unit);
break;
}
}
}
function renderGeneral(element, actionItem, elementApi) {
var setStyle = elementApi.setStyle;
switch (actionItem.actionTypeId) {
case GENERAL_DISPLAY:
{
var value = actionItem.config.value;
if (value === FLEX && _IX2BrowserSupport.IS_BROWSER_ENV) {
setStyle(element, DISPLAY, _IX2BrowserSupport.FLEX_PREFIXED);
} else {
setStyle(element, DISPLAY, value);
}
return;
}
}
}
function addWillChange(element, prop, elementApi) {
if (!_IX2BrowserSupport.IS_BROWSER_ENV) {
return;
}
var validProp = willChangeProps[prop];
if (!validProp) {
return;
}
var getStyle = elementApi.getStyle,
setStyle = elementApi.setStyle;
var value = getStyle(element, WILL_CHANGE);
if (!value) {
setStyle(element, WILL_CHANGE, validProp);
return;
}
var values = value.split(COMMA_DELIMITER).map(trim);
if (values.indexOf(validProp) === -1) {
setStyle(element, WILL_CHANGE, values.concat(validProp).join(COMMA_DELIMITER));
}
}
function removeWillChange(element, prop, elementApi) {
if (!_IX2BrowserSupport.IS_BROWSER_ENV) {
return;
}
var validProp = willChangeProps[prop];
if (!validProp) {
return;
}
var getStyle = elementApi.getStyle,
setStyle = elementApi.setStyle;
var value = getStyle(element, WILL_CHANGE);
if (!value || value.indexOf(validProp) === -1) {
return;
}
setStyle(element, WILL_CHANGE, value.split(COMMA_DELIMITER).map(trim).filter(function (v) {
return v !== validProp;
}).join(COMMA_DELIMITER));
} // $FlowFixMe
function clearAllStyles(_ref13) {
var store = _ref13.store,
elementApi = _ref13.elementApi;
var _store$getState = store.getState(),
ixData = _store$getState.ixData;
var _ixData$events = ixData.events,
events = _ixData$events === void 0 ? {} : _ixData$events,
_ixData$actionLists = ixData.actionLists,
actionLists = _ixData$actionLists === void 0 ? {} : _ixData$actionLists;
Object.keys(events).forEach(function (eventId) {
var event = events[eventId];
var config = event.action.config;
var actionListId = config.actionListId;
var actionList = actionLists[actionListId];
if (actionList) {
clearActionListStyles({
actionList: actionList,
event: event,
elementApi: elementApi
});
}
});
Object.keys(actionLists).forEach(function (actionListId) {
clearActionListStyles({
actionList: actionLists[actionListId],
elementApi: elementApi
});
});
} // $FlowFixMe
function clearActionListStyles(_ref14) {
var _ref14$actionList = _ref14.actionList,
actionList = _ref14$actionList === void 0 ? {} : _ref14$actionList,
event = _ref14.event,
elementApi = _ref14.elementApi;
var actionItemGroups = actionList.actionItemGroups,
continuousParameterGroups = actionList.continuousParameterGroups;
actionItemGroups && actionItemGroups.forEach(function (actionGroup) {
clearActionGroupStyles({
actionGroup: actionGroup,
event: event,
elementApi: elementApi
});
});
continuousParameterGroups && continuousParameterGroups.forEach(function (paramGroup) {
var continuousActionGroups = paramGroup.continuousActionGroups;
continuousActionGroups.forEach(function (actionGroup) {
clearActionGroupStyles({
actionGroup: actionGroup,
event: event,
elementApi: elementApi
});
});
});
}
function clearActionGroupStyles(_ref15) {
var actionGroup = _ref15.actionGroup,
event = _ref15.event,
elementApi = _ref15.elementApi;
var actionItems = actionGroup.actionItems;
actionItems.forEach(function (_ref16) {
var actionTypeId = _ref16.actionTypeId,
config = _ref16.config;
var clearElement;
if ((0, _IX2VanillaPlugins.isPluginType)(actionTypeId)) {
clearElement = (0, _IX2VanillaPlugins.clearPlugin)(actionTypeId);
} else {
clearElement = processElementByType({
effect: clearStyleProp,
actionTypeId: actionTypeId,
elementApi: elementApi
});
}
getAffectedElements({
config: config,
event: event,
elementApi: elementApi
}).forEach(clearElement);
});
} // $FlowFixMe
function cleanupHTMLElement(element, actionItem, elementApi) {
var setStyle = elementApi.setStyle,
getStyle = elementApi.getStyle;
var actionTypeId = actionItem.actionTypeId;
if (actionTypeId === STYLE_SIZE) {
var config = actionItem.config;
if (config.widthUnit === AUTO) {
setStyle(element, WIDTH, '');
}
if (config.heightUnit === AUTO) {
setStyle(element, HEIGHT, '');
}
}
if (getStyle(element, WILL_CHANGE)) {
processElementByType({
effect: removeWillChange,
actionTypeId: actionTypeId,
elementApi: elementApi
})(element);
}
}
var processElementByType = function processElementByType(_ref17) {
var effect = _ref17.effect,
actionTypeId = _ref17.actionTypeId,
elementApi = _ref17.elementApi;
return function (element) {
switch (actionTypeId) {
case TRANSFORM_MOVE:
case TRANSFORM_SCALE:
case TRANSFORM_ROTATE:
case TRANSFORM_SKEW:
effect(element, _IX2BrowserSupport.TRANSFORM_PREFIXED, elementApi);
break;
case STYLE_FILTER:
effect(element, FILTER, elementApi);
break;
case STYLE_OPACITY:
effect(element, OPACITY, elementApi);
break;
case STYLE_SIZE:
effect(element, WIDTH, elementApi);
effect(element, HEIGHT, elementApi);
break;
case STYLE_BACKGROUND_COLOR:
case STYLE_BORDER:
case STYLE_TEXT_COLOR:
effect(element, colorStyleProps[actionTypeId], elementApi);
break;
case GENERAL_DISPLAY:
effect(element, DISPLAY, elementApi);
break;
}
};
};
function clearStyleProp(element, prop, elementApi) {
var setStyle = elementApi.setStyle;
removeWillChange(element, prop, elementApi);
setStyle(element, prop, ''); // Clear transform-style: preserve-3d
if (prop === _IX2BrowserSupport.TRANSFORM_PREFIXED) {
setStyle(element, _IX2BrowserSupport.TRANSFORM_STYLE_PREFIXED, '');
}
} // $FlowFixMe
function getMaxDurationItemIndex(actionItems) {
var maxDuration = 0;
var resultIndex = 0;
actionItems.forEach(function (actionItem, index) {
var config = actionItem.config;
var total = config.delay + config.duration;
if (total >= maxDuration) {
maxDuration = total;
resultIndex = index;
}
});
return resultIndex;
} // $FlowFixMe
function getActionListProgress(actionList, instance) {
var actionItemGroups = actionList.actionItemGroups,
useFirstGroupAsInitialState = actionList.useFirstGroupAsInitialState;
var instanceItem = instance.actionItem,
_instance$verboseTime = instance.verboseTimeElapsed,
verboseTimeElapsed = _instance$verboseTime === void 0 ? 0 : _instance$verboseTime;
var totalDuration = 0;
var elapsedDuration = 0;
actionItemGroups.forEach(function (group, index) {
if (useFirstGroupAsInitialState && index === 0) {
return;
}
var actionItems = group.actionItems;
var carrierItem = actionItems[getMaxDurationItemIndex(actionItems)];
var config = carrierItem.config,
actionTypeId = carrierItem.actionTypeId;
if (instanceItem.id === carrierItem.id) {
elapsedDuration = totalDuration + verboseTimeElapsed;
}
var duration = getRenderType(actionTypeId) === RENDER_GENERAL ? 0 : config.duration;
totalDuration += config.delay + duration;
});
return totalDuration > 0 ? (0, _IX2EasingUtils.optimizeFloat)(elapsedDuration / totalDuration) : 0;
} // $FlowFixMe
function reduceListToGroup(_ref18) {
var actionList = _ref18.actionList,
actionItemId = _ref18.actionItemId,
rawData = _ref18.rawData;
var actionItemGroups = actionList.actionItemGroups,
continuousParameterGroups = actionList.continuousParameterGroups;
var newActionItems = [];
var takeItemUntilMatch = function takeItemUntilMatch(actionItem) {
newActionItems.push((0, _timm.mergeIn)(actionItem, ['config'], {
delay: 0,
duration: 0
}));
return actionItem.id === actionItemId;
};
actionItemGroups && actionItemGroups.some(function (_ref19) {
var actionItems = _ref19.actionItems;
return actionItems.some(takeItemUntilMatch);
});
continuousParameterGroups && continuousParameterGroups.some(function (paramGroup) {
var continuousActionGroups = paramGroup.continuousActionGroups;
return continuousActionGroups.some(function (_ref20) {
var actionItems = _ref20.actionItems;
return actionItems.some(takeItemUntilMatch);
});
});
return (0, _timm.setIn)(rawData, ['actionLists'], (0, _defineProperty2["default"])({}, actionList.id, {
id: actionList.id,
actionItemGroups: [{
actionItems: newActionItems
}]
}));
} // $FlowFixMe
function shouldNamespaceEventParameter(eventTypeId, _ref22) {
var basedOn = _ref22.basedOn;
return eventTypeId === _constants.EventTypeConsts.SCROLLING_IN_VIEW && (basedOn === _constants.EventBasedOn.ELEMENT || basedOn == null) || eventTypeId === _constants.EventTypeConsts.MOUSE_MOVE && basedOn === _constants.EventBasedOn.ELEMENT;
}
function getNamespacedParameterId(eventStateKey, continuousParameterGroupId) {
var namespacedParameterId = eventStateKey + COLON_DELIMITER + continuousParameterGroupId;
return namespacedParameterId;
} // $FlowFixMe
function shouldAllowMediaQuery(mediaQueries, mediaQueryKey) {
if (mediaQueryKey == null) {
return true;
}
return mediaQueries.indexOf(mediaQueryKey) !== -1;
} // $FlowFixMe
function mediaQueriesEqual(listA, listB) {
return (0, _shallowEqual["default"])(listA && listA.sort(), listB && listB.sort());
} // $FlowFixMe
function stringifyTarget(target) {
if (typeof target === 'string') {
return target;
}
var _target$id = target.id,
id = _target$id === void 0 ? '' : _target$id,
_target$selector = target.selector,
selector = _target$selector === void 0 ? '' : _target$selector,
_target$useEventTarge = target.useEventTarget,
useEventTarget = _target$useEventTarge === void 0 ? '' : _target$useEventTarge;
return id + BAR_DELIMITER + selector + BAR_DELIMITER + useEventTarget;
}
/***/ }),
 (function(module, exports) {
function defaultTo(value, defaultValue) {
return (value == null || value !== value) ? defaultValue : value;
}
module.exports = defaultTo;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayReduce = __webpack_require__(272),
baseEach = __webpack_require__(121),
baseIteratee = __webpack_require__(10),
baseReduce = __webpack_require__(276),
isArray = __webpack_require__(2);
function reduce(collection, iteratee, accumulator) {
var func = isArray(collection) ? arrayReduce : baseReduce,
initAccum = arguments.length < 3;
return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}
module.exports = reduce;
/***/ }),
 (function(module, exports) {
function arrayReduce(array, iteratee, accumulator, initAccum) {
var index = -1,
length = array == null ? 0 : array.length;
if (initAccum && length) {
accumulator = array[++index];
}
while (++index < length) {
accumulator = iteratee(accumulator, array[index], index, array);
}
return accumulator;
}
module.exports = arrayReduce;
/***/ }),
 (function(module, exports, __webpack_require__) {
var createBaseFor = __webpack_require__(274);
var baseFor = createBaseFor();
module.exports = baseFor;
/***/ }),
 (function(module, exports) {
function createBaseFor(fromRight) {
return function(object, iteratee, keysFunc) {
var index = -1,
iterable = Object(object),
props = keysFunc(object),
length = props.length;
while (length--) {
var key = props[fromRight ? length : ++index];
if (iteratee(iterable[key], key, iterable) === false) {
break;
}
}
return object;
};
}
module.exports = createBaseFor;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isArrayLike = __webpack_require__(16);
function createBaseEach(eachFunc, fromRight) {
return function(collection, iteratee) {
if (collection == null) {
return collection;
}
if (!isArrayLike(collection)) {
return eachFunc(collection, iteratee);
}
var length = collection.length,
index = fromRight ? length : -1,
iterable = Object(collection);
while ((fromRight ? index-- : ++index < length)) {
if (iteratee(iterable[index], index, iterable) === false) {
break;
}
}
return collection;
};
}
module.exports = createBaseEach;
/***/ }),
 (function(module, exports) {
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
eachFunc(collection, function(value, index, collection) {
accumulator = initAccum
? (initAccum = false, value)
: iteratee(accumulator, value, index, collection);
});
return accumulator;
}
module.exports = baseReduce;
/***/ }),
 (function(module, exports, __webpack_require__) {
var createFind = __webpack_require__(96),
findLastIndex = __webpack_require__(278);
var findLast = createFind(findLastIndex);
module.exports = findLast;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseFindIndex = __webpack_require__(114),
baseIteratee = __webpack_require__(10),
toInteger = __webpack_require__(115);
var nativeMax = Math.max,
nativeMin = Math.min;
function findLastIndex(array, predicate, fromIndex) {
var length = array == null ? 0 : array.length;
if (!length) {
return -1;
}
var index = length - 1;
if (fromIndex !== undefined) {
index = toInteger(fromIndex);
index = fromIndex < 0
? nativeMax(length + index, 0)
: nativeMin(index, length - 1);
}
return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}
module.exports = findLastIndex;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
var _typeof2 = _interopRequireDefault(__webpack_require__(17));
Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = void 0; // from https://github.com/acdlite/recompose/blob/master/src/packages/recompose/shallowEqual.js
var hasOwnProperty = Object.prototype.hasOwnProperty;
function is(x, y) {
if (x === y) {
return x !== 0 || y !== 0 || 1 / x === 1 / y;
} // Step 6.a: NaN == NaN
return x !== x && y !== y;
}
function shallowEqual(objA, objB) {
if (is(objA, objB)) {
return true;
}
if ((0, _typeof2["default"])(objA) !== 'object' || objA === null || (0, _typeof2["default"])(objB) !== 'object' || objB === null) {
return false;
}
var keysA = Object.keys(objA);
var keysB = Object.keys(objB);
if (keysA.length !== keysB.length) {
return false;
} // Test for A's keys different from B.
for (var i = 0; i < keysA.length; i++) {
if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
return false;
}
}
return true;
}
var _default = shallowEqual;
exports["default"] = _default;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ixInstances = void 0;
var _constants = __webpack_require__(4);
var _shared = __webpack_require__(14);
var _timm = __webpack_require__(22);
var _constants$IX2EngineA = _constants.IX2EngineActionTypes,
IX2_RAW_DATA_IMPORTED = _constants$IX2EngineA.IX2_RAW_DATA_IMPORTED,
IX2_SESSION_STOPPED = _constants$IX2EngineA.IX2_SESSION_STOPPED,
IX2_INSTANCE_ADDED = _constants$IX2EngineA.IX2_INSTANCE_ADDED,
IX2_INSTANCE_STARTED = _constants$IX2EngineA.IX2_INSTANCE_STARTED,
IX2_INSTANCE_REMOVED = _constants$IX2EngineA.IX2_INSTANCE_REMOVED,
IX2_ANIMATION_FRAME_CHANGED = _constants$IX2EngineA.IX2_ANIMATION_FRAME_CHANGED;
var _shared$IX2EasingUtil = _shared.IX2EasingUtils,
optimizeFloat = _shared$IX2EasingUtil.optimizeFloat,
applyEasing = _shared$IX2EasingUtil.applyEasing,
createBezierEasing = _shared$IX2EasingUtil.createBezierEasing;
var RENDER_GENERAL = _constants.IX2EngineConstants.RENDER_GENERAL;
var _shared$IX2VanillaUti = _shared.IX2VanillaUtils,
getItemConfigByKey = _shared$IX2VanillaUti.getItemConfigByKey,
getRenderType = _shared$IX2VanillaUti.getRenderType,
getStyleProp = _shared$IX2VanillaUti.getStyleProp;
var continuousInstance = function continuousInstance(state, action) {
var lastPosition = state.position,
parameterId = state.parameterId,
actionGroups = state.actionGroups,
destinationKeys = state.destinationKeys,
smoothing = state.smoothing,
restingValue = state.restingValue,
actionTypeId = state.actionTypeId,
customEasingFn = state.customEasingFn,
skipMotion = state.skipMotion,
skipToValue = state.skipToValue;
var parameters = action.payload.parameters;
var velocity = Math.max(1 - smoothing, 0.01);
var paramValue = parameters[parameterId];
if (paramValue == null) {
velocity = 1;
paramValue = restingValue;
}
var nextPosition = Math.max(paramValue, 0) || 0;
var positionDiff = optimizeFloat(nextPosition - lastPosition);
var position = skipMotion ? skipToValue : optimizeFloat(lastPosition + positionDiff * velocity);
var keyframePosition = position * 100;
if (position === lastPosition && state.current) {
return state;
}
var fromActionItem;
var toActionItem;
var positionOffset;
var positionRange;
for (var i = 0, length = actionGroups.length; i < length; i++) {
var _actionGroups$i = actionGroups[i],
keyframe = _actionGroups$i.keyframe,
actionItems = _actionGroups$i.actionItems;
if (i === 0) {
fromActionItem = actionItems[0];
}
if (keyframePosition >= keyframe) {
fromActionItem = actionItems[0];
var nextGroup = actionGroups[i + 1];
var hasNextItem = nextGroup && keyframePosition !== keyframe;
toActionItem = hasNextItem ? nextGroup.actionItems[0] : null;
if (hasNextItem) {
positionOffset = keyframe / 100;
positionRange = (nextGroup.keyframe - keyframe) / 100;
}
}
}
var current = {};
if (fromActionItem && !toActionItem) {
for (var _i = 0, _length = destinationKeys.length; _i < _length; _i++) {
var key = destinationKeys[_i];
current[key] = getItemConfigByKey(actionTypeId, key, fromActionItem.config);
}
} else if (fromActionItem && toActionItem && positionOffset !== undefined && positionRange !== undefined) {
var localPosition = (position - positionOffset) / positionRange;
var easing = fromActionItem.config.easing;
var eased = applyEasing(easing, localPosition, customEasingFn);
for (var _i2 = 0, _length2 = destinationKeys.length; _i2 < _length2; _i2++) {
var _key = destinationKeys[_i2];
var fromVal = getItemConfigByKey(actionTypeId, _key, fromActionItem.config);
var toVal = getItemConfigByKey(actionTypeId, _key, toActionItem.config); // $FlowFixMe — toVal and fromVal could potentially be null, need to update type higher to determine number
var diff = toVal - fromVal; // $FlowFixMe
var value = diff * eased + fromVal;
current[_key] = value;
}
}
return (0, _timm.merge)(state, {
position: position,
current: current
});
};
var timedInstance = function timedInstance(state, action) {
var _state = state,
active = _state.active,
origin = _state.origin,
start = _state.start,
immediate = _state.immediate,
renderType = _state.renderType,
verbose = _state.verbose,
actionItem = _state.actionItem,
destination = _state.destination,
destinationKeys = _state.destinationKeys,
pluginDuration = _state.pluginDuration,
instanceDelay = _state.instanceDelay,
customEasingFn = _state.customEasingFn,
skipMotion = _state.skipMotion;
var easing = actionItem.config.easing;
var _actionItem$config = actionItem.config,
duration = _actionItem$config.duration,
delay = _actionItem$config.delay;
if (pluginDuration != null) {
duration = pluginDuration;
}
delay = instanceDelay != null ? instanceDelay : delay;
if (renderType === RENDER_GENERAL) {
duration = 0;
} else if (immediate || skipMotion) {
duration = delay = 0;
}
var now = action.payload.now;
if (active && origin) {
var delta = now - (start + delay);
if (verbose) {
var verboseDelta = now - start;
var verboseDuration = duration + delay;
var verbosePosition = optimizeFloat(Math.min(Math.max(0, verboseDelta / verboseDuration), 1));
state = (0, _timm.set)(state, 'verboseTimeElapsed', verboseDuration * verbosePosition);
}
if (delta < 0) {
return state;
}
var position = optimizeFloat(Math.min(Math.max(0, delta / duration), 1));
var eased = applyEasing(easing, position, customEasingFn);
var newProps = {};
var current = null;
if (destinationKeys.length) {
current = destinationKeys.reduce(function (result, key) {
var destValue = destination[key];
var originVal = parseFloat(origin[key]) || 0;
var diff = parseFloat(destValue) - originVal;
var value = diff * eased + originVal;
result[key] = value;
return result;
}, {});
}
newProps.current = current;
newProps.position = position;
if (position === 1) {
newProps.active = false;
newProps.complete = true;
}
return (0, _timm.merge)(state, newProps);
}
return state;
};
var ixInstances = function ixInstances() {
var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Object.freeze({});
var action = arguments.length > 1 ? arguments[1] : undefined;
switch (action.type) {
case IX2_RAW_DATA_IMPORTED:
{
return action.payload.ixInstances || Object.freeze({});
}
case IX2_SESSION_STOPPED:
{
return Object.freeze({});
}
case IX2_INSTANCE_ADDED:
{
var _action$payload = action.payload,
instanceId = _action$payload.instanceId,
elementId = _action$payload.elementId,
actionItem = _action$payload.actionItem,
eventId = _action$payload.eventId,
eventTarget = _action$payload.eventTarget,
eventStateKey = _action$payload.eventStateKey,
actionListId = _action$payload.actionListId,
groupIndex = _action$payload.groupIndex,
isCarrier = _action$payload.isCarrier,
origin = _action$payload.origin,
destination = _action$payload.destination,
immediate = _action$payload.immediate,
verbose = _action$payload.verbose,
continuous = _action$payload.continuous,
parameterId = _action$payload.parameterId,
actionGroups = _action$payload.actionGroups,
smoothing = _action$payload.smoothing,
restingValue = _action$payload.restingValue,
pluginInstance = _action$payload.pluginInstance,
pluginDuration = _action$payload.pluginDuration,
instanceDelay = _action$payload.instanceDelay,
skipMotion = _action$payload.skipMotion,
skipToValue = _action$payload.skipToValue;
var actionTypeId = actionItem.actionTypeId;
var renderType = getRenderType(actionTypeId);
var styleProp = getStyleProp(renderType, actionTypeId);
var destinationKeys = Object.keys(destination).filter(function (key) {
return destination[key] != null;
});
var easing = actionItem.config.easing;
return (0, _timm.set)(state, instanceId, {
id: instanceId,
elementId: elementId,
active: false,
position: 0,
start: 0,
origin: origin,
destination: destination,
destinationKeys: destinationKeys,
immediate: immediate,
verbose: verbose,
current: null,
actionItem: actionItem,
actionTypeId: actionTypeId,
eventId: eventId,
eventTarget: eventTarget,
eventStateKey: eventStateKey,
actionListId: actionListId,
groupIndex: groupIndex,
renderType: renderType,
isCarrier: isCarrier,
styleProp: styleProp,
continuous: continuous,
parameterId: parameterId,
actionGroups: actionGroups,
smoothing: smoothing,
restingValue: restingValue,
pluginInstance: pluginInstance,
pluginDuration: pluginDuration,
instanceDelay: instanceDelay,
skipMotion: skipMotion,
skipToValue: skipToValue,
customEasingFn: Array.isArray(easing) && easing.length === 4 ? createBezierEasing(easing) : undefined
});
}
case IX2_INSTANCE_STARTED:
{
var _action$payload2 = action.payload,
_instanceId = _action$payload2.instanceId,
time = _action$payload2.time;
return (0, _timm.mergeIn)(state, [_instanceId], {
active: true,
complete: false,
start: time
});
}
case IX2_INSTANCE_REMOVED:
{
var _instanceId2 = action.payload.instanceId;
if (!state[_instanceId2]) {
return state;
}
var newState = {};
var keys = Object.keys(state);
var length = keys.length;
for (var i = 0; i < length; i++) {
var key = keys[i];
if (key !== _instanceId2) {
newState[key] = state[key];
}
}
return newState;
}
case IX2_ANIMATION_FRAME_CHANGED:
{
var _newState = state;
var _keys = Object.keys(state);
var _length3 = _keys.length;
for (var _i3 = 0; _i3 < _length3; _i3++) {
var _key2 = _keys[_i3];
var instance = state[_key2];
var reducer = instance.continuous ? continuousInstance : timedInstance;
_newState = (0, _timm.set)(_newState, _key2, reducer(instance, action));
}
return _newState;
}
default:
{
return state;
}
}
};
exports.ixInstances = ixInstances;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.ixParameters = void 0;
var _constants = __webpack_require__(4);
var _constants$IX2EngineA = _constants.IX2EngineActionTypes,
IX2_RAW_DATA_IMPORTED = _constants$IX2EngineA.IX2_RAW_DATA_IMPORTED,
IX2_SESSION_STOPPED = _constants$IX2EngineA.IX2_SESSION_STOPPED,
IX2_PARAMETER_CHANGED = _constants$IX2EngineA.IX2_PARAMETER_CHANGED; // prettier-ignore
var ixParameters = function ixParameters() {
var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
};
var action = arguments.length > 1 ? arguments[1] : undefined;
switch (action.type) {
case IX2_RAW_DATA_IMPORTED:
{
return action.payload.ixParameters || {
};
}
case IX2_SESSION_STOPPED:
{
return {
};
}
case IX2_PARAMETER_CHANGED:
{
var _action$payload = action.payload,
key = _action$payload.key,
value = _action$payload.value;
state[key] = value;
return state;
}
default:
{
return state;
}
}
};
exports.ixParameters = ixParameters;
/***/ }),
 (function(module, exports) {
function _objectWithoutPropertiesLoose(source, excluded) {
if (source == null) return {};
var target = {};
var sourceKeys = Object.keys(source);
var key, i;
for (i = 0; i < sourceKeys.length; i++) {
key = sourceKeys[i];
if (excluded.indexOf(key) >= 0) continue;
target[key] = source[key];
}
return target;
}
module.exports = _objectWithoutPropertiesLoose;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseKeys = __webpack_require__(57),
getTag = __webpack_require__(59),
isArrayLike = __webpack_require__(16),
isString = __webpack_require__(284),
stringSize = __webpack_require__(285);
var mapTag = '[object Map]',
setTag = '[object Set]';
function size(collection) {
if (collection == null) {
return 0;
}
if (isArrayLike(collection)) {
return isString(collection) ? stringSize(collection) : collection.length;
}
var tag = getTag(collection);
if (tag == mapTag || tag == setTag) {
return collection.size;
}
return baseKeys(collection).length;
}
module.exports = size;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetTag = __webpack_require__(15),
isArray = __webpack_require__(2),
isObjectLike = __webpack_require__(12);
var stringTag = '[object String]';
function isString(value) {
return typeof value == 'string' ||
(!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}
module.exports = isString;
/***/ }),
 (function(module, exports, __webpack_require__) {
var asciiSize = __webpack_require__(286),
hasUnicode = __webpack_require__(287),
unicodeSize = __webpack_require__(288);
function stringSize(string) {
return hasUnicode(string)
? unicodeSize(string)
: asciiSize(string);
}
module.exports = stringSize;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseProperty = __webpack_require__(113);
var asciiSize = baseProperty('length');
module.exports = asciiSize;
/***/ }),
 (function(module, exports) {
var rsAstralRange = '\\ud800-\\udfff',
rsComboMarksRange = '\\u0300-\\u036f',
reComboHalfMarksRange = '\\ufe20-\\ufe2f',
rsComboSymbolsRange = '\\u20d0-\\u20ff',
rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
rsVarRange = '\\ufe0e\\ufe0f';
var rsZWJ = '\\u200d';
/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');
function hasUnicode(string) {
return reHasUnicode.test(string);
}
module.exports = hasUnicode;
/***/ }),
 (function(module, exports) {
var rsAstralRange = '\\ud800-\\udfff',
rsComboMarksRange = '\\u0300-\\u036f',
reComboHalfMarksRange = '\\ufe20-\\ufe2f',
rsComboSymbolsRange = '\\u20d0-\\u20ff',
rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
rsVarRange = '\\ufe0e\\ufe0f';
var rsAstral = '[' + rsAstralRange + ']',
rsCombo = '[' + rsComboRange + ']',
rsFitz = '\\ud83c[\\udffb-\\udfff]',
rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
rsNonAstral = '[^' + rsAstralRange + ']',
rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
rsZWJ = '\\u200d';
var reOptMod = rsModifier + '?',
rsOptVar = '[' + rsVarRange + ']?',
rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
rsSeq = rsOptVar + reOptMod + rsOptJoin,
rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
function unicodeSize(string) {
var result = reUnicode.lastIndex = 0;
while (reUnicode.test(string)) {
++result;
}
return result;
}
module.exports = unicodeSize;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseIteratee = __webpack_require__(10),
negate = __webpack_require__(290),
pickBy = __webpack_require__(291);
function omitBy(object, predicate) {
return pickBy(object, negate(baseIteratee(predicate)));
}
module.exports = omitBy;
/***/ }),
 (function(module, exports) {
var FUNC_ERROR_TEXT = 'Expected a function';
function negate(predicate) {
if (typeof predicate != 'function') {
throw new TypeError(FUNC_ERROR_TEXT);
}
return function() {
var args = arguments;
switch (args.length) {
case 0: return !predicate.call(this);
case 1: return !predicate.call(this, args[0]);
case 2: return !predicate.call(this, args[0], args[1]);
case 3: return !predicate.call(this, args[0], args[1], args[2]);
}
return !predicate.apply(this, args);
};
}
module.exports = negate;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayMap = __webpack_require__(112),
baseIteratee = __webpack_require__(10),
basePickBy = __webpack_require__(292),
getAllKeysIn = __webpack_require__(295);
function pickBy(object, predicate) {
if (object == null) {
return {};
}
var props = arrayMap(getAllKeysIn(object), function(prop) {
return [prop];
});
predicate = baseIteratee(predicate);
return basePickBy(object, props, function(value, path) {
return predicate(value, path[0]);
});
}
module.exports = pickBy;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGet = __webpack_require__(61),
baseSet = __webpack_require__(293),
castPath = __webpack_require__(38);
function basePickBy(object, paths, predicate) {
var index = -1,
length = paths.length,
result = {};
while (++index < length) {
var path = paths[index],
value = baseGet(object, path);
if (predicate(value, path)) {
baseSet(result, castPath(path, object), value);
}
}
return result;
}
module.exports = basePickBy;
/***/ }),
 (function(module, exports, __webpack_require__) {
var assignValue = __webpack_require__(294),
castPath = __webpack_require__(38),
isIndex = __webpack_require__(54),
isObject = __webpack_require__(8),
toKey = __webpack_require__(24);
function baseSet(object, path, value, customizer) {
if (!isObject(object)) {
return object;
}
path = castPath(path, object);
var index = -1,
length = path.length,
lastIndex = length - 1,
nested = object;
while (nested != null && ++index < length) {
var key = toKey(path[index]),
newValue = value;
if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
return object;
}
if (index != lastIndex) {
var objValue = nested[key];
newValue = customizer ? customizer(objValue, key, nested) : undefined;
if (newValue === undefined) {
newValue = isObject(objValue)
? objValue
: (isIndex(path[index + 1]) ? [] : {});
}
}
assignValue(nested, key, newValue);
nested = nested[key];
}
return object;
}
module.exports = baseSet;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseAssignValue = __webpack_require__(124),
eq = __webpack_require__(49);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function assignValue(object, key, value) {
var objValue = object[key];
if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
(value === undefined && !(key in object))) {
baseAssignValue(object, key, value);
}
}
module.exports = assignValue;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseGetAllKeys = __webpack_require__(103),
getSymbolsIn = __webpack_require__(296),
keysIn = __webpack_require__(298);
function getAllKeysIn(object) {
return baseGetAllKeys(object, keysIn, getSymbolsIn);
}
module.exports = getAllKeysIn;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayPush = __webpack_require__(52),
getPrototype = __webpack_require__(297),
getSymbols = __webpack_require__(104),
stubArray = __webpack_require__(105);
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
var result = [];
while (object) {
arrayPush(result, getSymbols(object));
object = getPrototype(object);
}
return result;
};
module.exports = getSymbolsIn;
/***/ }),
 (function(module, exports, __webpack_require__) {
var overArg = __webpack_require__(108);
var getPrototype = overArg(Object.getPrototypeOf, Object);
module.exports = getPrototype;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayLikeKeys = __webpack_require__(106),
baseKeysIn = __webpack_require__(299),
isArrayLike = __webpack_require__(16);
function keysIn(object) {
return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
module.exports = keysIn;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(8),
isPrototype = __webpack_require__(58),
nativeKeysIn = __webpack_require__(300);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseKeysIn(object) {
if (!isObject(object)) {
return nativeKeysIn(object);
}
var isProto = isPrototype(object),
result = [];
for (var key in object) {
if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
result.push(key);
}
}
return result;
}
module.exports = baseKeysIn;
/***/ }),
 (function(module, exports) {
function nativeKeysIn(object) {
var result = [];
if (object != null) {
for (var key in Object(object)) {
result.push(key);
}
}
return result;
}
module.exports = nativeKeysIn;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseKeys = __webpack_require__(57),
getTag = __webpack_require__(59),
isArguments = __webpack_require__(37),
isArray = __webpack_require__(2),
isArrayLike = __webpack_require__(16),
isBuffer = __webpack_require__(53),
isPrototype = __webpack_require__(58),
isTypedArray = __webpack_require__(55);
var mapTag = '[object Map]',
setTag = '[object Set]';
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function isEmpty(value) {
if (value == null) {
return true;
}
if (isArrayLike(value) &&
(isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
isBuffer(value) || isTypedArray(value) || isArguments(value))) {
return !value.length;
}
var tag = getTag(value);
if (tag == mapTag || tag == setTag) {
return !value.size;
}
if (isPrototype(value)) {
return !baseKeys(value).length;
}
for (var key in value) {
if (hasOwnProperty.call(value, key)) {
return false;
}
}
return true;
}
module.exports = isEmpty;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseAssignValue = __webpack_require__(124),
baseForOwn = __webpack_require__(122),
baseIteratee = __webpack_require__(10);
function mapValues(object, iteratee) {
var result = {};
iteratee = baseIteratee(iteratee, 3);
baseForOwn(object, function(value, key, object) {
baseAssignValue(result, key, iteratee(value, key, object));
});
return result;
}
module.exports = mapValues;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayEach = __webpack_require__(304),
baseEach = __webpack_require__(121),
castFunction = __webpack_require__(305),
isArray = __webpack_require__(2);
function forEach(collection, iteratee) {
var func = isArray(collection) ? arrayEach : baseEach;
return func(collection, castFunction(iteratee));
}
module.exports = forEach;
/***/ }),
 (function(module, exports) {
function arrayEach(array, iteratee) {
var index = -1,
length = array == null ? 0 : array.length;
while (++index < length) {
if (iteratee(array[index], index, array) === false) {
break;
}
}
return array;
}
module.exports = arrayEach;
/***/ }),
 (function(module, exports, __webpack_require__) {
var identity = __webpack_require__(63);
function castFunction(value) {
return typeof value == 'function' ? value : identity;
}
module.exports = castFunction;
/***/ }),
 (function(module, exports, __webpack_require__) {
var debounce = __webpack_require__(307),
isObject = __webpack_require__(8);
var FUNC_ERROR_TEXT = 'Expected a function';
function throttle(func, wait, options) {
var leading = true,
trailing = true;
if (typeof func != 'function') {
throw new TypeError(FUNC_ERROR_TEXT);
}
if (isObject(options)) {
leading = 'leading' in options ? !!options.leading : leading;
trailing = 'trailing' in options ? !!options.trailing : trailing;
}
return debounce(func, wait, {
'leading': leading,
'maxWait': wait,
'trailing': trailing
});
}
module.exports = throttle;
/***/ }),
 (function(module, exports, __webpack_require__) {
var isObject = __webpack_require__(8),
now = __webpack_require__(308),
toNumber = __webpack_require__(64);
var FUNC_ERROR_TEXT = 'Expected a function';
var nativeMax = Math.max,
nativeMin = Math.min;
function debounce(func, wait, options) {
var lastArgs,
lastThis,
maxWait,
result,
timerId,
lastCallTime,
lastInvokeTime = 0,
leading = false,
maxing = false,
trailing = true;
if (typeof func != 'function') {
throw new TypeError(FUNC_ERROR_TEXT);
}
wait = toNumber(wait) || 0;
if (isObject(options)) {
leading = !!options.leading;
maxing = 'maxWait' in options;
maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
trailing = 'trailing' in options ? !!options.trailing : trailing;
}
function invokeFunc(time) {
var args = lastArgs,
thisArg = lastThis;
lastArgs = lastThis = undefined;
lastInvokeTime = time;
result = func.apply(thisArg, args);
return result;
}
function leadingEdge(time) {
lastInvokeTime = time;
timerId = setTimeout(timerExpired, wait);
return leading ? invokeFunc(time) : result;
}
function remainingWait(time) {
var timeSinceLastCall = time - lastCallTime,
timeSinceLastInvoke = time - lastInvokeTime,
timeWaiting = wait - timeSinceLastCall;
return maxing
? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
: timeWaiting;
}
function shouldInvoke(time) {
var timeSinceLastCall = time - lastCallTime,
timeSinceLastInvoke = time - lastInvokeTime;
return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
(timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
}
function timerExpired() {
var time = now();
if (shouldInvoke(time)) {
return trailingEdge(time);
}
timerId = setTimeout(timerExpired, remainingWait(time));
}
function trailingEdge(time) {
timerId = undefined;
if (trailing && lastArgs) {
return invokeFunc(time);
}
lastArgs = lastThis = undefined;
return result;
}
function cancel() {
if (timerId !== undefined) {
clearTimeout(timerId);
}
lastInvokeTime = 0;
lastArgs = lastCallTime = lastThis = timerId = undefined;
}
function flush() {
return timerId === undefined ? result : trailingEdge(now());
}
function debounced() {
var time = now(),
isInvoking = shouldInvoke(time);
lastArgs = arguments;
lastThis = this;
lastCallTime = time;
if (isInvoking) {
if (timerId === undefined) {
return leadingEdge(lastCallTime);
}
if (maxing) {
clearTimeout(timerId);
timerId = setTimeout(timerExpired, wait);
return invokeFunc(lastCallTime);
}
}
if (timerId === undefined) {
timerId = setTimeout(timerExpired, wait);
}
return result;
}
debounced.cancel = cancel;
debounced.flush = flush;
return debounced;
}
module.exports = debounce;
/***/ }),
 (function(module, exports, __webpack_require__) {
var root = __webpack_require__(6);
var now = function() {
return root.Date.now();
};
module.exports = now;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
var _typeof2 = _interopRequireDefault(__webpack_require__(17));
Object.defineProperty(exports, "__esModule", {
value: true
});
exports.setStyle = setStyle;
exports.getStyle = getStyle;
exports.getProperty = getProperty;
exports.matchSelector = matchSelector;
exports.getQuerySelector = getQuerySelector;
exports.getValidDocument = getValidDocument;
exports.queryDocument = queryDocument;
exports.elementContains = elementContains;
exports.isSiblingNode = isSiblingNode;
exports.getChildElements = getChildElements;
exports.getSiblingElements = getSiblingElements;
exports.getRefType = getRefType;
exports.getClosestElement = void 0;
var _shared = __webpack_require__(14);
var _constants = __webpack_require__(4);
var ELEMENT_MATCHES = _shared.IX2BrowserSupport.ELEMENT_MATCHES;
var _constants$IX2EngineC = _constants.IX2EngineConstants,
IX2_ID_DELIMITER = _constants$IX2EngineC.IX2_ID_DELIMITER,
HTML_ELEMENT = _constants$IX2EngineC.HTML_ELEMENT,
PLAIN_OBJECT = _constants$IX2EngineC.PLAIN_OBJECT,
WF_PAGE = _constants$IX2EngineC.WF_PAGE;
function setStyle(element, prop, value) {
element.style[prop] = value;
}
function getStyle(element, prop) {
return element.style[prop];
}
function getProperty(element, prop) {
return element[prop];
}
function matchSelector(selector) {
return function (element) {
return element[ELEMENT_MATCHES](selector);
};
}
function getQuerySelector(_ref) {
var id = _ref.id,
selector = _ref.selector;
if (id) {
var nodeId = id;
if (id.indexOf(IX2_ID_DELIMITER) !== -1) {
var pair = id.split(IX2_ID_DELIMITER);
var pageId = pair[0];
nodeId = pair[1]; // Short circuit query if we're on the wrong page
if (pageId !== document.documentElement.getAttribute(WF_PAGE)) {
return null;
}
}
return "[data-w-id=\"".concat(nodeId, "\"], [data-w-id^=\"").concat(nodeId, "_instance\"]");
}
return selector;
}
function getValidDocument(pageId) {
if (pageId == null || // $FlowIgnore — if documentElement is null crash
pageId === document.documentElement.getAttribute(WF_PAGE)) {
return document;
}
return null;
}
function queryDocument(baseSelector, descendantSelector) {
return Array.prototype.slice.call(document.querySelectorAll(descendantSelector ? baseSelector + ' ' + descendantSelector : baseSelector));
}
function elementContains(parent, child) {
return parent.contains(child);
}
function isSiblingNode(a, b) {
return a !== b && a.parentNode === b.parentNode;
}
function getChildElements(sourceElements) {
var childElements = [];
for (var i = 0, _ref2 = sourceElements || [], length = _ref2.length; i < length; i++) {
var children = sourceElements[i].children;
var childCount = children.length;
if (!childCount) {
continue;
}
for (var j = 0; j < childCount; j++) {
childElements.push(children[j]);
}
}
return childElements;
} // $FlowFixMe
function getSiblingElements() {
var sourceElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
var elements = [];
var parentCache = [];
for (var i = 0, length = sourceElements.length; i < length; i++) {
var parentNode = sourceElements[i].parentNode;
if (!parentNode || !parentNode.children || !parentNode.children.length) {
continue;
}
if (parentCache.indexOf(parentNode) !== -1) {
continue;
}
parentCache.push(parentNode);
var el = parentNode.firstElementChild;
while (el != null) {
if (sourceElements.indexOf(el) === -1) {
elements.push(el);
}
el = el.nextElementSibling;
}
}
return elements;
}
var getClosestElement = Element.prototype.closest ? function (element, selector) {
if (!document.documentElement.contains(element)) {
return null;
}
return element.closest(selector);
} : function (element, selector) {
if (!document.documentElement.contains(element)) {
return null;
}
var el = element;
do {
if (el[ELEMENT_MATCHES] && el[ELEMENT_MATCHES](selector)) {
return el;
}
el = el.parentNode;
} while (el != null);
return null;
};
exports.getClosestElement = getClosestElement;
function getRefType(ref) {
if (ref != null && (0, _typeof2["default"])(ref) == 'object') {
return ref instanceof Element ? HTML_ELEMENT : PLAIN_OBJECT;
}
return null;
}
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault2 = __webpack_require__(1);
var _defineProperty2 = _interopRequireDefault2(__webpack_require__(21));
var _typeof2 = _interopRequireDefault2(__webpack_require__(17));
var _default2;
var _interopRequireDefault = __webpack_require__(1);
Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(__webpack_require__(31));
var _flow = _interopRequireDefault(__webpack_require__(311));
var _get = _interopRequireDefault(__webpack_require__(60));
var _clamp = _interopRequireDefault(__webpack_require__(330));
var _constants = __webpack_require__(4);
var _IX2VanillaEngine = __webpack_require__(123);
var _IX2EngineActions = __webpack_require__(65);
var _shared = __webpack_require__(14);
var _constants$EventTypeC = _constants.EventTypeConsts,
MOUSE_CLICK = _constants$EventTypeC.MOUSE_CLICK,
MOUSE_SECOND_CLICK = _constants$EventTypeC.MOUSE_SECOND_CLICK,
MOUSE_DOWN = _constants$EventTypeC.MOUSE_DOWN,
MOUSE_UP = _constants$EventTypeC.MOUSE_UP,
MOUSE_OVER = _constants$EventTypeC.MOUSE_OVER,
MOUSE_OUT = _constants$EventTypeC.MOUSE_OUT,
DROPDOWN_CLOSE = _constants$EventTypeC.DROPDOWN_CLOSE,
DROPDOWN_OPEN = _constants$EventTypeC.DROPDOWN_OPEN,
SLIDER_ACTIVE = _constants$EventTypeC.SLIDER_ACTIVE,
SLIDER_INACTIVE = _constants$EventTypeC.SLIDER_INACTIVE,
TAB_ACTIVE = _constants$EventTypeC.TAB_ACTIVE,
TAB_INACTIVE = _constants$EventTypeC.TAB_INACTIVE,
NAVBAR_CLOSE = _constants$EventTypeC.NAVBAR_CLOSE,
NAVBAR_OPEN = _constants$EventTypeC.NAVBAR_OPEN,
MOUSE_MOVE = _constants$EventTypeC.MOUSE_MOVE,
PAGE_SCROLL_DOWN = _constants$EventTypeC.PAGE_SCROLL_DOWN,
SCROLL_INTO_VIEW = _constants$EventTypeC.SCROLL_INTO_VIEW,
SCROLL_OUT_OF_VIEW = _constants$EventTypeC.SCROLL_OUT_OF_VIEW,
PAGE_SCROLL_UP = _constants$EventTypeC.PAGE_SCROLL_UP,
SCROLLING_IN_VIEW = _constants$EventTypeC.SCROLLING_IN_VIEW,
PAGE_FINISH = _constants$EventTypeC.PAGE_FINISH,
ECOMMERCE_CART_CLOSE = _constants$EventTypeC.ECOMMERCE_CART_CLOSE,
ECOMMERCE_CART_OPEN = _constants$EventTypeC.ECOMMERCE_CART_OPEN,
PAGE_START = _constants$EventTypeC.PAGE_START,
PAGE_SCROLL = _constants$EventTypeC.PAGE_SCROLL;
var COMPONENT_ACTIVE = 'COMPONENT_ACTIVE';
var COMPONENT_INACTIVE = 'COMPONENT_INACTIVE';
var COLON_DELIMITER = _constants.IX2EngineConstants.COLON_DELIMITER;
var getNamespacedParameterId = _shared.IX2VanillaUtils.getNamespacedParameterId;
var composableFilter = function composableFilter(predicate) {
return function (options) {
if ((0, _typeof2["default"])(options) === 'object' && predicate(options)) {
return true;
}
return options;
};
};
var isElement = composableFilter(function (_ref) {
var element = _ref.element,
nativeEvent = _ref.nativeEvent;
return element === nativeEvent.target;
});
var containsElement = composableFilter(function (_ref2) {
var element = _ref2.element,
nativeEvent = _ref2.nativeEvent;
return element.contains(nativeEvent.target);
});
var isOrContainsElement = (0, _flow["default"])([isElement, containsElement]);
var getAutoStopEvent = function getAutoStopEvent(store, autoStopEventId) {
if (autoStopEventId) {
var _store$getState = store.getState(),
ixData = _store$getState.ixData;
var events = ixData.events;
var eventToStop = events[autoStopEventId];
if (eventToStop && !AUTO_STOP_DISABLED_EVENTS[eventToStop.eventTypeId]) {
return eventToStop;
}
}
return null;
};
var hasAutoStopEvent = function hasAutoStopEvent(_ref3) {
var store = _ref3.store,
event = _ref3.event;
var eventAction = event.action;
var autoStopEventId = eventAction.config.autoStopEventId;
return Boolean(getAutoStopEvent(store, autoStopEventId));
};
var actionGroupCreator = function actionGroupCreator(_ref4, state) {
var store = _ref4.store,
event = _ref4.event,
element = _ref4.element,
eventStateKey = _ref4.eventStateKey;
var eventAction = event.action,
eventId = event.id;
var _eventAction$config = eventAction.config,
actionListId = _eventAction$config.actionListId,
autoStopEventId = _eventAction$config.autoStopEventId;
var eventToStop = getAutoStopEvent(store, autoStopEventId);
if (eventToStop) {
(0, _IX2VanillaEngine.stopActionGroup)({
store: store,
eventId: autoStopEventId,
eventTarget: element,
eventStateKey: autoStopEventId + COLON_DELIMITER + eventStateKey.split(COLON_DELIMITER)[1],
actionListId: (0, _get["default"])(eventToStop, 'action.config.actionListId')
});
}
(0, _IX2VanillaEngine.stopActionGroup)({
store: store,
eventId: eventId,
eventTarget: element,
eventStateKey: eventStateKey,
actionListId: actionListId
});
(0, _IX2VanillaEngine.startActionGroup)({
store: store,
eventId: eventId,
eventTarget: element,
eventStateKey: eventStateKey,
actionListId: actionListId
});
return state;
}; // $FlowFixMe
var withFilter = function withFilter(filter, handler) {
return function (options, state) {
return (// $FlowFixMe
filter(options, state) === true ? handler(options, state) : state
);
};
};
var baseActionGroupOptions = {
handler: withFilter(isOrContainsElement, actionGroupCreator)
};
var baseActivityActionGroupOptions = (0, _extends2["default"])({}, baseActionGroupOptions, {
types: [COMPONENT_ACTIVE, COMPONENT_INACTIVE].join(' ')
});
var SCROLL_EVENT_TYPES = [{
target: window,
types: 'resize orientationchange',
throttle: true
}, {
target: document,
types: 'scroll wheel readystatechange IX2_PAGE_UPDATE',
throttle: true
}];
var MOUSE_OVER_OUT_TYPES = 'mouseover mouseout';
var baseScrollActionGroupOptions = {
types: SCROLL_EVENT_TYPES
};
var AUTO_STOP_DISABLED_EVENTS = {
PAGE_START: PAGE_START,
PAGE_FINISH: PAGE_FINISH
};
var getDocumentState = function () {
var supportOffset = window.pageXOffset !== undefined;
var isCSS1Compat = document.compatMode === 'CSS1Compat';
var rootElement = isCSS1Compat ? document.documentElement : document.body;
return function () {
return {
scrollLeft: supportOffset ? window.pageXOffset : rootElement.scrollLeft,
scrollTop: supportOffset ? window.pageYOffset : rootElement.scrollTop,
stiffScrollTop: (0, _clamp["default"])( // $FlowFixMe
supportOffset ? window.pageYOffset : rootElement.scrollTop, 0, // $FlowFixMe
rootElement.scrollHeight - window.innerHeight),
scrollWidth: rootElement.scrollWidth,
scrollHeight: rootElement.scrollHeight,
clientWidth: rootElement.clientWidth,
clientHeight: rootElement.clientHeight,
innerWidth: window.innerWidth,
innerHeight: window.innerHeight
};
};
}();
var areBoxesIntersecting = function areBoxesIntersecting(a, b) {
return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
};
var isElementHovered = function isElementHovered(_ref5) {
var element = _ref5.element,
nativeEvent = _ref5.nativeEvent;
var type = nativeEvent.type,
target = nativeEvent.target,
relatedTarget = nativeEvent.relatedTarget;
var containsTarget = element.contains(target);
if (type === 'mouseover' && containsTarget) {
return true;
}
var containsRelated = element.contains(relatedTarget);
if (type === 'mouseout' && containsTarget && containsRelated) {
return true;
}
return false;
};
var isElementVisible = function isElementVisible(options) {
var element = options.element,
config = options.event.config;
var _getDocumentState = getDocumentState(),
clientWidth = _getDocumentState.clientWidth,
clientHeight = _getDocumentState.clientHeight;
var scrollOffsetValue = config.scrollOffsetValue;
var scrollOffsetUnit = config.scrollOffsetUnit;
var isPX = scrollOffsetUnit === 'PX';
var offsetPadding = isPX ? scrollOffsetValue : clientHeight * (scrollOffsetValue || 0) / 100;
return areBoxesIntersecting(element.getBoundingClientRect(), {
left: 0,
top: offsetPadding,
right: clientWidth,
bottom: clientHeight - offsetPadding
});
};
var whenComponentActiveChange = function whenComponentActiveChange(handler) {
return function (options, oldState) {
var type = options.nativeEvent.type; // prettier-ignore
var isActive = [COMPONENT_ACTIVE, COMPONENT_INACTIVE].indexOf(type) !== -1 ? type === COMPONENT_ACTIVE : oldState.isActive;
var newState = (0, _extends2["default"])({}, oldState, {
isActive: isActive
});
if (!oldState || newState.isActive !== oldState.isActive) {
return handler(options, newState) || newState;
}
return newState;
};
};
var whenElementHoverChange = function whenElementHoverChange(handler) {
return function (options, oldState) {
var newState = {
elementHovered: isElementHovered(options)
};
if (oldState ? newState.elementHovered !== oldState.elementHovered : newState.elementHovered) {
return handler(options, newState) || newState;
}
return newState;
};
}; // $FlowFixMe
var whenElementVisibiltyChange = function whenElementVisibiltyChange(handler) {
return function (options, oldState) {
var newState = (0, _extends2["default"])({}, oldState, {
elementVisible: isElementVisible(options)
});
if (oldState ? newState.elementVisible !== oldState.elementVisible : newState.elementVisible) {
return handler(options, newState) || newState;
}
return newState;
};
}; // $FlowFixMe
var whenScrollDirectionChange = function whenScrollDirectionChange(handler) {
return function (options) {
var oldState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
var _getDocumentState2 = getDocumentState(),
scrollTop = _getDocumentState2.stiffScrollTop,
scrollHeight = _getDocumentState2.scrollHeight,
innerHeight = _getDocumentState2.innerHeight;
var _options$event = options.event,
config = _options$event.config,
eventTypeId = _options$event.eventTypeId;
var scrollOffsetValue = config.scrollOffsetValue,
scrollOffsetUnit = config.scrollOffsetUnit;
var isPX = scrollOffsetUnit === 'PX';
var scrollHeightBounds = scrollHeight - innerHeight; // percent top since innerHeight may change for mobile devices which also changes the scrollTop value.
var percentTop = Number((scrollTop / scrollHeightBounds).toFixed(2)); // no state change
if (oldState && oldState.percentTop === percentTop) {
return oldState;
}
var scrollTopPadding = (isPX ? scrollOffsetValue : innerHeight * (scrollOffsetValue || 0) / 100) / scrollHeightBounds;
var scrollingDown;
var scrollDirectionChanged;
var anchorTop = 0;
if (oldState) {
scrollingDown = percentTop > oldState.percentTop;
scrollDirectionChanged = oldState.scrollingDown !== scrollingDown;
anchorTop = scrollDirectionChanged ? percentTop : oldState.anchorTop;
}
var inBounds = eventTypeId === PAGE_SCROLL_DOWN ? percentTop >= anchorTop + scrollTopPadding : percentTop <= anchorTop - scrollTopPadding;
var newState = (0, _extends2["default"])({}, oldState, {
percentTop: percentTop,
inBounds: inBounds,
anchorTop: anchorTop,
scrollingDown: scrollingDown
});
if (oldState && inBounds && (scrollDirectionChanged || newState.inBounds !== oldState.inBounds)) {
return handler(options, newState) || newState;
}
return newState;
};
};
var pointIntersects = function pointIntersects(point, rect) {
return point.left > rect.left && point.left < rect.right && point.top > rect.top && point.top < rect.bottom;
};
var whenPageLoadFinish = function whenPageLoadFinish(handler) {
return function (options, oldState) {
var newState = {
finished: document.readyState === 'complete'
};
if (newState.finished && !(oldState && oldState.finshed)) {
handler(options);
}
return newState;
};
};
var whenPageLoadStart = function whenPageLoadStart(handler) {
return function (options, oldState) {
var newState = {
started: true
};
if (!oldState) {
handler(options);
}
return newState;
};
};
var whenClickCountChange = function whenClickCountChange(handler) {
return function (options) {
var oldState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
clickCount: 0
};
var newState = {
clickCount: oldState.clickCount % 2 + 1
};
if (newState.clickCount !== oldState.clickCount) {
return handler(options, newState) || newState;
}
return newState;
};
};
var getComponentActiveOptions = function getComponentActiveOptions() {
var allowNestedChildrenEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
return (0, _extends2["default"])({}, baseActivityActionGroupOptions, {
handler: withFilter(allowNestedChildrenEvents ? isOrContainsElement : isElement, whenComponentActiveChange(function (options, state) {
return state.isActive ? baseActionGroupOptions.handler(options, state) : state;
}))
});
};
var getComponentInactiveOptions = function getComponentInactiveOptions() {
var allowNestedChildrenEvents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
return (0, _extends2["default"])({}, baseActivityActionGroupOptions, {
handler: withFilter(allowNestedChildrenEvents ? isOrContainsElement : isElement, whenComponentActiveChange(function (options, state) {
return !state.isActive ? baseActionGroupOptions.handler(options, state) : state;
}))
});
};
var scrollIntoOutOfViewOptions = (0, _extends2["default"])({}, baseScrollActionGroupOptions, {
handler: whenElementVisibiltyChange(function (options, state) {
var elementVisible = state.elementVisible;
var event = options.event,
store = options.store;
var _store$getState2 = store.getState(),
ixData = _store$getState2.ixData;
var events = ixData.events; // trigger the handler only once if only one of SCROLL_INTO or SCROLL_OUT_OF event types
if (!events[event.action.config.autoStopEventId] && state.triggered) {
return state;
}
if (event.eventTypeId === SCROLL_INTO_VIEW === elementVisible) {
actionGroupCreator(options);
return (0, _extends2["default"])({}, state, {
triggered: true
});
} else {
return state;
}
})
});
var MOUSE_OUT_ROUND_THRESHOLD = 0.05;
var _default = (_default2 = {}, (0, _defineProperty2["default"])(_default2, SLIDER_ACTIVE, getComponentActiveOptions()), (0, _defineProperty2["default"])(_default2, SLIDER_INACTIVE, getComponentInactiveOptions()), (0, _defineProperty2["default"])(_default2, DROPDOWN_OPEN, getComponentActiveOptions()), (0, _defineProperty2["default"])(_default2, DROPDOWN_CLOSE, getComponentInactiveOptions()), (0, _defineProperty2["default"])(_default2, NAVBAR_OPEN, getComponentActiveOptions(false)), (0, _defineProperty2["default"])(_default2, NAVBAR_CLOSE, getComponentInactiveOptions(false)), (0, _defineProperty2["default"])(_default2, TAB_ACTIVE, getComponentActiveOptions()), (0, _defineProperty2["default"])(_default2, TAB_INACTIVE, getComponentInactiveOptions()), (0, _defineProperty2["default"])(_default2, ECOMMERCE_CART_OPEN, {
types: 'ecommerce-cart-open',
handler: withFilter(isOrContainsElement, actionGroupCreator)
}), (0, _defineProperty2["default"])(_default2, ECOMMERCE_CART_CLOSE, {
types: 'ecommerce-cart-close',
handler: withFilter(isOrContainsElement, actionGroupCreator)
}), (0, _defineProperty2["default"])(_default2, MOUSE_CLICK, {
types: 'click',
handler: withFilter(isOrContainsElement, whenClickCountChange(function (options, _ref6) {
var clickCount = _ref6.clickCount;
if (hasAutoStopEvent(options)) {
clickCount === 1 && actionGroupCreator(options);
} else {
actionGroupCreator(options);
}
}))
}), (0, _defineProperty2["default"])(_default2, MOUSE_SECOND_CLICK, {
types: 'click',
handler: withFilter(isOrContainsElement, whenClickCountChange(function (options, _ref7) {
var clickCount = _ref7.clickCount;
if (clickCount === 2) {
actionGroupCreator(options);
}
}))
}), (0, _defineProperty2["default"])(_default2, MOUSE_DOWN, (0, _extends2["default"])({}, baseActionGroupOptions, {
types: 'mousedown'
})), (0, _defineProperty2["default"])(_default2, MOUSE_UP, (0, _extends2["default"])({}, baseActionGroupOptions, {
types: 'mouseup'
})), (0, _defineProperty2["default"])(_default2, MOUSE_OVER, {
types: MOUSE_OVER_OUT_TYPES,
handler: withFilter(isOrContainsElement, whenElementHoverChange(function (options, state) {
if (state.elementHovered) {
actionGroupCreator(options);
}
}))
}), (0, _defineProperty2["default"])(_default2, MOUSE_OUT, {
types: MOUSE_OVER_OUT_TYPES,
handler: withFilter(isOrContainsElement, whenElementHoverChange(function (options, state) {
if (!state.elementHovered) {
actionGroupCreator(options);
}
}))
}), (0, _defineProperty2["default"])(_default2, MOUSE_MOVE, {
types: 'mousemove mouseout scroll',
handler: function handler( // $FlowFixMe
_ref8) {
var store = _ref8.store,
element = _ref8.element,
eventConfig = _ref8.eventConfig,
nativeEvent = _ref8.nativeEvent,
eventStateKey = _ref8.eventStateKey;
var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
clientX: 0,
clientY: 0,
pageX: 0,
pageY: 0
};
var basedOn = eventConfig.basedOn,
selectedAxis = eventConfig.selectedAxis,
continuousParameterGroupId = eventConfig.continuousParameterGroupId,
reverse = eventConfig.reverse,
_eventConfig$restingS = eventConfig.restingState,
restingState = _eventConfig$restingS === void 0 ? 0 : _eventConfig$restingS;
var _nativeEvent$clientX = nativeEvent.clientX,
clientX = _nativeEvent$clientX === void 0 ? state.clientX : _nativeEvent$clientX,
_nativeEvent$clientY = nativeEvent.clientY,
clientY = _nativeEvent$clientY === void 0 ? state.clientY : _nativeEvent$clientY,
_nativeEvent$pageX = nativeEvent.pageX,
pageX = _nativeEvent$pageX === void 0 ? state.pageX : _nativeEvent$pageX,
_nativeEvent$pageY = nativeEvent.pageY,
pageY = _nativeEvent$pageY === void 0 ? state.pageY : _nativeEvent$pageY;
var isXAxis = selectedAxis === 'X_AXIS';
var isMouseOut = nativeEvent.type === 'mouseout';
var value = restingState / 100;
var namespacedParameterId = continuousParameterGroupId;
var elementHovered = false;
switch (basedOn) {
case _constants.EventBasedOn.VIEWPORT:
{
value = isXAxis ? Math.min(clientX, window.innerWidth) / window.innerWidth : Math.min(clientY, window.innerHeight) / window.innerHeight;
break;
}
case _constants.EventBasedOn.PAGE:
{
var _getDocumentState3 = getDocumentState(),
scrollLeft = _getDocumentState3.scrollLeft,
scrollTop = _getDocumentState3.scrollTop,
scrollWidth = _getDocumentState3.scrollWidth,
scrollHeight = _getDocumentState3.scrollHeight;
value = isXAxis ? Math.min(scrollLeft + pageX, scrollWidth) / scrollWidth : Math.min(scrollTop + pageY, scrollHeight) / scrollHeight;
break;
}
case _constants.EventBasedOn.ELEMENT:
default:
{
namespacedParameterId = getNamespacedParameterId(eventStateKey, continuousParameterGroupId);
var isMouseEvent = nativeEvent.type.indexOf('mouse') === 0; // Use isOrContainsElement for mouse events since they are fired from the target
if (isMouseEvent && isOrContainsElement({
element: element,
nativeEvent: nativeEvent
}) !== true) {
break;
}
var rect = element.getBoundingClientRect();
var left = rect.left,
top = rect.top,
width = rect.width,
height = rect.height; // Otherwise we'll need to calculate the mouse position from the previous handler state
if (!isMouseEvent && !pointIntersects({
left: clientX,
top: clientY
}, rect)) {
break;
}
elementHovered = true;
value = isXAxis ? (clientX - left) / width : (clientY - top) / height;
break;
}
} // cover case where the event is a mouse out, but the value is not quite at 100%
if (isMouseOut && (value > 1 - MOUSE_OUT_ROUND_THRESHOLD || value < MOUSE_OUT_ROUND_THRESHOLD)) {
value = Math.round(value);
} // Only update based on element if the mouse is moving over or has just left the element
if (basedOn !== _constants.EventBasedOn.ELEMENT || elementHovered || // $FlowFixMe
elementHovered !== state.elementHovered) {
value = reverse ? 1 - value : value;
store.dispatch((0, _IX2EngineActions.parameterChanged)(namespacedParameterId, value));
}
return {
elementHovered: elementHovered,
clientX: clientX,
clientY: clientY,
pageX: pageX,
pageY: pageY
};
}
}), (0, _defineProperty2["default"])(_default2, PAGE_SCROLL, {
types: SCROLL_EVENT_TYPES,
handler: function handler(_ref9) {
var store = _ref9.store,
eventConfig = _ref9.eventConfig;
var continuousParameterGroupId = eventConfig.continuousParameterGroupId,
reverse = eventConfig.reverse;
var _getDocumentState4 = getDocumentState(),
scrollTop = _getDocumentState4.scrollTop,
scrollHeight = _getDocumentState4.scrollHeight,
clientHeight = _getDocumentState4.clientHeight;
var value = scrollTop / (scrollHeight - clientHeight);
value = reverse ? 1 - value : value;
store.dispatch((0, _IX2EngineActions.parameterChanged)(continuousParameterGroupId, value));
}
}), (0, _defineProperty2["default"])(_default2, SCROLLING_IN_VIEW, {
types: SCROLL_EVENT_TYPES,
handler: function handler( // $FlowFixMe
_ref10) {
var element = _ref10.element,
store = _ref10.store,
eventConfig = _ref10.eventConfig,
eventStateKey = _ref10.eventStateKey;
var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
scrollPercent: 0
};
var _getDocumentState5 = getDocumentState(),
scrollLeft = _getDocumentState5.scrollLeft,
scrollTop = _getDocumentState5.scrollTop,
scrollWidth = _getDocumentState5.scrollWidth,
scrollHeight = _getDocumentState5.scrollHeight,
visibleHeight = _getDocumentState5.clientHeight;
var basedOn = eventConfig.basedOn,
selectedAxis = eventConfig.selectedAxis,
continuousParameterGroupId = eventConfig.continuousParameterGroupId,
startsEntering = eventConfig.startsEntering,
startsExiting = eventConfig.startsExiting,
addEndOffset = eventConfig.addEndOffset,
addStartOffset = eventConfig.addStartOffset,
_eventConfig$addOffse = eventConfig.addOffsetValue,
addOffsetValue = _eventConfig$addOffse === void 0 ? 0 : _eventConfig$addOffse,
_eventConfig$endOffse = eventConfig.endOffsetValue,
endOffsetValue = _eventConfig$endOffse === void 0 ? 0 : _eventConfig$endOffse;
var isXAxis = selectedAxis === 'X_AXIS';
if (basedOn === _constants.EventBasedOn.VIEWPORT) {
var value = isXAxis ? scrollLeft / scrollWidth : scrollTop / scrollHeight;
if (value !== state.scrollPercent) {
store.dispatch((0, _IX2EngineActions.parameterChanged)(continuousParameterGroupId, value));
}
return {
scrollPercent: value
};
} else {
var namespacedParameterId = getNamespacedParameterId(eventStateKey, continuousParameterGroupId);
var elementRect = element.getBoundingClientRect();
var offsetStartPerc = (addStartOffset ? addOffsetValue : 0) / 100;
var offsetEndPerc = (addEndOffset ? endOffsetValue : 0) / 100; // flip the offset percentages depending on start / exit type
offsetStartPerc = startsEntering ? offsetStartPerc : 1 - offsetStartPerc;
offsetEndPerc = startsExiting ? offsetEndPerc : 1 - offsetEndPerc;
var offsetElementTop = elementRect.top + Math.min(elementRect.height * offsetStartPerc, visibleHeight);
var offsetElementBottom = elementRect.top + elementRect.height * offsetEndPerc;
var offsetHeight = offsetElementBottom - offsetElementTop;
var fixedScrollHeight = Math.min(visibleHeight + offsetHeight, scrollHeight);
var fixedScrollTop = Math.min(Math.max(0, visibleHeight - offsetElementTop), fixedScrollHeight);
var fixedScrollPerc = fixedScrollTop / fixedScrollHeight;
if (fixedScrollPerc !== state.scrollPercent) {
store.dispatch((0, _IX2EngineActions.parameterChanged)(namespacedParameterId, fixedScrollPerc));
}
return {
scrollPercent: fixedScrollPerc
};
}
}
}), (0, _defineProperty2["default"])(_default2, SCROLL_INTO_VIEW, scrollIntoOutOfViewOptions), (0, _defineProperty2["default"])(_default2, SCROLL_OUT_OF_VIEW, scrollIntoOutOfViewOptions), (0, _defineProperty2["default"])(_default2, PAGE_SCROLL_DOWN, (0, _extends2["default"])({}, baseScrollActionGroupOptions, {
handler: whenScrollDirectionChange(function (options, state) {
if (state.scrollingDown) {
actionGroupCreator(options);
}
})
})), (0, _defineProperty2["default"])(_default2, PAGE_SCROLL_UP, (0, _extends2["default"])({}, baseScrollActionGroupOptions, {
handler: whenScrollDirectionChange(function (options, state) {
if (!state.scrollingDown) {
actionGroupCreator(options);
}
})
})), (0, _defineProperty2["default"])(_default2, PAGE_FINISH, {
types: 'readystatechange IX2_PAGE_UPDATE',
handler: withFilter(isElement, whenPageLoadFinish(actionGroupCreator))
}), (0, _defineProperty2["default"])(_default2, PAGE_START, {
types: 'readystatechange IX2_PAGE_UPDATE',
handler: withFilter(isElement, whenPageLoadStart(actionGroupCreator))
}), _default2);
exports["default"] = _default;
/***/ }),
 (function(module, exports, __webpack_require__) {
var createFlow = __webpack_require__(312);
var flow = createFlow();
module.exports = flow;
/***/ }),
 (function(module, exports, __webpack_require__) {
var LodashWrapper = __webpack_require__(66),
flatRest = __webpack_require__(313),
getData = __webpack_require__(127),
getFuncName = __webpack_require__(128),
isArray = __webpack_require__(2),
isLaziable = __webpack_require__(326);
var FUNC_ERROR_TEXT = 'Expected a function';
var WRAP_CURRY_FLAG = 8,
WRAP_PARTIAL_FLAG = 32,
WRAP_ARY_FLAG = 128,
WRAP_REARG_FLAG = 256;
function createFlow(fromRight) {
return flatRest(function(funcs) {
var length = funcs.length,
index = length,
prereq = LodashWrapper.prototype.thru;
if (fromRight) {
funcs.reverse();
}
while (index--) {
var func = funcs[index];
if (typeof func != 'function') {
throw new TypeError(FUNC_ERROR_TEXT);
}
if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
var wrapper = new LodashWrapper([], true);
}
}
index = wrapper ? index : length;
while (++index < length) {
func = funcs[index];
var funcName = getFuncName(func),
data = funcName == 'wrapper' ? getData(func) : undefined;
if (data && isLaziable(data[0]) &&
data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
!data[4].length && data[9] == 1
) {
wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
} else {
wrapper = (func.length == 1 && isLaziable(func))
? wrapper[funcName]()
: wrapper.thru(func);
}
}
return function() {
var args = arguments,
value = args[0];
if (wrapper && args.length == 1 && isArray(value)) {
return wrapper.plant(value).value();
}
var index = 0,
result = length ? funcs[index].apply(this, args) : value;
while (++index < length) {
result = funcs[index].call(this, result);
}
return result;
};
});
}
module.exports = createFlow;
/***/ }),
 (function(module, exports, __webpack_require__) {
var flatten = __webpack_require__(314),
overRest = __webpack_require__(317),
setToString = __webpack_require__(319);
function flatRest(func) {
return setToString(overRest(func, undefined, flatten), func + '');
}
module.exports = flatRest;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseFlatten = __webpack_require__(315);
function flatten(array) {
var length = array == null ? 0 : array.length;
return length ? baseFlatten(array, 1) : [];
}
module.exports = flatten;
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayPush = __webpack_require__(52),
isFlattenable = __webpack_require__(316);
function baseFlatten(array, depth, predicate, isStrict, result) {
var index = -1,
length = array.length;
predicate || (predicate = isFlattenable);
result || (result = []);
while (++index < length) {
var value = array[index];
if (depth > 0 && predicate(value)) {
if (depth > 1) {
baseFlatten(value, depth - 1, predicate, isStrict, result);
} else {
arrayPush(result, value);
}
} else if (!isStrict) {
result[result.length] = value;
}
}
return result;
}
module.exports = baseFlatten;
/***/ }),
 (function(module, exports, __webpack_require__) {
var Symbol = __webpack_require__(23),
isArguments = __webpack_require__(37),
isArray = __webpack_require__(2);
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
function isFlattenable(value) {
return isArray(value) || isArguments(value) ||
!!(spreadableSymbol && value && value[spreadableSymbol]);
}
module.exports = isFlattenable;
/***/ }),
 (function(module, exports, __webpack_require__) {
var apply = __webpack_require__(318);
var nativeMax = Math.max;
function overRest(func, start, transform) {
start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
return function() {
var args = arguments,
index = -1,
length = nativeMax(args.length - start, 0),
array = Array(length);
while (++index < length) {
array[index] = args[start + index];
}
index = -1;
var otherArgs = Array(start + 1);
while (++index < start) {
otherArgs[index] = args[index];
}
otherArgs[start] = transform(array);
return apply(func, this, otherArgs);
};
}
module.exports = overRest;
/***/ }),
 (function(module, exports) {
function apply(func, thisArg, args) {
switch (args.length) {
case 0: return func.call(thisArg);
case 1: return func.call(thisArg, args[0]);
case 2: return func.call(thisArg, args[0], args[1]);
case 3: return func.call(thisArg, args[0], args[1], args[2]);
}
return func.apply(thisArg, args);
}
module.exports = apply;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseSetToString = __webpack_require__(320),
shortOut = __webpack_require__(322);
var setToString = shortOut(baseSetToString);
module.exports = setToString;
/***/ }),
 (function(module, exports, __webpack_require__) {
var constant = __webpack_require__(321),
defineProperty = __webpack_require__(125),
identity = __webpack_require__(63);
var baseSetToString = !defineProperty ? identity : function(func, string) {
return defineProperty(func, 'toString', {
'configurable': true,
'enumerable': false,
'value': constant(string),
'writable': true
});
};
module.exports = baseSetToString;
/***/ }),
 (function(module, exports) {
function constant(value) {
return function() {
return value;
};
}
module.exports = constant;
/***/ }),
 (function(module, exports) {
var HOT_COUNT = 800,
HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
var count = 0,
lastCalled = 0;
return function() {
var stamp = nativeNow(),
remaining = HOT_SPAN - (stamp - lastCalled);
lastCalled = stamp;
if (remaining > 0) {
if (++count >= HOT_COUNT) {
return arguments[0];
}
} else {
count = 0;
}
return func.apply(undefined, arguments);
};
}
module.exports = shortOut;
/***/ }),
 (function(module, exports, __webpack_require__) {
var WeakMap = __webpack_require__(109);
var metaMap = WeakMap && new WeakMap;
module.exports = metaMap;
/***/ }),
 (function(module, exports) {
function noop() {
}
module.exports = noop;
/***/ }),
 (function(module, exports) {
var realNames = {};
module.exports = realNames;
/***/ }),
 (function(module, exports, __webpack_require__) {
var LazyWrapper = __webpack_require__(68),
getData = __webpack_require__(127),
getFuncName = __webpack_require__(128),
lodash = __webpack_require__(327);
function isLaziable(func) {
var funcName = getFuncName(func),
other = lodash[funcName];
if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
return false;
}
if (func === other) {
return true;
}
var data = getData(other);
return !!data && func === data[0];
}
module.exports = isLaziable;
/***/ }),
 (function(module, exports, __webpack_require__) {
var LazyWrapper = __webpack_require__(68),
LodashWrapper = __webpack_require__(66),
baseLodash = __webpack_require__(67),
isArray = __webpack_require__(2),
isObjectLike = __webpack_require__(12),
wrapperClone = __webpack_require__(328);
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function lodash(value) {
if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
if (value instanceof LodashWrapper) {
return value;
}
if (hasOwnProperty.call(value, '__wrapped__')) {
return wrapperClone(value);
}
}
return new LodashWrapper(value);
}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
module.exports = lodash;
/***/ }),
 (function(module, exports, __webpack_require__) {
var LazyWrapper = __webpack_require__(68),
LodashWrapper = __webpack_require__(66),
copyArray = __webpack_require__(329);
function wrapperClone(wrapper) {
if (wrapper instanceof LazyWrapper) {
return wrapper.clone();
}
var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
result.__actions__ = copyArray(wrapper.__actions__);
result.__index__  = wrapper.__index__;
result.__values__ = wrapper.__values__;
return result;
}
module.exports = wrapperClone;
/***/ }),
 (function(module, exports) {
function copyArray(source, array) {
var index = -1,
length = source.length;
array || (array = Array(length));
while (++index < length) {
array[index] = source[index];
}
return array;
}
module.exports = copyArray;
/***/ }),
 (function(module, exports, __webpack_require__) {
var baseClamp = __webpack_require__(331),
toNumber = __webpack_require__(64);
function clamp(number, lower, upper) {
if (upper === undefined) {
upper = lower;
lower = undefined;
}
if (upper !== undefined) {
upper = toNumber(upper);
upper = upper === upper ? upper : 0;
}
if (lower !== undefined) {
lower = toNumber(lower);
lower = lower === lower ? lower : 0;
}
return baseClamp(toNumber(number), lower, upper);
}
module.exports = clamp;
/***/ }),
 (function(module, exports) {
function baseClamp(number, lower, upper) {
if (number === number) {
if (upper !== undefined) {
number = number <= upper ? number : upper;
}
if (lower !== undefined) {
number = number >= lower ? number : lower;
}
}
return number;
}
module.exports = baseClamp;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
Webflow.define('links', module.exports = function ($, _) {
var api = {};
var $win = $(window);
var designer;
var inApp = Webflow.env();
var location = window.location;
var tempLink = document.createElement('a');
var linkCurrent = 'w--current';
var indexPage = /index\.(html|php)$/;
var dirList = /\/$/;
var anchors;
var slug; // -----------------------------------
api.ready = api.design = api.preview = init; // -----------------------------------
function init() {
designer = inApp && Webflow.env('design');
slug = Webflow.env('slug') || location.pathname || ''; // Reset scroll listener, init anchors
Webflow.scroll.off(scroll);
anchors = []; // Test all links for a selectable href
var links = document.links;
for (var i = 0; i < links.length; ++i) {
select(links[i]);
} // Listen for scroll if any anchors exist
if (anchors.length) {
Webflow.scroll.on(scroll);
scroll();
}
}
function select(link) {
var href = designer && link.getAttribute('href-disabled') || link.getAttribute('href');
tempLink.href = href; // Ignore any hrefs with a colon to safely avoid all uri schemes
if (href.indexOf(':') >= 0) {
return;
}
var $link = $(link); // Check for all links with hash (eg (this-host)(/this-path)#section) to this page
if (tempLink.hash.length > 1 && tempLink.host + tempLink.pathname === location.host + location.pathname) {
if (!/^#[a-zA-Z0-9\-\_]+$/.test(tempLink.hash)) {
return;
}
var $section = $(tempLink.hash);
$section.length && anchors.push({
link: $link,
sec: $section,
active: false
});
return;
} // Ignore empty # links
if (href === '#' || href === '') {
return;
} // Determine whether the link should be selected
var match = tempLink.href === location.href || href === slug || indexPage.test(href) && dirList.test(slug);
setClass($link, linkCurrent, match);
}
function scroll() {
var viewTop = $win.scrollTop();
var viewHeight = $win.height(); // Check each anchor for a section in view
_.each(anchors, function (anchor) {
var $link = anchor.link;
var $section = anchor.sec;
var top = $section.offset().top;
var height = $section.outerHeight();
var offset = viewHeight * 0.5;
var active = $section.is(':visible') && top + height - offset >= viewTop && top + offset <= viewTop + viewHeight;
if (anchor.active === active) {
return;
}
anchor.active = active;
setClass($link, linkCurrent, active);
});
}
function setClass($elem, className, add) {
var exists = $elem.hasClass(className);
if (add && exists) {
return;
}
if (!add && !exists) {
return;
}
add ? $elem.addClass(className) : $elem.removeClass(className);
} // Export module
return api;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
Webflow.define('scroll', module.exports = function ($) {
/**
* A collection of namespaced events found in this module.
* Namespaced events encapsulate our code, and make it safer and easier
* for designers to apply custom code overrides.
* @see https://api.jquery.com/on/#event-names
* @typedef {Object.<string>} NamespacedEventsCollection
*/
var NS_EVENTS = {
WF_CLICK_EMPTY: 'click.wf-empty-link',
WF_CLICK_SCROLL: 'click.wf-scroll'
};
var loc = window.location;
var history = inIframe() ? null : window.history;
var $win = $(window);
var $doc = $(document);
var $body = $(document.body);
var animate = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
window.setTimeout(fn, 15);
};
var rootTag = Webflow.env('editor') ? '.w-editor-body' : 'body';
var headerSelector = 'header, ' + rootTag + ' > .header, ' + rootTag + ' > .w-nav:not([data-no-scroll])';
var emptyHrefSelector = 'a[href="#"]';
var localHrefSelector = 'a[href*="#"]:not(.w-tab-link):not(' + emptyHrefSelector + ')';
var scrollTargetOutlineCSS = '.wf-force-outline-none[tabindex="-1"]:focus{outline:none;}';
var focusStylesEl = document.createElement('style');
focusStylesEl.appendChild(document.createTextNode(scrollTargetOutlineCSS));
function inIframe() {
try {
return Boolean(window.frameElement);
} catch (e) {
return true;
}
}
var validHash = /^#[a-zA-Z0-9][\w:.-]*$/;
function linksToCurrentPage(link) {
return validHash.test(link.hash) && link.host + link.pathname === loc.host + loc.pathname;
}
var reducedMotionMediaQuery = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)');
function reducedMotionEnabled() {
return document.body.getAttribute('data-wf-scroll-motion') === 'none' || reducedMotionMediaQuery.matches;
}
function setFocusable($el, action) {
var initialTabindex;
switch (action) {
case 'add':
initialTabindex = $el.attr('tabindex');
if (initialTabindex) {
$el.attr('data-wf-tabindex-swap', initialTabindex);
} else {
$el.attr('tabindex', '-1');
}
break;
case 'remove':
initialTabindex = $el.attr('data-wf-tabindex-swap');
if (initialTabindex) {
$el.attr('tabindex', initialTabindex);
$el.removeAttr('data-wf-tabindex-swap');
} else {
$el.removeAttr('tabindex');
}
break;
}
$el.toggleClass('wf-force-outline-none', action === 'add');
}
function validateScroll(evt) {
var target = evt.currentTarget;
if ( // Bail if in Designer
Webflow.env('design') || // Ignore links being used by jQuery mobile
window.$.mobile && /(?:^|\s)ui-link(?:$|\s)/.test(target.className)) {
return;
}
var hash = linksToCurrentPage(target) ? target.hash : '';
if (hash === '') return;
var $el = $(hash);
if (!$el.length) {
return;
}
if (evt) {
evt.preventDefault();
evt.stopPropagation();
}
updateHistory(hash, evt);
window.setTimeout(function () {
scroll($el, function setFocus() {
setFocusable($el, 'add');
$el.get(0).focus({
preventScroll: true
});
setFocusable($el, 'remove');
});
}, evt ? 0 : 300);
}
function updateHistory(hash) {
if (loc.hash !== hash && history && history.pushState && // Navigation breaks Chrome when the protocol is `file:`.
!(Webflow.env.chrome && loc.protocol === 'file:')) {
var oldHash = history.state && history.state.hash;
if (oldHash !== hash) {
history.pushState({
hash: hash
}, '', hash);
}
}
}
function scroll($targetEl, cb) {
var start = $win.scrollTop();
var end = calculateScrollEndPosition($targetEl);
if (start === end) return;
var duration = calculateScrollDuration($targetEl, start, end);
var clock = Date.now();
var step = function step() {
var elapsed = Date.now() - clock;
window.scroll(0, getY(start, end, elapsed, duration));
if (elapsed <= duration) {
animate(step);
} else if (typeof cb === 'function') {
cb();
}
};
animate(step);
}
function calculateScrollEndPosition($targetEl) {
var $header = $(headerSelector);
var offsetY = $header.css('position') === 'fixed' ? $header.outerHeight() : 0;
var end = $targetEl.offset().top - offsetY; // If specified, scroll so that the element ends up in the middle of the viewport
if ($targetEl.data('scroll') === 'mid') {
var available = $win.height() - offsetY;
var elHeight = $targetEl.outerHeight();
if (elHeight < available) {
end -= Math.round((available - elHeight) / 2);
}
}
return end;
}
function calculateScrollDuration($targetEl, start, end) {
if (reducedMotionEnabled()) return 0;
var mult = 1; // Check for custom time multiplier on the body and the scroll target
$body.add($targetEl).each(function (_, el) {
var time = parseFloat(el.getAttribute('data-scroll-time'));
if (!isNaN(time) && time >= 0) {
mult = time;
}
});
return (472.143 * Math.log(Math.abs(start - end) + 125) - 2000) * mult;
}
function getY(start, end, elapsed, duration) {
if (elapsed > duration) {
return end;
}
return start + (end - start) * ease(elapsed / duration);
}
function ease(t) {
return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
function ready() {
var WF_CLICK_EMPTY = NS_EVENTS.WF_CLICK_EMPTY,
WF_CLICK_SCROLL = NS_EVENTS.WF_CLICK_SCROLL;
$doc.on(WF_CLICK_SCROLL, localHrefSelector, validateScroll);
$doc.on(WF_CLICK_EMPTY, emptyHrefSelector, function (e) {
e.preventDefault();
});
document.head.insertBefore(focusStylesEl, document.head.firstChild);
} // Export module
return {
ready: ready
};
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
Webflow.define('touch', module.exports = function ($) {
var api = {};
var getSelection = window.getSelection; // Delegate all legacy 'tap' events to 'click'
$.event.special.tap = {
bindType: 'click',
delegateType: 'click'
};
api.init = function (el) {
el = typeof el === 'string' ? $(el).get(0) : el;
return el ? new Touch(el) : null;
};
function Touch(el) {
var active = false;
var useTouch = false;
var thresholdX = Math.min(Math.round(window.innerWidth * 0.04), 40);
var startX;
var lastX;
el.addEventListener('touchstart', start, false);
el.addEventListener('touchmove', move, false);
el.addEventListener('touchend', end, false);
el.addEventListener('touchcancel', cancel, false);
el.addEventListener('mousedown', start, false);
el.addEventListener('mousemove', move, false);
el.addEventListener('mouseup', end, false);
el.addEventListener('mouseout', cancel, false);
function start(evt) {
var touches = evt.touches;
if (touches && touches.length > 1) {
return;
}
active = true;
if (touches) {
useTouch = true;
startX = touches[0].clientX;
} else {
startX = evt.clientX;
}
lastX = startX;
}
function move(evt) {
if (!active) {
return;
}
if (useTouch && evt.type === 'mousemove') {
evt.preventDefault();
evt.stopPropagation();
return;
}
var touches = evt.touches;
var x = touches ? touches[0].clientX : evt.clientX;
var velocityX = x - lastX;
lastX = x; // Allow swipes while pointer is down, but prevent them during text selection
if (Math.abs(velocityX) > thresholdX && getSelection && String(getSelection()) === '') {
triggerEvent('swipe', evt, {
direction: velocityX > 0 ? 'right' : 'left'
});
cancel();
}
}
function end(evt) {
if (!active) {
return;
}
active = false;
if (useTouch && evt.type === 'mouseup') {
evt.preventDefault();
evt.stopPropagation();
useTouch = false;
return;
}
}
function cancel() {
active = false;
}
function destroy() {
el.removeEventListener('touchstart', start, false);
el.removeEventListener('touchmove', move, false);
el.removeEventListener('touchend', end, false);
el.removeEventListener('touchcancel', cancel, false);
el.removeEventListener('mousedown', start, false);
el.removeEventListener('mousemove', move, false);
el.removeEventListener('mouseup', end, false);
el.removeEventListener('mouseout', cancel, false);
el = null;
} // Public instance methods
this.destroy = destroy;
} // Wrap native event to supoprt preventdefault + stopPropagation
function triggerEvent(type, evt, data) {
var newEvent = $.Event(type, {
originalEvent: evt
});
$(evt.target).trigger(newEvent, data);
} // Listen for touch events on all nodes by default.
api.instance = api.init(document); // Export module
return api;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
var IXEvents = __webpack_require__(25);
var KEY_CODES = {
ARROW_LEFT: 37,
ARROW_UP: 38,
ARROW_RIGHT: 39,
ARROW_DOWN: 40,
ESCAPE: 27,
SPACE: 32,
ENTER: 13,
HOME: 36,
END: 35
};
var FORCE_CLOSE = true;
var INTERNAL_PAGE_LINK_HASHES_PATTERN = /^#[a-zA-Z0-9\-_]+$/;
Webflow.define('dropdown', module.exports = function ($, _) {
var debounce = _.debounce;
var api = {};
var inApp = Webflow.env();
var inPreview = false;
var inDesigner;
var touch = Webflow.env.touch;
var namespace = '.w-dropdown';
var openStateClassName = 'w--open';
var ix = IXEvents.triggers;
var defaultZIndex = 900; // @dropdown-depth
var focusOutEvent = 'focusout' + namespace;
var keydownEvent = 'keydown' + namespace;
var mouseEnterEvent = 'mouseenter' + namespace;
var mouseMoveEvent = 'mousemove' + namespace;
var mouseLeaveEvent = 'mouseleave' + namespace;
var mouseUpEvent = (touch ? 'click' : 'mouseup') + namespace;
var closeEvent = 'w-close' + namespace;
var settingEvent = 'setting' + namespace;
var $doc = $(document);
var $dropdowns; // -----------------------------------
api.ready = init;
api.design = function () {
if (inPreview) {
closeAll();
}
inPreview = false;
init();
};
api.preview = function () {
inPreview = true;
init();
}; // -----------------------------------
function init() {
inDesigner = inApp && Webflow.env('design'); // Find all instances on the page
$dropdowns = $doc.find(namespace);
$dropdowns.each(build);
}
function build(i, el) {
var $el = $(el); // Store state in data
var data = $.data(el, namespace);
if (!data) {
data = $.data(el, namespace, {
open: false,
el: $el,
config: {},
selectedIdx: -1
});
}
data.toggle = data.el.children('.w-dropdown-toggle');
data.list = data.el.children('.w-dropdown-list');
data.links = data.list.find('a:not(.w-dropdown .w-dropdown a)');
data.complete = complete(data);
data.mouseLeave = makeMouseLeaveHandler(data);
data.mouseUpOutside = outside(data);
data.mouseMoveOutside = moveOutside(data); // Set config from data attributes
configure(data); // Store the IDs of the toggle button & list
var toggleId = data.toggle.attr('id');
var listId = data.list.attr('id'); // If user did not provide toggle ID, set it
if (!toggleId) {
toggleId = 'w-dropdown-toggle-' + i;
} // If user did not provide list ID, set it
if (!listId) {
listId = 'w-dropdown-list-' + i;
} // Add attributes to toggle element
data.toggle.attr('id', toggleId);
data.toggle.attr('aria-controls', listId);
data.toggle.attr('aria-haspopup', 'menu');
data.toggle.attr('aria-expanded', 'false'); // Hide toggle icon from ATs
data.toggle.find('.w-icon-dropdown-toggle').attr('aria-hidden', 'true'); // If toggle element is not a button
if (data.toggle.prop('tagName') !== 'BUTTON') {
data.toggle.attr('role', 'button'); // And give it a tabindex if user has not provided one
if (!data.toggle.attr('tabindex')) {
data.toggle.attr('tabindex', '0');
}
} // Add attributes to list element
data.list.attr('id', listId);
data.list.attr('aria-labelledby', toggleId);
data.links.each(function (idx, link) {
/**
* In macOS Safari, links don't take focus on click unless they have
* a tabindex. Without this, the dropdown will break.
* @see https://gist.github.com/cvrebert/68659d0333a578d75372
*/
if (!link.hasAttribute('tabindex')) link.setAttribute('tabindex', '0'); // We want to close the drop down if the href links somewhere internally
if (INTERNAL_PAGE_LINK_HASHES_PATTERN.test(link.hash)) {
link.addEventListener('click', close.bind(null, data));
}
}); // Remove old events
data.el.off(namespace);
data.toggle.off(namespace);
if (data.nav) {
data.nav.off(namespace);
}
var initialToggler = makeToggler(data, FORCE_CLOSE);
if (inDesigner) {
data.el.on(settingEvent, makeSettingEventHandler(data));
}
if (!inDesigner) {
if (inApp) {
data.hovering = false;
close(data);
}
if (data.config.hover) {
data.toggle.on(mouseEnterEvent, makeMouseEnterHandler(data));
}
data.el.on(closeEvent, initialToggler);
data.el.on(keydownEvent, makeDropdownKeydownHandler(data));
data.el.on(focusOutEvent, makeDropdownFocusOutHandler(data));
data.toggle.on(mouseUpEvent, initialToggler);
data.toggle.on(keydownEvent, makeToggleKeydownHandler(data));
data.nav = data.el.closest('.w-nav');
data.nav.on(closeEvent, initialToggler);
}
}
function configure(data) {
var zIndex = Number(data.el.css('z-index'));
data.manageZ = zIndex === defaultZIndex || zIndex === defaultZIndex + 1;
data.config = {
hover: data.el.attr('data-hover') === 'true' && !touch,
delay: data.el.attr('data-delay')
};
}
function makeSettingEventHandler(data) {
return function (evt, options) {
options = options || {};
configure(data);
options.open === true && open(data, true);
options.open === false && close(data, {
immediate: true
});
};
}
function makeToggler(data, forceClose) {
return debounce(function (evt) {
if (data.open || evt && evt.type === 'w-close') {
return close(data, {
forceClose: forceClose
});
}
open(data);
});
}
function open(data) {
if (data.open) {
return;
}
closeOthers(data);
data.open = true;
data.list.addClass(openStateClassName);
data.toggle.addClass(openStateClassName);
data.toggle.attr('aria-expanded', 'true'); // ARIA
ix.intro(0, data.el[0]);
Webflow.redraw.up(); // Increase z-index to keep above other managed dropdowns
data.manageZ && data.el.css('z-index', defaultZIndex + 1); // Listen for click outside events
var isEditor = Webflow.env('editor');
if (!inDesigner) {
$doc.on(mouseUpEvent, data.mouseUpOutside);
}
if (data.hovering && !isEditor) {
data.el.on(mouseLeaveEvent, data.mouseLeave);
}
if (data.hovering && isEditor) {
$doc.on(mouseMoveEvent, data.mouseMoveOutside);
} // Clear previous delay
window.clearTimeout(data.delayId);
}
function close(data) {
var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
immediate = _ref.immediate,
forceClose = _ref.forceClose;
if (!data.open) {
return;
} // Do not close hover-based menus if currently hovering
if (data.config.hover && data.hovering && !forceClose) {
return;
}
data.toggle.attr('aria-expanded', 'false');
data.open = false;
var config = data.config;
ix.outro(0, data.el[0]); // Stop listening for click outside events
$doc.off(mouseUpEvent, data.mouseUpOutside);
$doc.off(mouseMoveEvent, data.mouseMoveOutside);
data.el.off(mouseLeaveEvent, data.mouseLeave); // Clear previous delay
window.clearTimeout(data.delayId); // Skip delay during immediate
if (!config.delay || immediate) {
return data.complete();
} // Optionally wait for delay before close
data.delayId = window.setTimeout(data.complete, config.delay);
}
function closeAll() {
$doc.find(namespace).each(function (i, el) {
$(el).triggerHandler(closeEvent);
});
}
function closeOthers(data) {
var self = data.el[0];
$dropdowns.each(function (i, other) {
var $other = $(other);
if ($other.is(self) || $other.has(self).length) {
return;
}
$other.triggerHandler(closeEvent);
});
}
function outside(data) {
if (data.mouseUpOutside) {
$doc.off(mouseUpEvent, data.mouseUpOutside);
} // Close menu when clicked outside
return debounce(function (evt) {
if (!data.open) {
return;
}
var $target = $(evt.target);
if ($target.closest('.w-dropdown-toggle').length) {
return;
}
var isEventOutsideDropdowns = $.inArray(data.el[0], $target.parents(namespace)) === -1;
var isEditor = Webflow.env('editor');
if (isEventOutsideDropdowns) {
if (isEditor) {
var isEventOnDetachedSvg = $target.parents().length === 1 && $target.parents('svg').length === 1;
var isEventOnHoverControls = $target.parents('.w-editor-bem-EditorHoverControls').length;
if (isEventOnDetachedSvg || isEventOnHoverControls) {
return;
}
}
close(data);
}
});
}
function complete(data) {
return function () {
data.list.removeClass(openStateClassName);
data.toggle.removeClass(openStateClassName); // Reset z-index for managed dropdowns
data.manageZ && data.el.css('z-index', '');
};
}
function makeMouseEnterHandler(data) {
return function () {
data.hovering = true;
open(data);
};
}
function makeMouseLeaveHandler(data) {
return function () {
data.hovering = false; // We do not want the list to close upon mouseleave
if (!data.links.is(':focus')) {
close(data);
}
};
}
function moveOutside(data) {
return debounce(function (evt) {
if (!data.open) {
return;
}
var $target = $(evt.target);
var isEventOutsideDropdowns = $.inArray(data.el[0], $target.parents(namespace)) === -1;
if (isEventOutsideDropdowns) {
var isEventOnHoverControls = $target.parents('.w-editor-bem-EditorHoverControls').length;
var isEventOnHoverToolbar = $target.parents('.w-editor-bem-RTToolbar').length;
var $editorOverlay = $('.w-editor-bem-EditorOverlay');
var isDropdownInEdition = $editorOverlay.find('.w-editor-edit-outline').length || $editorOverlay.find('.w-editor-bem-RTToolbar').length;
if (isEventOnHoverControls || isEventOnHoverToolbar || isDropdownInEdition) {
return;
}
data.hovering = false;
close(data);
}
});
}
function makeDropdownKeydownHandler(data) {
return function (evt) {
if (inDesigner || !data.open) {
return;
} // Realign selectedIdx with the menu item that is currently in focus.
data.selectedIdx = data.links.index(document.activeElement); // Evaluate item-selection logic
switch (evt.keyCode) {
case KEY_CODES.HOME:
{
if (!data.open) return;
data.selectedIdx = 0;
focusSelectedLink(data);
return evt.preventDefault();
}
case KEY_CODES.END:
{
if (!data.open) return;
data.selectedIdx = data.links.length - 1;
focusSelectedLink(data);
return evt.preventDefault();
}
case KEY_CODES.ESCAPE:
{
close(data);
data.toggle.focus();
return evt.stopPropagation();
}
case KEY_CODES.ARROW_RIGHT:
case KEY_CODES.ARROW_DOWN:
{
data.selectedIdx = Math.min(data.links.length - 1, data.selectedIdx + 1);
focusSelectedLink(data);
return evt.preventDefault();
}
case KEY_CODES.ARROW_LEFT:
case KEY_CODES.ARROW_UP:
{
data.selectedIdx = Math.max(-1, data.selectedIdx - 1);
focusSelectedLink(data);
return evt.preventDefault();
}
}
};
}
function focusSelectedLink(data) {
if (data.links[data.selectedIdx]) {
data.links[data.selectedIdx].focus();
}
}
function makeToggleKeydownHandler(data) {
var toggler = makeToggler(data, FORCE_CLOSE);
return function (evt) {
if (inDesigner) return; // If the menu is not open, we don't want
if (!data.open) {
switch (evt.keyCode) {
case KEY_CODES.ARROW_UP:
case KEY_CODES.ARROW_DOWN:
{
return evt.stopPropagation();
}
}
}
switch (evt.keyCode) {
case KEY_CODES.SPACE:
case KEY_CODES.ENTER:
{
toggler();
evt.stopPropagation();
return evt.preventDefault();
}
}
};
}
function makeDropdownFocusOutHandler(data) {
return debounce(function (evt) {
var relatedTarget = evt.relatedTarget,
target = evt.target;
var menuEl = data.el[0];
/**
* Close menu
* With focusout events, the `relatedTarget` is the element that will next receive focus.
* @see: https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget
*/
var menuContainsFocus = menuEl.contains(relatedTarget) || menuEl.contains(target);
if (!menuContainsFocus) {
close(data);
}
return evt.stopPropagation();
});
} // Export module
return api;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var _interopRequireDefault = __webpack_require__(1);
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(337));
var Webflow = __webpack_require__(3);
Webflow.define('forms', module.exports = function ($, _) {
var api = {};
var $doc = $(document);
var $forms;
var loc = window.location;
var retro = window.XDomainRequest && !window.atob;
var namespace = '.w-form';
var siteId;
var emailField = /e(-)?mail/i;
var emailValue = /^\S+@\S+$/;
var alert = window.alert;
var inApp = Webflow.env();
var listening;
var formUrl;
var signFileUrl; // MailChimp domains: list-manage.com + mirrors
var chimpRegex = /list-manage[1-9]?.com/i;
var disconnected = _.debounce(function () {
alert('Oops! This page has improperly configured forms. Please contact your website administrator to fix this issue.');
}, 100);
api.ready = api.design = api.preview = function () {
init(); // Wire document events on published site only once
if (!inApp && !listening) {
addListeners();
}
};
function init() {
siteId = $('html').attr('data-wf-site');
formUrl = "https://webflow.com" + '/api/v1/form/' + siteId; // Work around same-protocol IE XDR limitation - without this IE9 and below forms won't submit
if (retro && formUrl.indexOf("https://webflow.com") >= 0) {
formUrl = formUrl.replace("https://webflow.com", "http://formdata.webflow.com");
}
signFileUrl = "".concat(formUrl, "/signFile");
$forms = $(namespace + ' form');
if (!$forms.length) {
return;
}
$forms.each(build);
}
function build(i, el) {
var $el = $(el);
var data = $.data(el, namespace);
if (!data) {
data = $.data(el, namespace, {
form: $el
});
} // data.form
reset(data);
var wrap = $el.closest('div.w-form');
data.done = wrap.find('> .w-form-done');
data.fail = wrap.find('> .w-form-fail');
data.fileUploads = wrap.find('.w-file-upload');
data.fileUploads.each(function (j) {
initFileUpload(j, data);
}); // Accessiblity fixes
var formName = data.form.attr('aria-label') || data.form.attr('data-name') || 'Form';
if (!data.done.attr('aria-label')) {
data.form.attr('aria-label', formName);
}
data.done.attr('tabindex', '-1');
data.done.attr('role', 'region');
if (!data.done.attr('aria-label')) {
data.done.attr('aria-label', formName + ' success');
}
data.fail.attr('tabindex', '-1');
data.fail.attr('role', 'region');
if (!data.fail.attr('aria-label')) {
data.fail.attr('aria-label', formName + ' failure');
}
var action = data.action = $el.attr('action');
data.handler = null;
data.redirect = $el.attr('data-redirect'); // MailChimp form
if (chimpRegex.test(action)) {
data.handler = submitMailChimp;
return;
} // Custom form action
if (action) {
return;
} // Webflow forms for hosting accounts
if (siteId) {
data.handler = typeof hostedSubmitWebflow === 'function' ? hostedSubmitWebflow : exportedSubmitWebflow;
return;
} // Alert for disconnected Webflow forms
disconnected();
}
function addListeners() {
listening = true; // Handle form submission for Webflow forms
$doc.on('submit', namespace + ' form', function (evt) {
var data = $.data(this, namespace);
if (data.handler) {
data.evt = evt;
data.handler(data);
}
}); // handle checked ui for custom checkbox and radio button
var CHECKBOX_CLASS_NAME = '.w-checkbox-input';
var RADIO_INPUT_CLASS_NAME = '.w-radio-input';
var CHECKED_CLASS = 'w--redirected-checked';
var FOCUSED_CLASS = 'w--redirected-focus';
var FOCUSED_VISIBLE_CLASS = 'w--redirected-focus-visible';
var focusVisibleSelectors = ':focus-visible, [data-wf-focus-visible]';
var CUSTOM_CONTROLS = [['checkbox', CHECKBOX_CLASS_NAME], ['radio', RADIO_INPUT_CLASS_NAME]];
$doc.on('change', namespace + " form input[type=\"checkbox\"]:not(" + CHECKBOX_CLASS_NAME + ')', function (evt) {
$(evt.target).siblings(CHECKBOX_CLASS_NAME).toggleClass(CHECKED_CLASS);
});
$doc.on('change', namespace + " form input[type=\"radio\"]", function (evt) {
$("input[name=\"".concat(evt.target.name, "\"]:not(").concat(CHECKBOX_CLASS_NAME, ")")).map(function (i, el) {
return $(el).siblings(RADIO_INPUT_CLASS_NAME).removeClass(CHECKED_CLASS);
});
var $target = $(evt.target);
if (!$target.hasClass('w-radio-input')) {
$target.siblings(RADIO_INPUT_CLASS_NAME).addClass(CHECKED_CLASS);
}
});
CUSTOM_CONTROLS.forEach(function (_ref) {
var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
controlType = _ref2[0],
customControlClassName = _ref2[1];
$doc.on('focus', namespace + " form input[type=\"".concat(controlType, "\"]:not(") + customControlClassName + ')', function (evt) {
$(evt.target).siblings(customControlClassName).addClass(FOCUSED_CLASS);
$(evt.target).filter(focusVisibleSelectors).siblings(customControlClassName).addClass(FOCUSED_VISIBLE_CLASS);
});
$doc.on('blur', namespace + " form input[type=\"".concat(controlType, "\"]:not(") + customControlClassName + ')', function (evt) {
$(evt.target).siblings(customControlClassName).removeClass("".concat(FOCUSED_CLASS, " ").concat(FOCUSED_VISIBLE_CLASS));
});
});
} // Reset data common to all submit handlers
function reset(data) {
var btn = data.btn = data.form.find(':input[type="submit"]');
data.wait = data.btn.attr('data-wait') || null;
data.success = false;
btn.prop('disabled', false);
data.label && btn.val(data.label);
} // Disable submit button
function disableBtn(data) {
var btn = data.btn;
var wait = data.wait;
btn.prop('disabled', true); // Show wait text and store previous label
if (wait) {
data.label = btn.val();
btn.val(wait);
}
} // Find form fields, validate, and set value pairs
function findFields(form, result) {
var status = null;
result = result || {}; // The ":input" selector is a jQuery shortcut to select all inputs, selects, textareas
form.find(':input:not([type="submit"]):not([type="file"])').each(function (i, el) {
var field = $(el);
var type = field.attr('type');
var name = field.attr('data-name') || field.attr('name') || 'Field ' + (i + 1);
var value = field.val();
if (type === 'checkbox') {
value = field.is(':checked');
} else if (type === 'radio') {
if (result[name] === null || typeof result[name] === 'string') {
return;
}
value = form.find('input[name="' + field.attr('name') + '"]:checked').val() || null;
}
if (typeof value === 'string') {
value = $.trim(value);
}
result[name] = value;
status = status || getStatus(field, type, name, value);
});
return status;
}
function findFileUploads(form) {
var result = {};
form.find(':input[type="file"]').each(function (i, el) {
var field = $(el);
var name = field.attr('data-name') || field.attr('name') || 'File ' + (i + 1);
var value = field.attr('data-value');
if (typeof value === 'string') {
value = $.trim(value);
}
result[name] = value;
});
return result;
}
var trackingCookieNameMap = {
_mkto_trk: 'marketo' // __hstc: 'hubspot',
};
function collectEnterpriseTrackingCookies() {
var cookies = document.cookie.split('; ').reduce(function (acc, cookie) {
var splitCookie = cookie.split('=');
var name = splitCookie[0];
if (name in trackingCookieNameMap) {
var mappedName = trackingCookieNameMap[name];
var value = splitCookie.slice(1).join('=');
acc[mappedName] = value;
}
return acc;
}, {});
return cookies;
}
function getStatus(field, type, name, value) {
var status = null;
if (type === 'password') {
status = 'Passwords cannot be submitted.';
} else if (field.attr('required')) {
if (!value) {
status = 'Please fill out the required field: ' + name;
} else if (emailField.test(field.attr('type'))) {
if (!emailValue.test(value)) {
status = 'Please enter a valid email address for: ' + name;
}
}
} else if (name === 'g-recaptcha-response' && !value) {
status = 'Please confirm you’re not a robot.';
}
return status;
}
function exportedSubmitWebflow(data) {
preventDefault(data);
afterSubmit(data);
}
function hostedSubmitWebflow(data) {
reset(data);
var form = data.form;
var payload = {
name: form.attr('data-name') || form.attr('name') || 'Untitled Form',
source: loc.href,
test: Webflow.env(),
fields: {},
fileUploads: {},
dolphin: /pass[\s-_]?(word|code)|secret|login|credentials/i.test(form.html()),
trackingCookies: collectEnterpriseTrackingCookies()
};
var wfFlow = form.attr('data-wf-flow');
if (wfFlow) {
payload.wfFlow = wfFlow;
}
preventDefault(data); // Find & populate all fields
var status = findFields(form, payload.fields);
if (status) {
return alert(status);
}
payload.fileUploads = findFileUploads(form); // Disable submit button
disableBtn(data); // Read site ID
if (!siteId) {
afterSubmit(data);
return;
}
$.ajax({
url: formUrl,
type: 'POST',
data: payload,
dataType: 'json',
crossDomain: true
}).done(function (response) {
if (response && response.code === 200) {
data.success = true;
}
afterSubmit(data);
}).fail(function () {
afterSubmit(data);
});
}
function submitMailChimp(data) {
reset(data);
var form = data.form;
var payload = {}; // Skip Ajax submission if http/s mismatch, fallback to POST instead
if (/^https/.test(loc.href) && !/^https/.test(data.action)) {
form.attr('method', 'post');
return;
}
preventDefault(data); // Find & populate all fields
var status = findFields(form, payload);
if (status) {
return alert(status);
} // Disable submit button
disableBtn(data); // Use special format for MailChimp params
var fullName;
_.each(payload, function (value, key) {
if (emailField.test(key)) {
payload.EMAIL = value;
}
if (/^((full[ _-]?)?name)$/i.test(key)) {
fullName = value;
}
if (/^(first[ _-]?name)$/i.test(key)) {
payload.FNAME = value;
}
if (/^(last[ _-]?name)$/i.test(key)) {
payload.LNAME = value;
}
});
if (fullName && !payload.FNAME) {
fullName = fullName.split(' ');
payload.FNAME = fullName[0];
payload.LNAME = payload.LNAME || fullName[1];
} // Use the (undocumented) MailChimp jsonp api
var url = data.action.replace('/post?', '/post-json?') + '&c=?'; // Add special param to prevent bot signups
var userId = url.indexOf('u=') + 2;
userId = url.substring(userId, url.indexOf('&', userId));
var listId = url.indexOf('id=') + 3;
listId = url.substring(listId, url.indexOf('&', listId));
payload['b_' + userId + '_' + listId] = '';
$.ajax({
url: url,
data: payload,
dataType: 'jsonp'
}).done(function (resp) {
data.success = resp.result === 'success' || /already/.test(resp.msg);
if (!data.success) {
console.info('MailChimp error: ' + resp.msg);
}
afterSubmit(data);
}).fail(function () {
afterSubmit(data);
});
} // Common callback which runs after all Ajax submissions
function afterSubmit(data) {
var form = data.form;
var redirect = data.redirect;
var success = data.success; // Redirect to a success url if defined
if (success && redirect) {
Webflow.location(redirect);
return;
} // Show or hide status divs
data.done.toggle(success);
data.fail.toggle(!success);
if (success) {
data.done.focus();
} else {
data.fail.focus();
} // Hide form on success
form.toggle(!success); // Reset data and enable submit button
reset(data);
}
function preventDefault(data) {
data.evt && data.evt.preventDefault();
data.evt = null;
}
function initFileUpload(i, form) {
if (!form.fileUploads || !form.fileUploads[i]) {
return;
}
var file;
var $el = $(form.fileUploads[i]);
var $defaultWrap = $el.find('> .w-file-upload-default');
var $uploadingWrap = $el.find('> .w-file-upload-uploading');
var $successWrap = $el.find('> .w-file-upload-success');
var $errorWrap = $el.find('> .w-file-upload-error');
var $input = $defaultWrap.find('.w-file-upload-input');
var $label = $defaultWrap.find('.w-file-upload-label');
var $labelChildren = $label.children();
var $errorMsgEl = $errorWrap.find('.w-file-upload-error-msg');
var $fileEl = $successWrap.find('.w-file-upload-file');
var $removeEl = $successWrap.find('.w-file-remove-link');
var $fileNameEl = $fileEl.find('.w-file-upload-file-name');
var sizeErrMsg = $errorMsgEl.attr('data-w-size-error');
var typeErrMsg = $errorMsgEl.attr('data-w-type-error');
var genericErrMsg = $errorMsgEl.attr('data-w-generic-error'); // Accessiblity fixes
$label.on('click keydown', function (e) {
if (e.type === 'keydown' && e.which !== 13 && e.which !== 32) {
return;
}
e.preventDefault();
$input.click();
}); // Both of these are added through CSS
$label.find('.w-icon-file-upload-icon').attr('aria-hidden', 'true');
$removeEl.find('.w-icon-file-upload-remove').attr('aria-hidden', 'true');
if (!inApp) {
$removeEl.on('click keydown', function (e) {
if (e.type === 'keydown') {
if (e.which !== 13 && e.which !== 32) {
return;
}
e.preventDefault();
}
$input.removeAttr('data-value');
$input.val('');
$fileNameEl.html('');
$defaultWrap.toggle(true);
$successWrap.toggle(false);
$label.focus();
});
$input.on('change', function (e) {
file = e.target && e.target.files && e.target.files[0];
if (!file) {
return;
} // Show uploading
$defaultWrap.toggle(false);
$errorWrap.toggle(false);
$uploadingWrap.toggle(true);
$uploadingWrap.focus(); // Set filename
$fileNameEl.text(file.name); // Disable submit button
if (!isUploading()) {
disableBtn(form);
}
form.fileUploads[i].uploading = true;
signFile(file, afterSign);
}); // Setting input width 1px and height equal label
var height = $label.outerHeight();
$input.height(height);
$input.width(1);
} else {
$input.on('click', function (e) {
e.preventDefault();
});
$label.on('click', function (e) {
e.preventDefault();
});
$labelChildren.on('click', function (e) {
e.preventDefault();
});
}
function parseError(err) {
var errorMsg = err.responseJSON && err.responseJSON.msg;
var userError = genericErrMsg;
if (typeof errorMsg === 'string' && errorMsg.indexOf('InvalidFileTypeError') === 0) {
userError = typeErrMsg;
} else if (typeof errorMsg === 'string' && errorMsg.indexOf('MaxFileSizeError') === 0) {
userError = sizeErrMsg;
}
$errorMsgEl.text(userError);
$input.removeAttr('data-value');
$input.val('');
$uploadingWrap.toggle(false);
$defaultWrap.toggle(true);
$errorWrap.toggle(true);
$errorWrap.focus();
form.fileUploads[i].uploading = false;
if (!isUploading()) {
reset(form);
}
}
function afterSign(err, data) {
if (err) {
return parseError(err);
}
var fileName = data.fileName;
var postData = data.postData;
var fileId = data.fileId;
var s3Url = data.s3Url;
$input.attr('data-value', fileId);
uploadS3(s3Url, postData, file, fileName, afterUpload);
}
function afterUpload(err) {
if (err) {
return parseError(err);
} // Show success
$uploadingWrap.toggle(false);
$successWrap.css('display', 'inline-block');
$successWrap.focus();
form.fileUploads[i].uploading = false;
if (!isUploading()) {
reset(form);
}
}
function isUploading() {
var uploads = form.fileUploads && form.fileUploads.toArray() || [];
return uploads.some(function (value) {
return value.uploading;
});
}
}
function signFile(file, cb) {
var payload = {
name: file.name,
size: file.size
};
$.ajax({
type: 'POST',
url: signFileUrl,
data: payload,
dataType: 'json',
crossDomain: true
}).done(function (data) {
cb(null, data);
}).fail(function (err) {
cb(err);
});
}
function uploadS3(url, data, file, fileName, cb) {
var formData = new FormData();
for (var k in data) {
formData.append(k, data[k]);
}
formData.append('file', file, fileName);
$.ajax({
type: 'POST',
url: url,
data: formData,
processData: false,
contentType: false
}).done(function () {
cb(null);
}).fail(function (err) {
cb(err);
});
} // Export module
return api;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
var arrayWithHoles = __webpack_require__(338);
var iterableToArrayLimit = __webpack_require__(339);
var nonIterableRest = __webpack_require__(340);
function _slicedToArray(arr, i) {
return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray;
/***/ }),
 (function(module, exports) {
function _arrayWithHoles(arr) {
if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles;
/***/ }),
 (function(module, exports) {
function _iterableToArrayLimit(arr, i) {
var _arr = [];
var _n = true;
var _d = false;
var _e = undefined;
try {
for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
_arr.push(_s.value);
if (i && _arr.length === i) break;
}
} catch (err) {
_d = true;
_e = err;
} finally {
try {
if (!_n && _i["return"] != null) _i["return"]();
} finally {
if (_d) throw _e;
}
}
return _arr;
}
module.exports = _iterableToArrayLimit;
/***/ }),
 (function(module, exports) {
function _nonIterableRest() {
throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
module.exports = _nonIterableRest;
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
var IXEvents = __webpack_require__(25);
var KEY_CODES = {
ARROW_LEFT: 37,
ARROW_UP: 38,
ARROW_RIGHT: 39,
ARROW_DOWN: 40,
ESCAPE: 27,
SPACE: 32,
ENTER: 13,
HOME: 36,
END: 35
};
Webflow.define('navbar', module.exports = function ($, _) {
var api = {};
var tram = $.tram;
var $win = $(window);
var $doc = $(document);
var debounce = _.debounce;
var $body;
var $navbars;
var designer;
var inEditor;
var inApp = Webflow.env();
var overlay = '<div class="w-nav-overlay" data-wf-ignore />';
var namespace = '.w-nav';
var navbarOpenedButton = 'w--open';
var navbarOpenedDropdown = 'w--nav-dropdown-open';
var navbarOpenedDropdownToggle = 'w--nav-dropdown-toggle-open';
var navbarOpenedDropdownList = 'w--nav-dropdown-list-open';
var navbarOpenedLink = 'w--nav-link-open';
var ix = IXEvents.triggers;
var menuSibling = $(); // -----------------------------------
api.ready = api.design = api.preview = init;
api.destroy = function () {
menuSibling = $();
removeListeners();
if ($navbars && $navbars.length) {
$navbars.each(teardown);
}
}; // -----------------------------------
function init() {
designer = inApp && Webflow.env('design');
inEditor = Webflow.env('editor');
$body = $(document.body); // Find all instances on the page
$navbars = $doc.find(namespace);
if (!$navbars.length) {
return;
}
$navbars.each(build); // Wire events
removeListeners();
addListeners();
}
function removeListeners() {
Webflow.resize.off(resizeAll);
}
function addListeners() {
Webflow.resize.on(resizeAll);
}
function resizeAll() {
$navbars.each(resize);
}
function build(i, el) {
var $el = $(el); // Store state in data
var data = $.data(el, namespace);
if (!data) {
data = $.data(el, namespace, {
open: false,
el: $el,
config: {},
selectedIdx: -1
});
}
data.menu = $el.find('.w-nav-menu');
data.links = data.menu.find('.w-nav-link');
data.dropdowns = data.menu.find('.w-dropdown');
data.dropdownToggle = data.menu.find('.w-dropdown-toggle');
data.dropdownList = data.menu.find('.w-dropdown-list');
data.button = $el.find('.w-nav-button');
data.container = $el.find('.w-container');
data.overlayContainerId = 'w-nav-overlay-' + i;
data.outside = outside(data); //   If the brand links exists and is set to link to the homepage, the
var navBrandLink = $el.find('.w-nav-brand');
if (navBrandLink && navBrandLink.attr('href') === '/' && navBrandLink.attr('aria-label') == null) {
navBrandLink.attr('aria-label', 'home');
} //   VoiceOver bug, when items that disallow user selection are focused
data.button.attr('style', '-webkit-user-select: text;'); // Add attributes to toggle element
if (data.button.attr('aria-label') == null) {
data.button.attr('aria-label', 'menu');
}
data.button.attr('role', 'button');
data.button.attr('tabindex', '0');
data.button.attr('aria-controls', data.overlayContainerId);
data.button.attr('aria-haspopup', 'menu');
data.button.attr('aria-expanded', 'false'); // Remove old events
data.el.off(namespace);
data.button.off(namespace);
data.menu.off(namespace); // Set config from data attributes
configure(data); // Add events based on mode
if (designer) {
removeOverlay(data);
data.el.on('setting' + namespace, handler(data));
} else {
addOverlay(data);
data.button.on('click' + namespace, toggle(data));
data.menu.on('click' + namespace, 'a', navigate(data));
data.button.on('keydown' + namespace, makeToggleButtonKeyboardHandler(data));
data.el.on('keydown' + namespace, makeLinksKeyboardHandler(data));
} // Trigger initial resize
resize(i, el);
}
function teardown(i, el) {
var data = $.data(el, namespace);
if (data) {
removeOverlay(data);
$.removeData(el, namespace);
}
}
function removeOverlay(data) {
if (!data.overlay) {
return;
}
close(data, true);
data.overlay.remove();
data.overlay = null;
}
function addOverlay(data) {
if (data.overlay) {
return;
}
data.overlay = $(overlay).appendTo(data.el);
data.overlay.attr('id', data.overlayContainerId);
data.parent = data.menu.parent();
close(data, true);
}
function configure(data) {
var config = {};
var old = data.config || {}; // Set config options from data attributes
var animation = config.animation = data.el.attr('data-animation') || 'default';
config.animOver = /^over/.test(animation);
config.animDirect = /left$/.test(animation) ? -1 : 1; // Re-open menu if the animation type changed
if (old.animation !== animation) {
data.open && _.defer(reopen, data);
}
config.easing = data.el.attr('data-easing') || 'ease';
config.easing2 = data.el.attr('data-easing2') || 'ease';
var duration = data.el.attr('data-duration');
config.duration = duration != null ? Number(duration) : 400;
config.docHeight = data.el.attr('data-doc-height'); // Store config in data
data.config = config;
}
function handler(data) {
return function (evt, options) {
options = options || {};
var winWidth = $win.width();
configure(data);
options.open === true && open(data, true);
options.open === false && close(data, true); // Reopen if media query changed after setting
data.open && _.defer(function () {
if (winWidth !== $win.width()) {
reopen(data);
}
});
};
}
function makeToggleButtonKeyboardHandler(data) {
return function (evt) {
switch (evt.keyCode) {
case KEY_CODES.SPACE:
case KEY_CODES.ENTER:
{
toggle(data)();
evt.preventDefault();
return evt.stopPropagation();
}
case KEY_CODES.ESCAPE:
{
close(data);
evt.preventDefault();
return evt.stopPropagation();
}
case KEY_CODES.ARROW_RIGHT:
case KEY_CODES.ARROW_DOWN:
case KEY_CODES.HOME:
case KEY_CODES.END:
{
if (!data.open) {
evt.preventDefault();
return evt.stopPropagation();
}
if (evt.keyCode === KEY_CODES.END) {
data.selectedIdx = data.links.length - 1;
} else {
data.selectedIdx = 0;
}
focusSelectedLink(data);
evt.preventDefault();
return evt.stopPropagation();
}
}
};
}
function makeLinksKeyboardHandler(data) {
return function (evt) {
if (!data.open) {
return;
} // Realign selectedIdx with the menu item that is currently in focus.
data.selectedIdx = data.links.index(document.activeElement);
switch (evt.keyCode) {
case KEY_CODES.HOME:
case KEY_CODES.END:
{
if (evt.keyCode === KEY_CODES.END) {
data.selectedIdx = data.links.length - 1;
} else {
data.selectedIdx = 0;
}
focusSelectedLink(data);
evt.preventDefault();
return evt.stopPropagation();
}
case KEY_CODES.ESCAPE:
{
close(data); // Focus toggle button
data.button.focus();
evt.preventDefault();
return evt.stopPropagation();
}
case KEY_CODES.ARROW_LEFT:
case KEY_CODES.ARROW_UP:
{
data.selectedIdx = Math.max(-1, data.selectedIdx - 1);
focusSelectedLink(data);
evt.preventDefault();
return evt.stopPropagation();
}
case KEY_CODES.ARROW_RIGHT:
case KEY_CODES.ARROW_DOWN:
{
data.selectedIdx = Math.min(data.links.length - 1, data.selectedIdx + 1);
focusSelectedLink(data);
evt.preventDefault();
return evt.stopPropagation();
}
}
};
}
function focusSelectedLink(data) {
if (data.links[data.selectedIdx]) {
var selectedElement = data.links[data.selectedIdx];
selectedElement.focus();
navigate(selectedElement);
}
}
function reopen(data) {
if (!data.open) {
return;
}
close(data, true);
open(data, true);
}
function toggle(data) {
return debounce(function () {
data.open ? close(data) : open(data);
});
}
function navigate(data) {
return function (evt) {
var link = $(this);
var href = link.attr('href'); // Avoid late clicks on touch devices
if (!Webflow.validClick(evt.currentTarget)) {
evt.preventDefault();
return;
} // Close when navigating to an in-page anchor
if (href && href.indexOf('#') === 0 && data.open) {
close(data);
}
};
}
function outside(data) {
if (data.outside) {
$doc.off('click' + namespace, data.outside);
}
return function (evt) {
var $target = $(evt.target); // Ignore clicks on Editor overlay UI
if (inEditor && $target.closest('.w-editor-bem-EditorOverlay').length) {
return;
} // Close menu when clicked outside, debounced to wait for state
outsideDebounced(data, $target);
};
}
var outsideDebounced = debounce(function (data, $target) {
if (!data.open) {
return;
}
var menu = $target.closest('.w-nav-menu');
if (!data.menu.is(menu)) {
close(data);
}
});
function resize(i, el) {
var data = $.data(el, namespace); // Check for collapsed state based on button display
var collapsed = data.collapsed = data.button.css('display') !== 'none'; // Close menu if button is no longer visible (and not in designer)
if (data.open && !collapsed && !designer) {
close(data, true);
} // Set max-width of links + dropdowns to match container
if (data.container.length) {
var updateEachMax = updateMax(data);
data.links.each(updateEachMax);
data.dropdowns.each(updateEachMax);
} // If currently open, update height to match body
if (data.open) {
setOverlayHeight(data);
}
}
var maxWidth = 'max-width';
function updateMax(data) {
var containMax = data.container.css(maxWidth);
if (containMax === 'none') {
containMax = '';
}
return function (i, link) {
link = $(link);
link.css(maxWidth, ''); // Don't set the max-width if an upstream value exists
if (link.css(maxWidth) === 'none') {
link.css(maxWidth, containMax);
}
};
}
function addMenuOpen(i, el) {
el.setAttribute('data-nav-menu-open', '');
}
function removeMenuOpen(i, el) {
el.removeAttribute('data-nav-menu-open');
}
function open(data, immediate) {
if (data.open) {
return;
}
data.open = true;
data.menu.each(addMenuOpen);
data.links.addClass(navbarOpenedLink);
data.dropdowns.addClass(navbarOpenedDropdown);
data.dropdownToggle.addClass(navbarOpenedDropdownToggle);
data.dropdownList.addClass(navbarOpenedDropdownList);
data.button.addClass(navbarOpenedButton);
var config = data.config;
var animation = config.animation;
if (animation === 'none' || !tram.support.transform || config.duration <= 0) {
immediate = true;
}
var bodyHeight = setOverlayHeight(data);
var menuHeight = data.menu.outerHeight(true);
var menuWidth = data.menu.outerWidth(true);
var navHeight = data.el.height();
var navbarEl = data.el[0];
resize(0, navbarEl);
ix.intro(0, navbarEl);
Webflow.redraw.up(); // Listen for click outside events
if (!designer) {
$doc.on('click' + namespace, data.outside);
} // No transition for immediate
if (immediate) {
complete();
return;
}
var transConfig = 'transform ' + config.duration + 'ms ' + config.easing; // Add menu to overlay
if (data.overlay) {
menuSibling = data.menu.prev();
data.overlay.show().append(data.menu);
} // Over left/right
if (config.animOver) {
tram(data.menu).add(transConfig).set({
x: config.animDirect * menuWidth,
height: bodyHeight
}).start({
x: 0
}).then(complete);
data.overlay && data.overlay.width(menuWidth);
return;
} // Drop Down
var offsetY = navHeight + menuHeight;
tram(data.menu).add(transConfig).set({
y: -offsetY
}).start({
y: 0
}).then(complete);
function complete() {
data.button.attr('aria-expanded', 'true');
}
}
function setOverlayHeight(data) {
var config = data.config;
var bodyHeight = config.docHeight ? $doc.height() : $body.height();
if (config.animOver) {
data.menu.height(bodyHeight);
} else if (data.el.css('position') !== 'fixed') {
bodyHeight -= data.el.outerHeight(true);
}
data.overlay && data.overlay.height(bodyHeight);
return bodyHeight;
}
function close(data, immediate) {
if (!data.open) {
return;
}
data.open = false;
data.button.removeClass(navbarOpenedButton);
var config = data.config;
if (config.animation === 'none' || !tram.support.transform || config.duration <= 0) {
immediate = true;
}
ix.outro(0, data.el[0]); // Stop listening for click outside events
$doc.off('click' + namespace, data.outside);
if (immediate) {
tram(data.menu).stop();
complete();
return;
}
var transConfig = 'transform ' + config.duration + 'ms ' + config.easing2;
var menuHeight = data.menu.outerHeight(true);
var menuWidth = data.menu.outerWidth(true);
var navHeight = data.el.height(); // Over left/right
if (config.animOver) {
tram(data.menu).add(transConfig).start({
x: menuWidth * config.animDirect
}).then(complete);
return;
} // Drop Down
var offsetY = navHeight + menuHeight;
tram(data.menu).add(transConfig).start({
y: -offsetY
}).then(complete);
function complete() {
data.menu.height('');
tram(data.menu).set({
x: 0,
y: 0
});
data.menu.each(removeMenuOpen);
data.links.removeClass(navbarOpenedLink);
data.dropdowns.removeClass(navbarOpenedDropdown);
data.dropdownToggle.removeClass(navbarOpenedDropdownToggle);
data.dropdownList.removeClass(navbarOpenedDropdownList);
if (data.overlay && data.overlay.children().length) {
menuSibling.length ? data.menu.insertAfter(menuSibling) : data.menu.prependTo(data.parent);
data.overlay.attr('style', '').hide();
} // Trigger event so other components can hook in (dropdown)
data.el.triggerHandler('w-close');
data.button.attr('aria-expanded', 'false');
}
} // Export module
return api;
});
/***/ }),
 (function(module, exports, __webpack_require__) {
"use strict";
var Webflow = __webpack_require__(3);
var IXEvents = __webpack_require__(25);
var KEY_CODES = {
ARROW_LEFT: 37,
ARROW_UP: 38,
ARROW_RIGHT: 39,
ARROW_DOWN: 40,
SPACE: 32,
ENTER: 13,
HOME: 36,
END: 35
};
var FOCUSABLE_SELECTOR = 'a[href], area[href], [role="button"], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
Webflow.define('slider', module.exports = function ($, _) {
var api = {};
var tram = $.tram;
var $doc = $(document);
var $sliders;
var designer;
var inApp = Webflow.env();
var namespace = '.w-slider';
var dot = '<div class="w-slider-dot" data-wf-ignore />';
var ariaLiveLabelHtml = '<div aria-live="off" aria-atomic="true" class="w-slider-aria-label" data-wf-ignore />';
var forceShow = 'w-slider-force-show';
var ix = IXEvents.triggers;
var fallback;
var inRedraw = false; // -----------------------------------
api.ready = function () {
designer = Webflow.env('design');
init();
};
api.design = function () {
designer = true; // Helps slider init on Designer load.
setTimeout(init, 1000);
};
api.preview = function () {
designer = false;
init();
};
api.redraw = function () {
inRedraw = true;
init();
inRedraw = false;
};
api.destroy = removeListeners; // -----------------------------------
function init() {
$sliders = $doc.find(namespace);
if (!$sliders.length) {
return;
}
$sliders.each(build);
if (fallback) {
return;
}
removeListeners();
addListeners();
}
function removeListeners() {
Webflow.resize.off(renderAll);
Webflow.redraw.off(api.redraw);
}
function addListeners() {
Webflow.resize.on(renderAll);
Webflow.redraw.on(api.redraw);
}
function renderAll() {
$sliders.filter(':visible').each(render);
}
function build(i, el) {
var $el = $(el); // Store slider state in data
var data = $.data(el, namespace);
if (!data) {
data = $.data(el, namespace, {
index: 0,
depth: 1,
hasFocus: {
keyboard: false,
mouse: false
},
el: $el,
config: {}
});
}
data.mask = $el.children('.w-slider-mask');
data.left = $el.children('.w-slider-arrow-left');
data.right = $el.children('.w-slider-arrow-right');
data.nav = $el.children('.w-slider-nav');
data.slides = data.mask.children('.w-slide');
data.slides.each(ix.reset);
if (inRedraw) {
data.maskWidth = 0;
}
if ($el.attr('role') === undefined) {
$el.attr('role', 'region');
}
if ($el.attr('aria-label') === undefined) {
$el.attr('aria-label', 'carousel');
} // Store the ID of the slider slide view mask
var slideViewId = data.mask.attr('id'); // If user did not provide an ID, set it
if (!slideViewId) {
slideViewId = 'w-slider-mask-' + i;
data.mask.attr('id', slideViewId);
} // Create aria live label
if (!designer && !data.ariaLiveLabel) {
data.ariaLiveLabel = $(ariaLiveLabelHtml).appendTo(data.mask);
} // Add attributes to left/right buttons
data.left.attr('role', 'button');
data.left.attr('tabindex', '0');
data.left.attr('aria-controls', slideViewId);
if (data.left.attr('aria-label') === undefined) {
data.left.attr('aria-label', 'previous slide');
}
data.right.attr('role', 'button');
data.right.attr('tabindex', '0');
data.right.attr('aria-controls', slideViewId);
if (data.right.attr('aria-label') === undefined) {
data.right.attr('aria-label', 'next slide');
} // Disable in old browsers
if (!tram.support.transform) {
data.left.hide();
data.right.hide();
data.nav.hide();
fallback = true;
return;
} // Remove old events
data.el.off(namespace);
data.left.off(namespace);
data.right.off(namespace);
data.nav.off(namespace); // Set config from data attributes
configure(data); // Add events based on mode
if (designer) {
data.el.on('setting' + namespace, handler(data));
stopTimer(data);
data.hasTimer = false;
} else {
data.el.on('swipe' + namespace, handler(data));
data.left.on('click' + namespace, previousFunction(data));
data.right.on('click' + namespace, next(data));
data.left.on('keydown' + namespace, keyboardSlideButtonsFunction(data, previousFunction));
data.right.on('keydown' + namespace, keyboardSlideButtonsFunction(data, next)); // Listen to nav keyboard events
data.nav.on('keydown' + namespace, '> div', handler(data)); // Start timer if autoplay is true, only once
if (data.config.autoplay && !data.hasTimer) {
data.hasTimer = true;
data.timerCount = 1;
startTimer(data);
}
data.el.on('mouseenter' + namespace, hasFocus(data, true, 'mouse'));
data.el.on('focusin' + namespace, hasFocus(data, true, 'keyboard'));
data.el.on('mouseleave' + namespace, hasFocus(data, false, 'mouse'));
data.el.on('focusout' + namespace, hasFocus(data, false, 'keyboard'));
} // Listen to nav click events
data.nav.on('click' + namespace, '> div', handler(data)); // Remove gaps from formatted html (for inline-blocks)
if (!inApp) {
data.mask.contents().filter(function () {
return this.nodeType === 3;
}).remove();
} // If slider or any parent is hidden, temporarily show for measurements (https://github.com/webflow/webflow/issues/24921)
var $elHidden = $el.filter(':hidden');
$elHidden.addClass(forceShow);
var $elHiddenParents = $el.parents(':hidden');
$elHiddenParents.addClass(forceShow); // Run first render
if (!inRedraw) {
render(i, el);
} // If slider or any parent is hidden, reset after temporarily showing for measurements
$elHidden.removeClass(forceShow);
$elHiddenParents.removeClass(forceShow);
}
function configure(data) {
var config = {};
config.crossOver = 0; // Set config options from data attributes
config.animation = data.el.attr('data-animation') || 'slide';
if (config.animation === 'outin') {
config.animation = 'cross';
config.crossOver = 0.5;
}
config.easing = data.el.attr('data-easing') || 'ease';
var duration = data.el.attr('data-duration');
config.duration = duration != null ? parseInt(duration, 10) : 500;
if (isAttrTrue(data.el.attr('data-infinite'))) {
config.infinite = true;
}
if (isAttrTrue(data.el.attr('data-disable-swipe'))) {
config.disableSwipe = true;
}
if (isAttrTrue(data.el.attr('data-hide-arrows'))) {
config.hideArrows = true;
} else if (data.config.hideArrows) {
data.left.show();
data.right.show();
}
if (isAttrTrue(data.el.attr('data-autoplay'))) {
config.autoplay = true;
config.delay = parseInt(data.el.attr('data-delay'), 10) || 2000;
config.timerMax = parseInt(data.el.attr('data-autoplay-limit'), 10); // Disable timer on first touch or mouse down
var touchEvents = 'mousedown' + namespace + ' touchstart' + namespace;
if (!designer) {
data.el.off(touchEvents).one(touchEvents, function () {
stopTimer(data);
});
}
} // Use edge buffer to help calculate page count
var arrowWidth = data.right.width();
config.edge = arrowWidth ? arrowWidth + 40 : 100; // Store config in data
data.config = config;
}
function isAttrTrue(value) {
return value === '1' || value === 'true';
}
function hasFocus(data, focusIn, eventType) {
return function (evt) {
if (!focusIn) {
if ($.contains(data.el.get(0), evt.relatedTarget)) {
return;
}
data.hasFocus[eventType] = focusIn; // Prevent Aria live change if focused by other input
if (data.hasFocus.mouse && eventType === 'keyboard' || data.hasFocus.keyboard && eventType === 'mouse') {
return;
}
} else {
data.hasFocus[eventType] = focusIn;
}
if (focusIn) {
data.ariaLiveLabel.attr('aria-live', 'polite');
if (data.hasTimer) {
stopTimer(data);
}
} else {
data.ariaLiveLabel.attr('aria-live', 'off');
if (data.hasTimer) {
startTimer(data);
}
}
return;
};
}
function keyboardSlideButtonsFunction(data, directionFunction) {
return function (evt) {
switch (evt.keyCode) {
case KEY_CODES.SPACE:
case KEY_CODES.ENTER:
{
directionFunction(data)();
evt.preventDefault();
return evt.stopPropagation();
}
}
};
}
function previousFunction(data) {
return function () {
change(data, {
index: data.index - 1,
vector: -1
});
};
}
function next(data) {
return function () {
change(data, {
index: data.index + 1,
vector: 1
});
};
}
function select(data, value) {
var found = null;
if (value === data.slides.length) {
init();
layout(data); // Rebuild and find new slides
}
_.each(data.anchors, function (anchor, index) {
$(anchor.els).each(function (i, el) {
if ($(el).index() === value) {
found = index;
}
});
});
if (found != null) {
change(data, {
index: found,
immediate: true
});
}
}
function startTimer(data) {
stopTimer(data);
var config = data.config;
var timerMax = config.timerMax;
if (timerMax && data.timerCount++ > timerMax) {
return;
}
data.timerId = window.setTimeout(function () {
if (data.timerId == null || designer) {
return;
}
next(data)();
startTimer(data);
}, config.delay);
}
function stopTimer(data) {
window.clearTimeout(data.timerId);
data.timerId = null;
}
function handler(data) {
return function (evt, options) {
options = options || {};
var config = data.config; // Designer settings
if (designer && evt.type === 'setting') {
if (options.select === 'prev') {
return previousFunction(data)();
}
if (options.select === 'next') {
return next(data)();
}
configure(data);
layout(data);
if (options.select == null) {
return;
}
select(data, options.select);
return;
} // Swipe event
if (evt.type === 'swipe') {
if (config.disableSwipe) {
return;
}
if (Webflow.env('editor')) {
return;
}
if (options.direction === 'left') {
return next(data)();
}
if (options.direction === 'right') {
return previousFunction(data)();
}
return;
} // Page buttons
if (data.nav.has(evt.target).length) {
var index = $(evt.target).index();
if (evt.type === 'click') {
change(data, {
index: index
});
}
if (evt.type === 'keydown') {
switch (evt.keyCode) {
case KEY_CODES.ENTER:
case KEY_CODES.SPACE:
{
change(data, {
index: index
});
evt.preventDefault();
break;
}
case KEY_CODES.ARROW_LEFT:
case KEY_CODES.ARROW_UP:
{
focusDot(data.nav, Math.max(index - 1, 0));
evt.preventDefault();
break;
}
case KEY_CODES.ARROW_RIGHT:
case KEY_CODES.ARROW_DOWN:
{
focusDot(data.nav, Math.min(index + 1, data.pages));
evt.preventDefault();
break;
}
case KEY_CODES.HOME:
{
focusDot(data.nav, 0);
evt.preventDefault();
break;
}
case KEY_CODES.END:
{
focusDot(data.nav, data.pages);
evt.preventDefault();
break;
}
default:
{
return;
}
}
}
}
};
}
function focusDot($nav, index) {
var $active = $nav.children().eq(index).focus();
$nav.children().not($active);
}
function change(data, options) {
options = options || {};
var config = data.config;
var anchors = data.anchors; // Set new index
data.previous = data.index;
var index = options.index;
var shift = {};
if (index < 0) {
index = anchors.length - 1;
if (config.infinite) {
shift.x = -data.endX;
shift.from = 0;
shift.to = anchors[0].width;
}
} else if (index >= anchors.length) {
index = 0;
if (config.infinite) {
shift.x = anchors[anchors.length - 1].width;
shift.from = -anchors[anchors.length - 1].x;
shift.to = shift.from - shift.x;
}
}
data.index = index; // Select nav dot; set class active
var $active = data.nav.children().eq(index).addClass('w-active').attr('aria-pressed', 'true').attr('tabindex', '0');
data.nav.children().not($active).removeClass('w-active').attr('aria-pressed', 'false').attr('tabindex', '-1'); // Hide arrows
if (config.hideArrows) {
data.index === anchors.length - 1 ? data.right.hide() : data.right.show();
data.index === 0 ? data.left.hide() : data.left.show();
} // Get page offset from anchors
var lastOffsetX = data.offsetX || 0;
var offsetX = data.offsetX = -anchors[data.index].x;
var resetConfig = {
x: offsetX,
opacity: 1,
visibility: ''
}; // Transition slides
var targets = $(anchors[data.index].els);
var prevTargs = $(anchors[data.previous] && anchors[data.previous].els);
var others = data.slides.not(targets);
var animation = config.animation;
var easing = config.easing;
var duration = Math.round(config.duration);
var vector = options.vector || (data.index > data.previous ? 1 : -1);
var fadeRule = 'opacity ' + duration + 'ms ' + easing;
var slideRule = 'transform ' + duration + 'ms ' + easing; // Make active slides' content focusable
targets.find(FOCUSABLE_SELECTOR).removeAttr('tabindex');
targets.removeAttr('aria-hidden'); // Voiceover bug: Sometimes descendants are still visible, so hide everything...
targets.find('*').removeAttr('aria-hidden'); // Prevent focus on inactive slides' content
others.find(FOCUSABLE_SELECTOR).attr('tabindex', '-1');
others.attr('aria-hidden', 'true'); // Voiceover bug: Sometimes descendants are still visible, so hide everything...
others.find('*').attr('aria-hidden', 'true'); // Trigger IX events
if (!designer) {
targets.each(ix.intro);
others.each(ix.outro);
} // Set immediately after layout changes (but not during redraw)
if (options.immediate && !inRedraw) {
tram(targets).set(resetConfig);
resetOthers();
return;
} // Exit early if index is unchanged
if (data.index === data.previous) {
return;
} // Announce slide change to screen reader
if (!designer) {
data.ariaLiveLabel.text("Slide ".concat(index + 1, " of ").concat(anchors.length, "."));
} // Cross Fade / Out-In
if (animation === 'cross') {
var reduced = Math.round(duration - duration * config.crossOver);
var wait = Math.round(duration - reduced);
fadeRule = 'opacity ' + reduced + 'ms ' + easing;
tram(prevTargs).set({
visibility: ''
}).add(fadeRule).start({
opacity: 0
});
tram(targets).set({
visibility: '',
x: offsetX,
opacity: 0,
zIndex: data.depth++
}).add(fadeRule).wait(wait).then({
opacity: 1
}).then(resetOthers);
return;
} // Fade Over
if (animation === 'fade') {
tram(prevTargs).set({
visibility: ''
}).stop();
tram(targets).set({
visibility: '',
x: offsetX,
opacity: 0,
zIndex: data.depth++
}).add(fadeRule).start({
opacity: 1
}).then(resetOthers);
return;
} // Slide Over
if (animation === 'over') {
resetConfig = {
x: data.endX
};
tram(prevTargs).set({
visibility: ''
}).stop();
tram(targets).set({
visibility: '',
zIndex: data.depth++,
x: offsetX + anchors[data.index].width * vector
}).add(slideRule).start({
x: offsetX
}).then(resetOthers);
return;
} // Slide - infinite scroll
if (config.infinite && shift.x) {
tram(data.slides.not(prevTargs)).set({
visibility: '',
x: shift.x
}).add(slideRule).start({
x: offsetX
});
tram(prevTargs).set({
visibility: '',
x: shift.from
}).add(slideRule).start({
x: shift.to
});
data.shifted = prevTargs;
} else {
if (config.infinite && data.shifted) {
tram(data.shifted).set({
visibility: '',
x: lastOffsetX
});
data.shifted = null;
} // Slide - basic scroll
tram(data.slides).set({
visibility: ''
}).add(slideRule).start({
x: offsetX
});
} // Helper to move others out of view
function resetOthers() {
targets = $(anchors[data.index].els);
others = data.slides.not(targets);
if (animation !== 'slide') {
resetConfig.visibility = 'hidden';
}
tram(others).set(resetConfig);
}
}
function render(i, el) {
var data = $.data(el, namespace);
if (!data) {
return;
}
if (maskChanged(data)) {
return layout(data);
}
if (designer && slidesChanged(data)) {
layout(data);
}
}
function layout(data) {
var pages = 1;
var offset = 0;
var anchor = 0;
var width = 0;
var maskWidth = data.maskWidth;
var threshold = maskWidth - data.config.edge;
if (threshold < 0) {
threshold = 0;
}
data.anchors = [{
els: [],
x: 0,
width: 0
}];
data.slides.each(function (i, el) {
if (anchor - offset > threshold) {
pages++;
offset += maskWidth; // Store page anchor for transition
data.anchors[pages - 1] = {
els: [],
x: anchor,
width: 0
};
} // Set next anchor using current width + margin
width = $(el).outerWidth(true);
anchor += width;
data.anchors[pages - 1].width += width;
data.anchors[pages - 1].els.push(el);
var ariaLabel = i + 1 + ' of ' + data.slides.length;
$(el).attr('aria-label', ariaLabel);
$(el).attr('role', 'group');
});
data.endX = anchor; // Build dots if nav exists and needs updating
if (designer) {
data.pages = null;
}
if (data.nav.length && data.pages !== pages) {
data.pages = pages;
buildNav(data);
} // Make sure index is still within range and call change handler
var index = data.index;
if (index >= pages) {
index = pages - 1;
}
change(data, {
immediate: true,
index: index
});
}
function buildNav(data) {
var dots = [];
var $dot;
var spacing = data.el.attr('data-nav-spacing');
if (spacing) {
spacing = parseFloat(spacing) + 'px';
}
for (var i = 0, len = data.pages; i < len; i++) {
$dot = $(dot);
$dot.attr('aria-label', 'Show slide ' + (i + 1) + ' of ' + len).attr('aria-pressed', 'false').attr('role', 'button').attr('tabindex', '-1');
if (data.nav.hasClass('w-num')) {
$dot.text(i + 1);
}
if (spacing != null) {
$dot.css({
'margin-left': spacing,
'margin-right': spacing
});
}
dots.push($dot);
}
data.nav.empty().append(dots);
}
function maskChanged(data) {
var maskWidth = data.mask.width();
if (data.maskWidth !== maskWidth) {
data.maskWidth = maskWidth;
return true;
}
return false;
}
function slidesChanged(data) {
var slidesWidth = 0;
data.slides.each(function (i, el) {
slidesWidth += $(el).outerWidth(true);
});
if (data.slidesWidth !== slidesWidth) {
data.slidesWidth = slidesWidth;
return true;
}
return false;
} // Export module
return api;
});
 })
 ]);
Webflow.require('ix2').init(
{"events":{"e-3":{"id":"e-3","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-p","smoothing":50,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1513907147014},"e-4":{"id":"e-4","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-2","affectedElements":{},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-2-p","smoothing":50,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1513908005162},"e-5":{"id":"e-5","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a","affectedElements":{"384917b4-b7de-20b5-952b-ad7735de035c":{"selector":".sphere-3","selectorGuids":["9372c6c4-8deb-8878-6f4e-17b9213b8496"],"limitAffectedElements":null},"22b9fa69-9309-dbf2-89b5-04eb2e4024e3":{"selector":".sphere-2","selectorGuids":["9eb5d525-7fbb-2fb6-db21-3e783fedee26"],"limitAffectedElements":null},"60361a38-a124-1ffc-4a01-bb6302979a03":{"selector":".sphere-1","selectorGuids":["bfc65d18-f746-3a3f-a0c3-33e38a064e14"],"limitAffectedElements":null}},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-p","smoothing":50,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1513908898369},"e-6":{"id":"e-6","animationType":"custom","eventTypeId":"PAGE_SCROLL","action":{"id":"","actionTypeId":"GENERAL_CONTINUOUS_ACTION","config":{"actionListId":"a-2","affectedElements":{"622c3947833bd306919639d7|2bc71b14-7b85-d1c8-709a-85ed1df1e52f":{"selector":".outline-circle-3","selectorGuids":["24cf6ad3-e21a-d751-3b5d-a4e8508f45f0"],"limitAffectedElements":null},"622c3947833bd306919639d7|f4853d92-692a-df0b-ea8d-f9e0a0a818bd":{"selector":".outline-circle-2","selectorGuids":["b5167acb-317c-c221-cab9-d189540a336f"],"limitAffectedElements":null},"622c3947833bd306919639d7|51d6130d-f073-2031-c395-ce4a57aadc8c":{"selector":".outline-circle-1","selectorGuids":["8f0ed8c3-75e6-4a4c-a808-4e4fa98b06be"],"limitAffectedElements":null}},"duration":0}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8","appliesTo":"PAGE","styleBlockIds":[]}],"config":[{"continuousParameterGroupId":"a-2-p","smoothing":50,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}],"createdOn":1513909122010},"e-9":{"id":"e-9","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-10"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"5699bda7-417e-eacb-30ba-58ac48d337f4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"5699bda7-417e-eacb-30ba-58ac48d337f4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517944991691},"e-10":{"id":"e-10","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-5","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-9"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"5699bda7-417e-eacb-30ba-58ac48d337f4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"5699bda7-417e-eacb-30ba-58ac48d337f4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517944991692},"e-19":{"id":"e-19","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{"8d9a37d2-8100-5dcc-44c1-ce6835108835":{"selector":".dropdown-arrow.white","selectorGuids":["ed04a6e4-e130-47ec-0db8-1536e3b91c38","b8f166ea-5531-c3a5-8794-0aea67ed07d0"],"limitAffectedElements":"CHILDREN"}},"playInReverse":false,"autoStopEventId":"e-20"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"8159f339-12d4-f247-9b30-4ccc567b572e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"8159f339-12d4-f247-9b30-4ccc567b572e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517945755693},"e-20":{"id":"e-20","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-5","affectedElements":{"8d9a37d2-8100-5dcc-44c1-ce6835108835":{"selector":".dropdown-arrow.white","selectorGuids":["ed04a6e4-e130-47ec-0db8-1536e3b91c38","b8f166ea-5531-c3a5-8794-0aea67ed07d0"],"limitAffectedElements":"CHILDREN"}},"playInReverse":false,"autoStopEventId":"e-19"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"8159f339-12d4-f247-9b30-4ccc567b572e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"8159f339-12d4-f247-9b30-4ccc567b572e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517945755694},"e-29":{"id":"e-29","animationType":"custom","eventTypeId":"PAGE_START","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{"622c3947833bd336e99639d0|5a382927284c460001a09b32":{"selector":".body","selectorGuids":["b289e758-de9a-52a5-7946-b509f78f9b5d"],"limitAffectedElements":null}},"playInReverse":false,"autoStopEventId":"e-30"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8","appliesTo":"PAGE","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517946342571},"e-33":{"id":"e-33","animationType":"custom","eventTypeId":"PAGE_START","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{"622c3947833bd336e99639d0|5a382927284c460001a09b32":{"selector":".body","selectorGuids":["b289e758-de9a-52a5-7946-b509f78f9b5d"],"limitAffectedElements":null}},"playInReverse":false,"autoStopEventId":"e-34"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9","appliesTo":"PAGE","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517946464476},"e-41":{"id":"e-41","animationType":"custom","eventTypeId":"PAGE_START","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-3","affectedElements":{"622c3947833bd336e99639d0|5a382927284c460001a09b32":{"selector":".body","selectorGuids":["b289e758-de9a-52a5-7946-b509f78f9b5d"],"limitAffectedElements":null}},"playInReverse":false,"autoStopEventId":"e-42"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7","appliesTo":"PAGE","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7","appliesTo":"PAGE","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1517946805051},"e-51":{"id":"e-51","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|4496f71e-fefc-7598-5939-fd05572cb697"}},"playInReverse":false,"autoStopEventId":"e-52"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|4496f71e-fefc-7598-5939-fd05572cb697","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|4496f71e-fefc-7598-5939-fd05572cb697","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":5,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950132140},"e-55":{"id":"e-55","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|efc303fc-36a2-863e-dd85-2868a9c0eb69"}},"playInReverse":false,"autoStopEventId":"e-56"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|efc303fc-36a2-863e-dd85-2868a9c0eb69","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|efc303fc-36a2-863e-dd85-2868a9c0eb69","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950174964},"e-65":{"id":"e-65","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd321959639d8|4978654e-89eb-15f6-8692-f89f3fdf3cdd"}},"playInReverse":false,"autoStopEventId":"e-66"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|4978654e-89eb-15f6-8692-f89f3fdf3cdd","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|4978654e-89eb-15f6-8692-f89f3fdf3cdd","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950437372},"e-67":{"id":"e-67","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd321959639d8|d90968b3-87a0-ef7c-0ef3-1c69b2903dbc"}},"playInReverse":false,"autoStopEventId":"e-68"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|d90968b3-87a0-ef7c-0ef3-1c69b2903dbc","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|d90968b3-87a0-ef7c-0ef3-1c69b2903dbc","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950449038},"e-69":{"id":"e-69","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd321959639d8|87c4681e-8d17-5a78-0ae2-377264fb22d1"}},"playInReverse":false,"autoStopEventId":"e-70"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|87c4681e-8d17-5a78-0ae2-377264fb22d1","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|87c4681e-8d17-5a78-0ae2-377264fb22d1","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950456981},"e-75":{"id":"e-75","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd321959639d8|8753b2d6-f142-b28b-05d5-b416edb6c52f"}},"playInReverse":false,"autoStopEventId":"e-76"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|8753b2d6-f142-b28b-05d5-b416edb6c52f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|8753b2d6-f142-b28b-05d5-b416edb6c52f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950484781},"e-81":{"id":"e-81","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|09361d34-ef7b-eee1-a627-1f99f9d9cba4"}},"playInReverse":false,"autoStopEventId":"e-82"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|09361d34-ef7b-eee1-a627-1f99f9d9cba4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|09361d34-ef7b-eee1-a627-1f99f9d9cba4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950669367},"e-83":{"id":"e-83","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd321959639d8|ab11a4f1-5456-72a0-97f1-394454af830a"}},"playInReverse":false,"autoStopEventId":"e-84"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|ab11a4f1-5456-72a0-97f1-394454af830a","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|ab11a4f1-5456-72a0-97f1-394454af830a","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950696679},"e-85":{"id":"e-85","animationType":"custom","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|09361d34-ef7b-eee1-a627-1f99f9d9cba4"}},"playInReverse":false,"autoStopEventId":"e-86"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|09361d34-ef7b-eee1-a627-1f99f9d9cba4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|09361d34-ef7b-eee1-a627-1f99f9d9cba4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1517950741038},"e-109":{"id":"e-109","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-110"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|a9145be4-e56f-0f80-3782-c5d701ef5ee2","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|a9145be4-e56f-0f80-3782-c5d701ef5ee2","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577387764084},"e-113":{"id":"e-113","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-114"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|54f710e9-2087-806b-8b44-6a4ce731bc78","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|54f710e9-2087-806b-8b44-6a4ce731bc78","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577387780823},"e-115":{"id":"e-115","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-116"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|673458ee-b802-bbbe-1be2-d30e22da4a5b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|673458ee-b802-bbbe-1be2-d30e22da4a5b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1577387787653},"e-119":{"id":"e-119","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-120"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|62ec99ef-10cd-f018-26c4-5a3a14c88aba","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|62ec99ef-10cd-f018-26c4-5a3a14c88aba","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1577387807612},"e-121":{"id":"e-121","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-122"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|6946c605-3e28-4074-8e3d-160edbceeb3b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|6946c605-3e28-4074-8e3d-160edbceeb3b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577387853758},"e-125":{"id":"e-125","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-126"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|6c8a5959-0590-ecf3-929e-f8d1bc601501","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|6c8a5959-0590-ecf3-929e-f8d1bc601501","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577387870658},"e-129":{"id":"e-129","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-130"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|983d7acc-525b-7cdc-0469-fed906c956ec","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|983d7acc-525b-7cdc-0469-fed906c956ec","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577387888229},"e-133":{"id":"e-133","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-134"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|42e85a08-5a9c-36df-33b1-4bf32b6dde09","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|42e85a08-5a9c-36df-33b1-4bf32b6dde09","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577387976704},"e-135":{"id":"e-135","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-136"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|90d69312-cbf3-e4e8-0804-159e66eb0254","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|90d69312-cbf3-e4e8-0804-159e66eb0254","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577388046277},"e-137":{"id":"e-137","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-138"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f353790b-96bd-cf11-0af2-67b65bd08e97","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f353790b-96bd-cf11-0af2-67b65bd08e97","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577388058840},"e-147":{"id":"e-147","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-148"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|27f561ff-0a04-7f92-e361-f2baf0b678ad","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|27f561ff-0a04-7f92-e361-f2baf0b678ad","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577388108399},"e-151":{"id":"e-151","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-152"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|1d52a304-86b0-fc80-d74f-63dadc68a65d","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|1d52a304-86b0-fc80-d74f-63dadc68a65d","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577388126540},"e-155":{"id":"e-155","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-156"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|86e445d6-9893-e5fa-3fb1-9e77cd19446c","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|86e445d6-9893-e5fa-3fb1-9e77cd19446c","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577388141364},"e-203":{"id":"e-203","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-204"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|a9145be4-e56f-0f80-3782-c5d701ef5ee2","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|a9145be4-e56f-0f80-3782-c5d701ef5ee2","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577388399026},"e-205":{"id":"e-205","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-206"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|f30d6da2-edb8-d9b4-f279-95fb271d2019","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|f30d6da2-edb8-d9b4-f279-95fb271d2019","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577388405063},"e-207":{"id":"e-207","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-208"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|4f58caee-dc70-c7b1-b280-fd74a4aac3ba","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|4f58caee-dc70-c7b1-b280-fd74a4aac3ba","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577388760797},"e-209":{"id":"e-209","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-210"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|54f710e9-2087-806b-8b44-6a4ce731bc78","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|54f710e9-2087-806b-8b44-6a4ce731bc78","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1577388767961},"e-211":{"id":"e-211","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-212"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|673458ee-b802-bbbe-1be2-d30e22da4a5b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|673458ee-b802-bbbe-1be2-d30e22da4a5b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1577388779314},"e-213":{"id":"e-213","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-214"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|62ec99ef-10cd-f018-26c4-5a3a14c88aba","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|62ec99ef-10cd-f018-26c4-5a3a14c88aba","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1577388786795},"e-225":{"id":"e-225","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-226"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|ffe3b6eb-0d0b-2b36-5611-13e3250e950d","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|ffe3b6eb-0d0b-2b36-5611-13e3250e950d","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577388856653},"e-229":{"id":"e-229","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-230"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|bb054132-3376-c466-4c7a-7a7e62805030","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|bb054132-3376-c466-4c7a-7a7e62805030","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577388978950},"e-233":{"id":"e-233","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-234"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|e538cdd2-bc31-8b0b-efe2-0eb74e7c5df4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|e538cdd2-bc31-8b0b-efe2-0eb74e7c5df4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577388997160},"e-237":{"id":"e-237","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-238"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|fd7c0925-a263-534c-6d89-f94c57a8c651","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|fd7c0925-a263-534c-6d89-f94c57a8c651","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577389014396},"e-241":{"id":"e-241","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-242"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|fb531890-280a-9160-df26-36ce2c9eb55c","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|fb531890-280a-9160-df26-36ce2c9eb55c","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577389034578},"e-243":{"id":"e-243","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-244"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|41d1c305-26e3-1d76-b367-9d43a44ddd3e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|41d1c305-26e3-1d76-b367-9d43a44ddd3e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577389041399},"e-253":{"id":"e-253","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-254"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|7bad7945-29c1-f27e-f0f4-d2f482533697","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|7bad7945-29c1-f27e-f0f4-d2f482533697","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577389096050},"e-257":{"id":"e-257","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-258"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|5a8a89a4-6571-8d61-94d7-a34db470fc95","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|5a8a89a4-6571-8d61-94d7-a34db470fc95","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577389115629},"e-259":{"id":"e-259","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-260"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|1226d6b7-d81b-fabc-5d77-bd1afd5cd1c9","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|1226d6b7-d81b-fabc-5d77-bd1afd5cd1c9","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577389127731},"e-291":{"id":"e-291","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-292"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|b4fbe460-cb4f-73b8-b33b-673c323e4391","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|b4fbe460-cb4f-73b8-b33b-673c323e4391","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577389296217},"e-293":{"id":"e-293","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-294"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|8d242aac-2217-bef1-15d7-276a4b3b1fd7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|8d242aac-2217-bef1-15d7-276a4b3b1fd7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577389303720},"e-295":{"id":"e-295","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-296"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|a5b853da-ccaf-ecef-cfb9-f2316874a72e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|a5b853da-ccaf-ecef-cfb9-f2316874a72e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577389311689},"e-315":{"id":"e-315","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-316"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|6f8eabf4-2302-7c74-09cc-dbd54352e7cf","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|6f8eabf4-2302-7c74-09cc-dbd54352e7cf","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577389561887},"e-317":{"id":"e-317","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-318"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|3df433a0-1512-518c-2f1b-c086c6d49878","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|3df433a0-1512-518c-2f1b-c086c6d49878","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577389572180},"e-319":{"id":"e-319","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-320"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|2df10772-7042-94eb-59a3-200a8096aacc","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|2df10772-7042-94eb-59a3-200a8096aacc","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577389579041},"e-321":{"id":"e-321","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-322"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|29b294ca-3378-512b-d044-de015160c413","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|29b294ca-3378-512b-d044-de015160c413","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1577389589064},"e-323":{"id":"e-323","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-324"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|56f14405-072c-5b96-b6c3-1cb63afee0f6","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|56f14405-072c-5b96-b6c3-1cb63afee0f6","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1577389596759},"e-325":{"id":"e-325","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-326"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|5d7893e8-fb96-616f-4493-4086e2fbe3c4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|5d7893e8-fb96-616f-4493-4086e2fbe3c4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1577389605581},"e-327":{"id":"e-327","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-328"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|d0681de7-21f5-6886-f701-0aac905fc8b8","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|d0681de7-21f5-6886-f701-0aac905fc8b8","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1577389658273},"e-329":{"id":"e-329","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-330"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|a538201c-cf69-0ecd-6b52-82362a31b49d","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|a538201c-cf69-0ecd-6b52-82362a31b49d","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1577389669011},"e-331":{"id":"e-331","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-332"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|d004baad-72f8-dc23-15c3-9aceb88accb4","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|d004baad-72f8-dc23-15c3-9aceb88accb4","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1577389677780},"e-333":{"id":"e-333","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-334"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|3ea54cbe-1c3a-326c-ad02-ba7cc1affaff","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|3ea54cbe-1c3a-326c-ad02-ba7cc1affaff","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1577389686805},"e-335":{"id":"e-335","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-336"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|3117c54a-fee9-b0a0-cd36-69cef42f7604","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|3117c54a-fee9-b0a0-cd36-69cef42f7604","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1577389696693},"e-425":{"id":"e-425","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-4","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-426"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"e7688e11-35b7-5045-a9e6-e3313ef8a6e8","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"e7688e11-35b7-5045-a9e6-e3313ef8a6e8","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1631649077953},"e-426":{"id":"e-426","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-5","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-425"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"e7688e11-35b7-5045-a9e6-e3313ef8a6e8","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"e7688e11-35b7-5045-a9e6-e3313ef8a6e8","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1631649077970},"e-429":{"id":"e-429","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb7029"}},"playInReverse":false,"autoStopEventId":"e-430"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb7029","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb7029","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":5,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647069125235},"e-435":{"id":"e-435","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-436"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb703c","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb703c","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647069125235},"e-437":{"id":"e-437","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-438"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb7043","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|01f76391-7d40-91e1-1d2a-d56dfefb7043","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647069125235},"e-439":{"id":"e-439","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15b5"}},"playInReverse":false,"autoStopEventId":"e-440"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15b5","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15b5","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118151889},"e-441":{"id":"e-441","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-442"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15b6","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15b6","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118151889},"e-443":{"id":"e-443","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-444"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15cf","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|e88a6c3d-3b6d-2ae2-e1a3-f79b8eef15cf","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118151889},"e-453":{"id":"e-453","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2051"}},"playInReverse":false,"autoStopEventId":"e-454"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2051","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2051","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118440088},"e-455":{"id":"e-455","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-456"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2052","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2052","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118440088},"e-457":{"id":"e-457","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-458"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd205a","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd205a","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118440088},"e-459":{"id":"e-459","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-460"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2063","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2063","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647118440088},"e-461":{"id":"e-461","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-462"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd206a","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd206a","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1647118440088},"e-463":{"id":"e-463","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-464"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2071","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|f0774e93-4c61-9d62-d4b1-73125cfd2071","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1647118440088},"e-467":{"id":"e-467","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6dc"}},"playInReverse":false,"autoStopEventId":"e-468"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6dc","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6dc","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118494969},"e-469":{"id":"e-469","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-470"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6dd","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6dd","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118494969},"e-471":{"id":"e-471","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-472"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6e5","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6e5","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118494969},"e-473":{"id":"e-473","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-474"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6ee","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6ee","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647118494969},"e-475":{"id":"e-475","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-476"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6f5","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6f5","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1647118494969},"e-477":{"id":"e-477","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-478"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6fc","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa6fc","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1647118494969},"e-479":{"id":"e-479","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-480"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa703","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|fd4d4902-950f-17dd-04a8-c1dcf31aa703","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647118494969},"e-481":{"id":"e-481","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf342"}},"playInReverse":false,"autoStopEventId":"e-482"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf342","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf342","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118646993},"e-483":{"id":"e-483","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-484"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf343","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf343","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118646993},"e-485":{"id":"e-485","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-486"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf34b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf34b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118646993},"e-487":{"id":"e-487","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-488"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf354","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|7c857a12-72bb-6605-680b-58dd73aaf354","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647118646993},"e-495":{"id":"e-495","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b0e"}},"playInReverse":false,"autoStopEventId":"e-496"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b0e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b0e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118724237},"e-497":{"id":"e-497","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-498"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b0f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b0f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118724237},"e-499":{"id":"e-499","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-500"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b17","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b17","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118724237},"e-501":{"id":"e-501","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-502"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b20","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b20","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647118724237},"e-503":{"id":"e-503","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-504"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b27","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b27","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1647118724237},"e-505":{"id":"e-505","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-506"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b2e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c26d4b18-e358-e2a7-7553-c9c457ff3b2e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1647118724237},"e-509":{"id":"e-509","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a268"}},"playInReverse":false,"autoStopEventId":"e-510"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a268","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a268","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118770314},"e-511":{"id":"e-511","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-512"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a269","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a269","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118770314},"e-513":{"id":"e-513","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-514"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a271","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a271","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118770314},"e-515":{"id":"e-515","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-516"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a27a","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a27a","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647118770314},"e-517":{"id":"e-517","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-518"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a281","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a281","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1647118770314},"e-519":{"id":"e-519","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-520"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a288","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a288","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1647118770314},"e-521":{"id":"e-521","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-522"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a28f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|c0ffe7a1-1bfe-d9e9-7d14-72098b70a28f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647118770314},"e-523":{"id":"e-523","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03c5"}},"playInReverse":false,"autoStopEventId":"e-524"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03c5","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03c5","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647118898391},"e-525":{"id":"e-525","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-526"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03c6","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03c6","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647118898391},"e-527":{"id":"e-527","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-528"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03ce","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03ce","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647118898391},"e-529":{"id":"e-529","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-530"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03d7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03d7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647118898391},"e-531":{"id":"e-531","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-532"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03de","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03de","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true},"createdOn":1647118898391},"e-533":{"id":"e-533","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-534"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03e5","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03e5","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":700,"direction":"BOTTOM","effectIn":true},"createdOn":1647118898391},"e-535":{"id":"e-535","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-536"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03ec","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|194d2d33-5916-0525-43d3-95576c6f03ec","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647118898391},"e-537":{"id":"e-537","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-538"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|7593a3a5-8c13-a9b9-e6e7-48bea43a4da8","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|7593a3a5-8c13-a9b9-e6e7-48bea43a4da8","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154369028},"e-539":{"id":"e-539","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-540"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|4db38381-6b09-b933-9058-b66d315c57ff","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|4db38381-6b09-b933-9058-b66d315c57ff","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154370931},"e-541":{"id":"e-541","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-542"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|eaa0aac7-5bd2-2163-508d-b37186386787","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|eaa0aac7-5bd2-2163-508d-b37186386787","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154375230},"e-543":{"id":"e-543","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-544"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|459b0b25-aae3-c219-0f72-3a88fbc1982f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|459b0b25-aae3-c219-0f72-3a88fbc1982f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154381034},"e-545":{"id":"e-545","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-546"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|d0a067af-ea2d-3077-f2d0-520d9a70eece","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|d0a067af-ea2d-3077-f2d0-520d9a70eece","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154386052},"e-547":{"id":"e-547","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-548"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|8a284e9a-fd2a-603f-bb6b-6f3ff28c07b6","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|8a284e9a-fd2a-603f-bb6b-6f3ff28c07b6","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154386791},"e-549":{"id":"e-549","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-550"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|50eeb7ac-88b6-391b-8625-97408025b544","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|50eeb7ac-88b6-391b-8625-97408025b544","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154393612},"e-551":{"id":"e-551","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-552"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|bb236472-3ad8-4750-1067-82cfe234c15f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|bb236472-3ad8-4750-1067-82cfe234c15f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154394036},"e-553":{"id":"e-553","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-554"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|6648f219-3ff4-e257-3501-076387a15d8b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|6648f219-3ff4-e257-3501-076387a15d8b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154394506},"e-555":{"id":"e-555","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-556"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|d01bf392-46c1-32db-2294-f12876752508","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|d01bf392-46c1-32db-2294-f12876752508","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154399282},"e-557":{"id":"e-557","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-558"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|d2d98aee-63e7-50c5-eb05-498f1424e783","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|d2d98aee-63e7-50c5-eb05-498f1424e783","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154399661},"e-559":{"id":"e-559","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-560"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|97816712-f0cc-0309-e086-5dd2dc7238a9","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|97816712-f0cc-0309-e086-5dd2dc7238a9","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154399998},"e-561":{"id":"e-561","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-562"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|a01509e1-21b9-57b9-9006-2c1072b07964","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|a01509e1-21b9-57b9-9006-2c1072b07964","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154400496},"e-563":{"id":"e-563","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-564"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|3025d220-622c-15aa-718c-b590fec3027b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|3025d220-622c-15aa-718c-b590fec3027b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154410381},"e-565":{"id":"e-565","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-566"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|055696ae-d7b9-3100-b467-b74afee2754e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|055696ae-d7b9-3100-b467-b74afee2754e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154410964},"e-567":{"id":"e-567","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-568"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|edf2ea65-d644-f86a-fc72-55b85702382d","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|edf2ea65-d644-f86a-fc72-55b85702382d","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154411556},"e-569":{"id":"e-569","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-570"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|daf3702f-8e88-f6c0-2e33-6553c1e2b4d0","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|daf3702f-8e88-f6c0-2e33-6553c1e2b4d0","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154413547},"e-571":{"id":"e-571","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-572"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|dd5be771-b5de-6a70-0568-c6d130f21d1f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|dd5be771-b5de-6a70-0568-c6d130f21d1f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154414718},"e-573":{"id":"e-573","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-574"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|beeb4a5d-faba-fd4b-f120-ecc6a27da2c2","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|beeb4a5d-faba-fd4b-f120-ecc6a27da2c2","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647154561631},"e-575":{"id":"e-575","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-576"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|7487df92-c835-625d-dfa8-4927b38eea88","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|7487df92-c835-625d-dfa8-4927b38eea88","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647154596447},"e-579":{"id":"e-579","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-580"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd321959639d8|a4e7f8ba-25d1-1a5b-72f5-1050176d71e7","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd321959639d8|a4e7f8ba-25d1-1a5b-72f5-1050176d71e7","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647154624912},"e-581":{"id":"e-581","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85bda"}},"playInReverse":false,"autoStopEventId":"e-582"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85bda","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85bda","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":5,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647160088969},"e-583":{"id":"e-583","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-584"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85bdf","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85bdf","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647160088969},"e-585":{"id":"e-585","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-586"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85be6","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f8c68860-29a7-aaf5-5c47-16c889c85be6","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647160088969},"e-587":{"id":"e-587","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b188"}},"playInReverse":false,"autoStopEventId":"e-588"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b188","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b188","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":5,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647160412488},"e-589":{"id":"e-589","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-590"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b18d","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b18d","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647160412488},"e-591":{"id":"e-591","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-592"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b18e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f1849f7a-f842-3617-bc96-2537cb87b18e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647160412488},"e-593":{"id":"e-593","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e682"}},"playInReverse":false,"autoStopEventId":"e-594"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e682","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e682","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647160502111},"e-595":{"id":"e-595","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-596"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e687","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e687","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647160502111},"e-597":{"id":"e-597","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-598"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e68e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e68e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true},"createdOn":1647160502111},"e-599":{"id":"e-599","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-600"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e695","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|f56e0d19-a712-9e36-826e-1571e537e695","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1647160502111},"e-605":{"id":"e-605","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-606"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd3001f9639d9|be71e94b-ddb2-b2ee-d707-51f09f2b6958","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd3001f9639d9|be71e94b-ddb2-b2ee-d707-51f09f2b6958","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647160534464},"e-607":{"id":"e-607","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-6","affectedElements":{"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b":{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed50"}},"playInReverse":false,"autoStopEventId":"e-608"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed50","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed50","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":5,"scrollOffsetUnit":"%","delay":null,"direction":null,"effectIn":null},"createdOn":1647160948638},"e-609":{"id":"e-609","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-610"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed55","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed55","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647160948638},"e-611":{"id":"e-611","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-612"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed6e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|eb69f7b2-c641-4114-2008-f8eeef49ed6e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647160948638},"e-613":{"id":"e-613","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-614"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|4242ceab-6ddf-e463-ee7d-cc878c374662","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|4242ceab-6ddf-e463-ee7d-cc878c374662","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647160971496},"e-615":{"id":"e-615","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-616"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|9261201c-75b9-bd5e-b106-c8a4f98530cc","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|9261201c-75b9-bd5e-b106-c8a4f98530cc","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":"BOTTOM","effectIn":true},"createdOn":1647161555751},"e-617":{"id":"e-617","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-618"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"622c3947833bd306919639d7|b6ae411a-d003-0e3d-5d42-ec9d3ae42889","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"622c3947833bd306919639d7|b6ae411a-d003-0e3d-5d42-ec9d3ae42889","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":"BOTTOM","effectIn":true},"createdOn":1647161622526}},"actionLists":{"a":{"id":"a","title":"Parallax","continuousParameterGroups":[{"id":"a-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"60361a38-a124-1ffc-4a01-bb6302979a03"},"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"22b9fa69-9309-dbf2-89b5-04eb2e4024e3"},"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"384917b4-b7de-20b5-952b-ad7735de035c"},"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"keyframe":44,"actionItems":[{"id":"a-n-4","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"id":"60361a38-a124-1ffc-4a01-bb6302979a03"},"yValue":500,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"id":"22b9fa69-9309-dbf2-89b5-04eb2e4024e3"},"yValue":800,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-n-8","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuad","duration":500,"target":{"id":"384917b4-b7de-20b5-952b-ad7735de035c"},"yValue":600,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]}]}],"createdOn":1513906967854},"a-2":{"id":"a-2","title":"Rotate On Scroll","continuousParameterGroups":[{"id":"a-2-p","type":"SCROLL_PROGRESS","parameterLabel":"Scroll","continuousActionGroups":[{"keyframe":0,"actionItems":[{"id":"a-2-n","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd306919639d7|51d6130d-f073-2031-c395-ce4a57aadc8c"},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}},{"id":"a-2-n-3","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd306919639d7|f4853d92-692a-df0b-ea8d-f9e0a0a818bd"},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}},{"id":"a-2-n-5","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd306919639d7|2bc71b14-7b85-d1c8-709a-85ed1df1e52f"},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}}]},{"keyframe":100,"actionItems":[{"id":"a-2-n-2","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd306919639d7|51d6130d-f073-2031-c395-ce4a57aadc8c"},"zValue":360,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}},{"id":"a-2-n-4","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd306919639d7|f4853d92-692a-df0b-ea8d-f9e0a0a818bd"},"zValue":360,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}},{"id":"a-2-n-6","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd306919639d7|2bc71b14-7b85-d1c8-709a-85ed1df1e52f"},"zValue":360,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}}]}]}],"createdOn":1513908035158},"a-4":{"id":"a-4","title":"Rotate Arrow On Hover","actionItemGroups":[{"actionItems":[{"id":"a-4-n","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".dropdown-arrow","selectorGuids":["ed04a6e4-e130-47ec-0db8-1536e3b91c38"]},"zValue":-90,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}}]},{"actionItems":[{"id":"a-4-n-2","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"ease","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".dropdown-arrow","selectorGuids":["ed04a6e4-e130-47ec-0db8-1536e3b91c38"]},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1517945002642},"a-5":{"id":"a-5","title":"Rotate To Origin","actionItemGroups":[{"actionItems":[{"id":"a-5-n","actionTypeId":"TRANSFORM_ROTATE","config":{"delay":0,"easing":"ease","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".dropdown-arrow","selectorGuids":["ed04a6e4-e130-47ec-0db8-1536e3b91c38"]},"zValue":-90,"xUnit":"DEG","yUnit":"DEG","zUnit":"DEG"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1517945155284},"a-3":{"id":"a-3","title":"Show Page On Load","actionItemGroups":[{"actionItems":[{"id":"a-3-n","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd336e99639d0|5a382927284c460001a09b32"},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-3-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuad","duration":800,"target":{"id":"622c3947833bd336e99639d0|5a382927284c460001a09b32"},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1517944802068},"a-6":{"id":"a-6","title":"Scroll Into View","actionItemGroups":[{"actionItems":[{"id":"a-6-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b"},"yValue":50,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-6-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"id":"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b"},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-6-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"ease","duration":500,"target":{"id":"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b"},"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"id":"a-6-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"ease","duration":500,"target":{"id":"622c3947833bd336e99639d0|fe34cc9c-9fc9-80ea-9962-47457195513b"},"value":1,"unit":""}}]}],"useFirstGroupAsInitialState":true,"createdOn":1517950016905},"slideInBottom":{"id":"slideInBottom","useFirstGroupAsInitialState":true,"actionItemGroups":[{"actionItems":[{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":100,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}}]}]}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}
);
