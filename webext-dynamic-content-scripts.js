/* https://github.com/fregante/webext-dynamic-content-scripts @ v6.0.5 */

(function () {
  const $cE0t$export$patternValidationRegex = /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;

  function $cE0t$var$getRawRegex(matchPattern) {
    if (!$cE0t$export$patternValidationRegex.test(matchPattern)) {
      throw new Error(matchPattern + ' is an invalid pattern, it must match ' + String($cE0t$export$patternValidationRegex));
    }

    let [, protocol, host, pathname] = matchPattern.split(/(^[^:]+:[/][/])([^/]+)?/);
    protocol = protocol.replace('*', 'https?').replace(/[/]/g, '[/]');
    host = (host !== null && host !== void 0 ? host : '').replace(/[.]/g, '[.]').replace(/^[*]/, '[^/]+').replace(/[*]$/g, '[^.]+');
    pathname = pathname.replace(/[/]/g, '[/]').replace(/[.]/g, '[.]').replace(/[*]/g, '.*');
    return '^' + protocol + host + '(' + pathname + ')?$';
  }

  function $cE0t$export$patternToRegex(...matchPatterns) {
    return new RegExp(matchPatterns.map($cE0t$var$getRawRegex).join('|'));
  }

  var $XBLC$exports = {};
  Object.defineProperty($XBLC$exports, "__esModule", {
    value: true
  });

  async function $XBLC$var$p(fn, ...args) {
    return new Promise((resolve, reject) => {
      fn(...args, result => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  }

  async function $XBLC$var$isOriginPermitted(url) {
    return $XBLC$var$p(chrome.permissions.contains, {
      origins: [new URL(url).origin + '/*']
    });
  }

  async function $XBLC$var$wasPreviouslyLoaded(tabId, loadCheck) {
    const result = await $XBLC$var$p(chrome.tabs.executeScript, tabId, {
      code: loadCheck,
      runAt: 'document_start'
    });
    return result === null || result === void 0 ? void 0 : result[0];
  }

  if (typeof chrome === 'object' && !chrome.contentScripts) {
    chrome.contentScripts = {
      async register(contentScriptOptions, callback) {
        const {
          js = [],
          css = [],
          allFrames,
          matchAboutBlank,
          matches,
          runAt
        } = contentScriptOptions;
        const loadCheck = `document[${JSON.stringify(JSON.stringify({
          js,
          css
        }))}]`;
        const matchesRegex = $cE0t$export$patternToRegex(...matches);

        const listener = async (tabId, {
          status
        }) => {
          if (status !== 'loading') {
            return;
          }

          const {
            url
          } = await $XBLC$var$p(chrome.tabs.get, tabId);

          if (!url || !matchesRegex.test(url) || !(await $XBLC$var$isOriginPermitted(url)) || (await $XBLC$var$wasPreviouslyLoaded(tabId, loadCheck))) {
              return;
            }

          for (const file of css) {
            chrome.tabs.insertCSS(tabId, { ...file,
              matchAboutBlank,
              allFrames,
              runAt: runAt !== null && runAt !== void 0 ? runAt : 'document_start'
            });
          }

          for (const file of js) {
            chrome.tabs.executeScript(tabId, { ...file,
              matchAboutBlank,
              allFrames,
              runAt
            });
          }

          chrome.tabs.executeScript(tabId, {
            code: `${loadCheck} = true`,
            runAt: 'document_start',
            allFrames
          });
        };

        chrome.tabs.onUpdated.addListener(listener);
        const registeredContentScript = {
          async unregister() {
            return $XBLC$var$p(chrome.tabs.onUpdated.removeListener.bind(chrome.tabs.onUpdated), listener);
          }

        };

        if (typeof callback === 'function') {
          callback(registeredContentScript);
        }

        return Promise.resolve(registeredContentScript);
      }

    };
  }

  function $KZXy$var$ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function $KZXy$var$_objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        $KZXy$var$ownKeys(Object(source), true).forEach(function (key) {
          $KZXy$var$_defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        $KZXy$var$ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function $KZXy$var$_defineProperty(obj, key, value) {
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

  function $KZXy$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function $KZXy$var$_asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          $KZXy$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          $KZXy$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function $KZXy$var$_slicedToArray(arr, i) {
    return $KZXy$var$_arrayWithHoles(arr) || $KZXy$var$_iterableToArrayLimit(arr, i) || $KZXy$var$_unsupportedIterableToArray(arr, i) || $KZXy$var$_nonIterableRest();
  }

  function $KZXy$var$_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function $KZXy$var$_iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

  function $KZXy$var$_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function $KZXy$var$_createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = $KZXy$var$_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e2) {
            throw _e2;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e3) {
        didErr = true;
        err = _e3;
      },
      f: function f() {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function $KZXy$var$_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return $KZXy$var$_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return $KZXy$var$_arrayLikeToArray(o, minLen);
  }

  function $KZXy$var$_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var $KZXy$var$events = [['request', 'onAdded'], ['remove', 'onRemoved']];

  if (chrome.permissions && !chrome.permissions.onAdded) {
    var $KZXy$var$_iterator = $KZXy$var$_createForOfIteratorHelper($KZXy$var$events),
        $KZXy$var$_step;

    try {
      var $KZXy$var$_loop = function _loop() {
        var _step$value = $KZXy$var$_slicedToArray($KZXy$var$_step.value, 2),
            action = _step$value[0],
            event = _step$value[1];

        var act = chrome.permissions[action];
        var listeners = new Set();
        chrome.permissions[event] = {
          addListener: function addListener(callback) {
            listeners.add(callback);
          }
        };

        chrome.permissions[action] = function (permissions, callback) {
          var initial = browser.permissions.contains(permissions);
          var expected = action === 'request';
          act(permissions, function () {
            var _ref = $KZXy$var$_asyncToGenerator(regeneratorRuntime.mark(function _callee(successful) {
              var fullPermissions;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      if (callback) {
                        callback(successful);
                      }

                      if (successful) {
                        _context.next = 3;
                        break;
                      }

                      return _context.abrupt("return");

                    case 3:
                      _context.next = 5;
                      return initial;

                    case 5:
                      _context.t0 = _context.sent;
                      _context.t1 = expected;

                      if (!(_context.t0 !== _context.t1)) {
                        _context.next = 10;
                        break;
                      }

                      fullPermissions = $KZXy$var$_objectSpread({
                        origins: [],
                        permissions: []
                      }, permissions);
                      chrome.permissions.getAll(function () {
                        var _iterator2 = $KZXy$var$_createForOfIteratorHelper(listeners),
                            _step2;

                        try {
                          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                            var listener = _step2.value;
                            setTimeout(listener, 0, fullPermissions);
                          }
                        } catch (err) {
                          _iterator2.e(err);
                        } finally {
                          _iterator2.f();
                        }
                      });

                    case 10:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function (_x) {
              return _ref.apply(this, arguments);
            };
          }());
        };

        browser.permissions[event] = chrome.permissions[event];

        browser.permissions[action] = function () {
          var _ref2 = $KZXy$var$_asyncToGenerator(regeneratorRuntime.mark(function _callee2(permissions) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    return _context2.abrupt("return", new Promise(function (resolve, reject) {
                      chrome.permissions[action](permissions, function (result) {
                        if (chrome.runtime.lastError) {
                          reject(chrome.runtime.lastError);
                        } else {
                          resolve(result);
                        }
                      });
                    }));

                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }();
      };

      for ($KZXy$var$_iterator.s(); !($KZXy$var$_step = $KZXy$var$_iterator.n()).done;) {
        $KZXy$var$_loop();
      }
    } catch (err) {
      $KZXy$var$_iterator.e(err);
    } finally {
      $KZXy$var$_iterator.f();
    }
  }

  function $DVoL$export$getManifestPermissionsSync() {
    var _a, _b;

    const manifest = chrome.runtime.getManifest();
    const manifestPermissions = {
      origins: [],
      permissions: []
    };
    const list = new Set([...((_a = manifest.permissions) !== null && _a !== void 0 ? _a : []), ...((_b = manifest.content_scripts) !== null && _b !== void 0 ? _b : []).flatMap(config => {
      var _a;

      return (_a = config.matches) !== null && _a !== void 0 ? _a : [];
    })]);

    for (const permission of list) {
      if (permission.includes('://')) {
        manifestPermissions.origins.push(permission);
      } else {
        manifestPermissions.permissions.push(permission);
      }
    }

    return manifestPermissions;
  }

  async function $DVoL$export$getAdditionalPermissions() {
    const manifestPermissions = $DVoL$export$getManifestPermissionsSync();
    return new Promise(resolve => {
      chrome.permissions.getAll(currentPermissions => {
        var _a, _b;

        const additionalPermissions = {
          origins: [],
          permissions: []
        };

        for (const origin of (_a = currentPermissions.origins) !== null && _a !== void 0 ? _a : []) {
          if (!manifestPermissions.origins.includes(origin)) {
            additionalPermissions.origins.push(origin);
          }
        }

        for (const permission of (_b = currentPermissions.permissions) !== null && _b !== void 0 ? _b : []) {
          if (!manifestPermissions.permissions.includes(permission)) {
            additionalPermissions.permissions.push(permission);
          }
        }

        resolve(additionalPermissions);
      });
    });
  }

  function $Focm$var$_slicedToArray(arr, i) {
    return $Focm$var$_arrayWithHoles(arr) || $Focm$var$_iterableToArrayLimit(arr, i) || $Focm$var$_unsupportedIterableToArray(arr, i) || $Focm$var$_nonIterableRest();
  }

  function $Focm$var$_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function $Focm$var$_iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

  function $Focm$var$_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function $Focm$var$_createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = $Focm$var$_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function F() {};

        return {
          s: F,
          n: function n() {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function e(_e2) {
            throw _e2;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function s() {
        it = o[Symbol.iterator]();
      },
      n: function n() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function e(_e3) {
        didErr = true;
        err = _e3;
      },
      f: function f() {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function $Focm$var$_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return $Focm$var$_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return $Focm$var$_arrayLikeToArray(o, minLen);
  }

  function $Focm$var$_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function $Focm$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function $Focm$var$_asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          $Focm$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          $Focm$var$asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var $Focm$var$registeredScripts = new Map();

  function $Focm$var$convertPath(file) {
    var url = new URL(file, location.origin);
    return {
      file: url.pathname
    };
  }

  function $Focm$var$registerOnOrigins(_x) {
    return $Focm$var$_registerOnOrigins.apply(this, arguments);
  }

  function $Focm$var$_registerOnOrigins() {
    $Focm$var$_registerOnOrigins = $Focm$var$_asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref) {
      var newOrigins, manifest, _iterator2, _step2, origin, _iterator3, _step3, config, registeredScript;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              newOrigins = _ref.origins;
              manifest = chrome.runtime.getManifest().content_scripts;
              _iterator2 = $Focm$var$_createForOfIteratorHelper(newOrigins || []);

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  origin = _step2.value;
                  _iterator3 = $Focm$var$_createForOfIteratorHelper(manifest);

                  try {
                    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                      config = _step3.value;
                      registeredScript = chrome.contentScripts.register({
                        js: (config.js || []).map($Focm$var$convertPath),
                        css: (config.css || []).map($Focm$var$convertPath),
                        allFrames: config.all_frames,
                        matches: [origin],
                        runAt: config.run_at
                      });
                      $Focm$var$registeredScripts.set(origin, registeredScript);
                    }
                  } catch (err) {
                    _iterator3.e(err);
                  } finally {
                    _iterator3.f();
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return $Focm$var$_registerOnOrigins.apply(this, arguments);
  }

  $Focm$var$_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = $Focm$var$registerOnOrigins;
            _context.next = 3;
            return $DVoL$export$getAdditionalPermissions();

          case 3:
            _context.t1 = _context.sent;
            (0, _context.t0)(_context.t1);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))();
  chrome.permissions.onAdded.addListener(function (permissions) {
    if (permissions.origins && permissions.origins.length > 0) {
      $Focm$var$registerOnOrigins(permissions);
    }
  });
  chrome.permissions.onRemoved.addListener(function () {
    var _ref4 = $Focm$var$_asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref3) {
      var origins, _iterator, _step, _step$value, origin, script;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              origins = _ref3.origins;

              if (!(!origins || origins.length === 0)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              _iterator = $Focm$var$_createForOfIteratorHelper($Focm$var$registeredScripts);
              _context2.prev = 4;

              _iterator.s();

            case 6:
              if ((_step = _iterator.n()).done) {
                _context2.next = 14;
                break;
              }

              _step$value = $Focm$var$_slicedToArray(_step.value, 2), origin = _step$value[0], script = _step$value[1];

              if (!origins.includes(origin)) {
                _context2.next = 12;
                break;
              }

              _context2.next = 11;
              return script;

            case 11:
              _context2.sent.unregister();

            case 12:
              _context2.next = 6;
              break;

            case 14:
              _context2.next = 19;
              break;

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](4);

              _iterator.e(_context2.t0);

            case 19:
              _context2.prev = 19;

              _iterator.f();

              return _context2.finish(19);

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[4, 16, 19, 22]]);
    }));

    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
})();
