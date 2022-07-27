/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Galigeo"] = factory();
	else
		root["Galigeo"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/extent.ts":
/*!***********************!*\
  !*** ./src/extent.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar Extent = /** @class */ (function () {\r\n    function Extent(xmin, ymin, xmax, ymax) {\r\n        this.xmin = xmin;\r\n        this.ymin = ymin;\r\n        this.xmax = xmax;\r\n        this.ymax = ymax;\r\n    }\r\n    return Extent;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Extent);\r\n\n\n//# sourceURL=webpack://Galigeo/./src/extent.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Extent\": () => (/* reexport safe */ _extent__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n/* harmony export */   \"Layer\": () => (/* reexport safe */ _layer__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"Listener\": () => (/* reexport safe */ _listener__WEBPACK_IMPORTED_MODULE_4__[\"default\"]),\n/* harmony export */   \"Map\": () => (/* reexport safe */ _map__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"Messenger\": () => (/* reexport safe */ _messenger__WEBPACK_IMPORTED_MODULE_3__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ \"./src/map.ts\");\n/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layer */ \"./src/layer.ts\");\n/* harmony import */ var _extent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extent */ \"./src/extent.ts\");\n/* harmony import */ var _messenger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./messenger */ \"./src/messenger.ts\");\n/* harmony import */ var _listener__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./listener */ \"./src/listener.ts\");\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://Galigeo/./src/index.ts?");

/***/ }),

/***/ "./src/layer.ts":
/*!**********************!*\
  !*** ./src/layer.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./listener */ \"./src/listener.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        if (typeof b !== \"function\" && b !== null)\r\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\n\r\nvar Layer = /** @class */ (function (_super) {\r\n    __extends(Layer, _super);\r\n    function Layer(id, options) {\r\n        var _this = _super.call(this) || this;\r\n        _this.id = id;\r\n        _this.name = options.name ? options.name : id;\r\n        _this.datasourceId = options.datasourceId;\r\n        _this.datasetId = options.datasetId;\r\n        _this.visible = options.visible;\r\n        _this.messenger = options.messenger;\r\n        if (_this.messenger) {\r\n            _this.registerEvents();\r\n        }\r\n        return _this;\r\n    }\r\n    Layer.prototype.getId = function () {\r\n        return this.id;\r\n    };\r\n    Layer.prototype.getName = function () {\r\n        return this.name;\r\n    };\r\n    Layer.prototype.setVisible = function (visible) {\r\n        return this.messenger.postMessage('setVisible', visible, this);\r\n    };\r\n    Layer.prototype.disableInfoWindow = function () {\r\n        return this.messenger.postMessage('disableInfoWindow', '', this);\r\n    };\r\n    Layer.prototype.filter = function (where) {\r\n        return this.messenger.postMessage('filter', where, this);\r\n    };\r\n    /**\r\n     * Listen the events received from the messenger then propagate\r\n     */\r\n    Layer.prototype.registerEvents = function () {\r\n        var _this = this;\r\n        this.messenger.addEventListener('layer', function (msg) {\r\n            if (msg.layer && msg.layer.id === _this.id) {\r\n                _this.fireEvent(msg.action, msg.value);\r\n            }\r\n        });\r\n    };\r\n    return Layer;\r\n}(_listener__WEBPACK_IMPORTED_MODULE_0__[\"default\"]));\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layer);\r\n\n\n//# sourceURL=webpack://Galigeo/./src/layer.ts?");

/***/ }),

/***/ "./src/listener.ts":
/*!*************************!*\
  !*** ./src/listener.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar Listener = /** @class */ (function () {\r\n    function Listener() {\r\n        this._listeners = new Map();\r\n        this._messages = [];\r\n    }\r\n    Listener.prototype.addEventListener = function (event, listener) {\r\n        var funcs = this._listeners.get(event);\r\n        if (!funcs) {\r\n            funcs = [];\r\n            this._listeners.set(event, funcs);\r\n        }\r\n        funcs.push(listener);\r\n    };\r\n    Listener.prototype.removeEventListner = function (event, listener) {\r\n        var funcs = this._listeners.get(event);\r\n        if (!funcs)\r\n            return false;\r\n        funcs = funcs.filter(function (e) { return e !== listener; });\r\n        return true;\r\n    };\r\n    Listener.prototype.fireEvent = function (event, value) {\r\n        var funcs = this._listeners.get(event);\r\n        if (funcs) {\r\n            for (var _i = 0, funcs_1 = funcs; _i < funcs_1.length; _i++) {\r\n                var f = funcs_1[_i];\r\n                f(value);\r\n            }\r\n        }\r\n    };\r\n    return Listener;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Listener);\r\n\n\n//# sourceURL=webpack://Galigeo/./src/listener.ts?");

/***/ }),

/***/ "./src/map.ts":
/*!********************!*\
  !*** ./src/map.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _extent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./extent */ \"./src/extent.ts\");\n/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layer */ \"./src/layer.ts\");\n/* harmony import */ var _messenger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./messenger */ \"./src/messenger.ts\");\n/* harmony import */ var _listener__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./listener */ \"./src/listener.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        if (typeof b !== \"function\" && b !== null)\r\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\n\r\n\r\n\r\n\r\n/**\r\n * The Map class contains properties and methods for storing and managing layers\r\n */\r\nvar Map = /** @class */ (function (_super) {\r\n    __extends(Map, _super);\r\n    function Map(element, options) {\r\n        var _this = _super.call(this) || this;\r\n        _this.loaded = false;\r\n        console.log('Welcome to Galigeo');\r\n        _this.options = options;\r\n        _this.element = element;\r\n        if (!options.location)\r\n            options.location = 'https://sandbox.galigeo.com/Galigeo';\r\n        if (_this.options.location.endsWith('/')) {\r\n            _this.options.location = _this.options.location.slice(0, -1);\r\n        }\r\n        return _this;\r\n    }\r\n    /**\r\n     * Create an instance of Galigeo Map\r\n     * @returns a promise when the map is loaded\r\n     */\r\n    Map.prototype.load = function () {\r\n        return __awaiter(this, void 0, void 0, function () {\r\n            var _this = this;\r\n            return __generator(this, function (_a) {\r\n                console.log('Loading Map');\r\n                return [2 /*return*/, new Promise(function (resolve, reject) {\r\n                        fetch(_this.options.location + '/api/openMap/encoded', {\r\n                            method: 'POST',\r\n                            headers: {\r\n                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'\r\n                            },\r\n                            body: 'data=' + encodeURIComponent(JSON.stringify(_this.options))\r\n                        }).then(function (res) { return res.json(); })\r\n                            .then(function (json) {\r\n                            _this.iframe = _this.createIframe(_this.element, json);\r\n                            _this.messenger = new _messenger__WEBPACK_IMPORTED_MODULE_2__[\"default\"](_this.iframe);\r\n                            _this.registerEvents();\r\n                            console.log('API- after fetch json', json);\r\n                            _this.messenger.waitMapIsLoad().then(function (res) {\r\n                                console.log('API- Map loaded', json);\r\n                                _this.loaded = true;\r\n                                resolve(json);\r\n                            });\r\n                        })\r\n                            .catch(function (err) { return reject(err); });\r\n                        ;\r\n                    })];\r\n            });\r\n        });\r\n    };\r\n    /**\r\n     *\r\n     * @returns true if the map is ready to use\r\n     */\r\n    Map.prototype.isLoaded = function () {\r\n        return this.loaded;\r\n    };\r\n    /**\r\n     * Set the extent of the map\r\n     * @param extent The extent to set\r\n     */\r\n    Map.prototype.setExtent = function (extent) {\r\n        return this.messenger.postMessage('setExtent', extent);\r\n    };\r\n    Map.prototype.setMenuVisible = function (visible) {\r\n        return this.messenger.postMessage('setMenuVisible', visible);\r\n    };\r\n    Map.prototype.filter = function (datasourceId, datasetId) {\r\n        return this.messenger.postMessage('filter', { datasourceId: datasourceId, datasetId: datasetId });\r\n    };\r\n    /**\r\n     * Get the list of layers\r\n     * @returns Promise<Layer[]>\r\n     */\r\n    Map.prototype.getLayers = function () {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            _this.messenger.postMessage('getLayers', null).then(function (messageLayers) {\r\n                var layers = [];\r\n                for (var _i = 0, messageLayers_1 = messageLayers; _i < messageLayers_1.length; _i++) {\r\n                    var l = messageLayers_1[_i];\r\n                    var layer = new _layer__WEBPACK_IMPORTED_MODULE_1__[\"default\"](l.id, { name: l.name, datasetId: l.datasetId, datasourceId: l.datasourceId, visible: l.visible, messenger: _this.messenger });\r\n                    layers.push(layer);\r\n                }\r\n                resolve(layers);\r\n            });\r\n        });\r\n    };\r\n    /**\r\n     * Listen the events received from the messenger then propagate\r\n     */\r\n    Map.prototype.registerEvents = function () {\r\n        var _this = this;\r\n        this.messenger.addEventListener('map', function (msg) {\r\n            // adapt the object passed through the event to match API objects\r\n            var value;\r\n            if (msg.action === 'zoomend') {\r\n                value = new _extent__WEBPACK_IMPORTED_MODULE_0__[\"default\"](msg.value.minX, msg.value.minY, msg.value.maxX, msg.value.maxY);\r\n            }\r\n            else {\r\n                value = msg.value;\r\n            }\r\n            _this.fireEvent(msg.action, value);\r\n        });\r\n    };\r\n    Map.prototype.createIframe = function (element, json) {\r\n        var mapDiv = document.getElementById(element);\r\n        var indexPage = this.options.devMode ? 'indexdev.jsp' : 'index.html';\r\n        var iframe = document.createElement('iframe');\r\n        var urlOptions = 'listenMessages=true';\r\n        if (this.options.crossDomain)\r\n            urlOptions += '&crossDomain=true';\r\n        iframe.src = \"\".concat(this.options.location, \"/viewer/\").concat(indexPage, \"?\").concat(urlOptions, \"&url=../\").concat(json.relativeUrlServiceUrl);\r\n        iframe.width = '100%';\r\n        iframe.height = '100%';\r\n        iframe.title = 'Galigeo Map';\r\n        iframe.id = this.options.mapId;\r\n        mapDiv.appendChild(iframe);\r\n        return iframe;\r\n    };\r\n    return Map;\r\n}(_listener__WEBPACK_IMPORTED_MODULE_3__[\"default\"]));\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Map);\r\n\n\n//# sourceURL=webpack://Galigeo/./src/map.ts?");

/***/ }),

/***/ "./src/messenger.ts":
/*!**************************!*\
  !*** ./src/messenger.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _listener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./listener */ \"./src/listener.ts\");\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ \"./src/model.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        if (typeof b !== \"function\" && b !== null)\r\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\n\r\n\r\nvar Messenger = /** @class */ (function (_super) {\r\n    __extends(Messenger, _super);\r\n    function Messenger(iframe) {\r\n        var _this = _super.call(this) || this;\r\n        _this.ready = false;\r\n        _this.responses = new Map();\r\n        _this.idCounter = 1;\r\n        _this.iframe = iframe;\r\n        _this.registerEvents();\r\n        return _this;\r\n    }\r\n    /**\r\n     * Register all post messages event from iframe\r\n     */\r\n    Messenger.prototype.registerEvents = function () {\r\n        var _this = this;\r\n        var childWindow = this.iframe;\r\n        console.log('API - Listen for messages', childWindow.contentWindow);\r\n        window.addEventListener('message', function (evt) {\r\n            if (evt.source !== childWindow.contentWindow) {\r\n                console.warn('API- Skip', evt);\r\n                return; // Skip message from other source\r\n            }\r\n            // skip case map loaded ; already handled by waitMapIsLoad()\r\n            if (evt.data === 'GaligeoMapLoaded') {\r\n                return;\r\n            }\r\n            var msg = new _model__WEBPACK_IMPORTED_MODULE_1__.Message(evt.data);\r\n            // Handle messages of type 'response'\r\n            if (msg.type === 'response') {\r\n                console.log('API- receive response', msg);\r\n                var response = _this.responses.get(msg.id);\r\n                if (response) {\r\n                    console.log('API- resolve response', response);\r\n                    _this.responses.delete(msg.id);\r\n                    response.resolve(msg.value);\r\n                }\r\n                else\r\n                    console.warn('API- Missing response handler for message ', msg);\r\n            }\r\n            // Handle events\r\n            if (msg.type === 'event') {\r\n                _this.fireEvent(msg.source, msg);\r\n            }\r\n        });\r\n    };\r\n    /**\r\n     * Wait for the message 'GaligeoMapLoaded' from the iframe\r\n     * @returns a Promise\r\n     */\r\n    Messenger.prototype.waitMapIsLoad = function () {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            window.addEventListener('message', function (evt) {\r\n                if (evt.data === 'GaligeoMapLoaded') {\r\n                    _this.ready = true;\r\n                    resolve('map loaded');\r\n                }\r\n            });\r\n            setTimeout(function () {\r\n                if (!_this.ready) {\r\n                    reject('Timeout excedeed, failed to load map');\r\n                }\r\n            }, 5000);\r\n        });\r\n    };\r\n    Messenger.prototype.postMessage = function (action, value, layer) {\r\n        var _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            var message = new _model__WEBPACK_IMPORTED_MODULE_1__.Message();\r\n            message.source = 'api';\r\n            message.type = 'function';\r\n            message.action = action;\r\n            message.value = value;\r\n            message.id = '' + _this.idCounter++;\r\n            message.layer = layer;\r\n            if (!_this.ready) {\r\n                throw new Error('Map not ready, unable to send messages');\r\n            }\r\n            else {\r\n                console.log('API- action =', action, message);\r\n                var response = new _model__WEBPACK_IMPORTED_MODULE_1__.Message();\r\n                response.resolve = resolve;\r\n                _this.responses.set(message.id, response);\r\n                _this.iframe.contentWindow.postMessage(JSON.stringify(message), \"*\");\r\n            }\r\n        });\r\n    };\r\n    return Messenger;\r\n}(_listener__WEBPACK_IMPORTED_MODULE_0__[\"default\"]));\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Messenger);\r\n\n\n//# sourceURL=webpack://Galigeo/./src/messenger.ts?");

/***/ }),

/***/ "./src/model.ts":
/*!**********************!*\
  !*** ./src/model.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MapParameters\": () => (/* binding */ MapParameters),\n/* harmony export */   \"Message\": () => (/* binding */ Message)\n/* harmony export */ });\n/* harmony import */ var _layer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layer */ \"./src/layer.ts\");\n\r\n/**\r\n * This file is used to store various POJO\r\n */\r\nvar MapParameters = /** @class */ (function () {\r\n    function MapParameters() {\r\n    }\r\n    return MapParameters;\r\n}());\r\n\r\nvar Message = /** @class */ (function () {\r\n    function Message(json) {\r\n        if (json) {\r\n            try {\r\n                var obj = JSON.parse(json);\r\n                this.id = obj.id;\r\n                this.source = obj.source;\r\n                this.type = obj.type;\r\n                this.action = obj.action;\r\n                this.value = obj.value;\r\n                if (obj.layer) {\r\n                    this.layer = new _layer__WEBPACK_IMPORTED_MODULE_0__[\"default\"](obj.layer.id, { name: obj.layer.name });\r\n                }\r\n            }\r\n            catch (error) {\r\n                console.debug('Skip message', json, error);\r\n            }\r\n        }\r\n    }\r\n    return Message;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://Galigeo/./src/model.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});