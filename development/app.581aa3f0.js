// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../src/scss/index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/soundcloud-audio/index.js":[function(require,module,exports) {
'use strict';

var SOUNDCLOUD_API_URL = 'https://api.soundcloud.com';

var anchor;
var keys = 'protocol hostname host pathname port search hash href'.split(' ');
function _parseURL(url) {
  if (!anchor) {
    anchor = document.createElement('a');
  }

  var result = {};

  anchor.href = url || '';

  for (var i = 0, len = keys.length; i < len; i++) {
    var key = keys[i];
    result[key] = anchor[key];
  }

  return result;
}

function _appendQueryParam(url, param, value) {
  var U = _parseURL(url);
  var regex = /\?(?:.*)$/;
  var chr = regex.test(U.search) ? '&' : '?';
  var result =
    U.protocol +
    '//' +
    U.host +
    U.port +
    U.pathname +
    U.search +
    chr +
    param +
    '=' +
    value +
    U.hash;

  return result;
}

function SoundCloud(clientId, apiUrl) {
  if (!(this instanceof SoundCloud)) {
    return new SoundCloud(clientId, apiUrl);
  }

  if (!clientId && !apiUrl) {
    console.info('SoundCloud API requires clientId or custom apiUrl');
  }

  this._events = {};

  this._clientId = clientId;
  this._baseUrl = apiUrl || SOUNDCLOUD_API_URL;

  this.playing = false;
  this.duration = 0;

  this.audio = document.createElement('audio');
}

SoundCloud.prototype.resolve = function(url, callback) {
  var resolveUrl =
    this._baseUrl + '/resolve.json?url=' + encodeURIComponent(url);

  if (this._clientId) {
    resolveUrl = _appendQueryParam(resolveUrl, 'client_id', this._clientId);
  }

  this._json(
    resolveUrl,
    function(data) {
      this.cleanData();

      if (Array.isArray(data)) {
        data = { tracks: data };
      }

      if (data.tracks) {
        data.tracks = data.tracks.map(this._transformTrack.bind(this));
        this._playlist = data;
      } else {
        this._track = this._transformTrack(data);

        // save timings
        var U = _parseURL(url);
        this._track.stream_url += U.hash;
      }

      this.duration =
        data.duration && !isNaN(data.duration)
          ? data.duration / 1000 // convert to seconds
          : 0; // no duration is zero

      callback(data);
    }.bind(this)
  );
};

// deprecated
SoundCloud.prototype._jsonp = function(url, callback) {
  var target = document.getElementsByTagName('script')[0] || document.head;
  var script = document.createElement('script');
  var id =
    'jsonp_callback_' + new Date().valueOf() + Math.floor(Math.random() * 1000);

  window[id] = function(data) {
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
    window[id] = function() {};
    callback(data);
  };

  script.src = _appendQueryParam(url, 'callback', id);
  target.parentNode.insertBefore(script, target);
};

SoundCloud.prototype._json = function(url, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var resp = {};
        try {
          resp = JSON.parse(xhr.responseText);
        } catch (err) {
          // fail silently
        }
        callback(resp);
      }
    }
  };

  xhr.send(null);
};

SoundCloud.prototype._transformTrack = function(track) {
  if (this._baseUrl !== SOUNDCLOUD_API_URL) {
    track.original_stream_url = track.stream_url;
    track.stream_url = track.stream_url.replace(
      SOUNDCLOUD_API_URL,
      this._baseUrl
    );
  }

  return track;
};

SoundCloud.prototype.on = function(e, fn) {
  this._events[e] = fn;
  this.audio.addEventListener(e, fn, false);
};

SoundCloud.prototype.off = function(e, fn) {
  this._events[e] = null;
  this.audio.removeEventListener(e, fn);
};

SoundCloud.prototype.unbindAll = function() {
  for (var e in this._events) {
    var fn = this._events[e];
    if (fn) {
      this.off(e, fn);
    }
  }
};

SoundCloud.prototype.preload = function(streamUrl, preloadType) {
  this._track = { stream_url: streamUrl };

  if (preloadType) {
    this.audio.preload = preloadType;
  }

  this.audio.src = this._clientId
    ? _appendQueryParam(streamUrl, 'client_id', this._clientId)
    : streamUrl;
};

SoundCloud.prototype.play = function(options) {
  options = options || {};
  var src;

  if (options.streamUrl) {
    src = options.streamUrl;
  } else if (this._playlist) {
    var length = this._playlist.tracks.length;

    if (length) {
      if (options.playlistIndex === undefined) {
        this._playlistIndex = this._playlistIndex || 0;
      } else {
        this._playlistIndex = options.playlistIndex;
      }

      // be silent if index is out of range
      if (this._playlistIndex >= length || this._playlistIndex < 0) {
        this._playlistIndex = 0;
        return;
      }

      src = this._playlist.tracks[this._playlistIndex].stream_url;
    }
  } else if (this._track) {
    src = this._track.stream_url;
  }

  if (!src) {
    throw new Error(
      'There is no tracks to play, use `streamUrl` option or `load` method'
    );
  }

  if (this._clientId) {
    src = _appendQueryParam(src, 'client_id', this._clientId);
  }

  if (src !== this.audio.src) {
    this.audio.src = src;
  }

  this.playing = src;

  return this.audio.play();
};

SoundCloud.prototype.pause = function() {
  this.audio.pause();
  this.playing = false;
};

SoundCloud.prototype.stop = function() {
  this.audio.pause();
  this.audio.currentTime = 0;
  this.playing = false;
};

SoundCloud.prototype.next = function(options) {
  options = options || {};
  var tracksLength = this._playlist.tracks.length;

  if (this._playlistIndex >= tracksLength - 1) {
    if (options.loop) {
      this._playlistIndex = -1;
    } else {
      return;
    }
  }

  if (this._playlist && tracksLength) {
    return this.play({ playlistIndex: ++this._playlistIndex });
  }
};

SoundCloud.prototype.previous = function() {
  if (this._playlistIndex <= 0) {
    return;
  }

  if (this._playlist && this._playlist.tracks.length) {
    return this.play({ playlistIndex: --this._playlistIndex });
  }
};

SoundCloud.prototype.seek = function(e) {
  if (!this.audio.readyState) {
    return false;
  }

  var percent =
    e.offsetX / e.target.offsetWidth ||
    (e.layerX - e.target.offsetLeft) / e.target.offsetWidth;

  this.audio.currentTime = percent * (this.audio.duration || 0);
};

SoundCloud.prototype.cleanData = function() {
  this._track = void 0;
  this._playlist = void 0;
};

SoundCloud.prototype.setVolume = function(volumePercentage) {
  if (!this.audio.readyState) {
    return;
  }

  this.audio.volume = volumePercentage;
};

SoundCloud.prototype.setTime = function(seconds) {
  if (!this.audio.readyState) {
    return;
  }

  this.audio.currentTime = seconds;
};

module.exports = SoundCloud;

},{}],"../node_modules/precision-inputs/css/precision-inputs.fl-controls.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/precision-inputs/common/precision-inputs.fl-controls.js":[function(require,module,exports) {
module.exports = function (t) {
  function e(r) {
    if (i[r]) return i[r].exports;
    var n = i[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return t[r].call(n.exports, n, n.exports, e), n.l = !0, n.exports;
  }

  var i = {};
  return e.m = t, e.c = i, e.d = function (t, i, r) {
    e.o(t, i) || Object.defineProperty(t, i, {
      configurable: !1,
      enumerable: !0,
      get: r
    });
  }, e.n = function (t) {
    var i = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return e.d(i, "a", i), i;
  }, e.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, e.p = "", e(e.s = 6);
}([function (t, e, i) {
  "use strict";

  function r(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  }

  function n(t, e) {
    for (var i = 0; i < e.length; i++) {
      var r = e[i];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
    }
  }

  function a(t, e, i) {
    return e && n(t.prototype, e), i && n(t, i), t;
  }

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0, i(2);

  var o = (0, i(3).getTransformProperty)(),
      s = function () {
    function t(e, i) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
      if (r(this, t), !e) throw new Error("KnobInput constructor must receive a valid container element");
      if (!i) throw new Error("KnobInput constructor must receive a valid visual element");
      if (!e.contains(i)) throw new Error("The KnobInput's container element must contain its visual element");
      var a = n.step || "any",
          s = "number" == typeof n.min ? n.min : -40,
          l = "number" == typeof n.max ? n.max : 40;
      this.initial = "number" == typeof n.initial ? n.initial : .5 * (s + l), this.dragResistance = "number" == typeof n.dragResistance ? n.dragResistance : 100, this.dragResistance *= 3, this.dragResistance /= l - s, this.wheelResistance = "number" == typeof n.wheelResistance ? n.wheelResistance : 100, this.wheelResistance *= 40, this.wheelResistance /= l - s, this.setupVisualContext = "function" == typeof n.visualContext ? n.visualContext : t.setupRotationContext(0, 360), this.updateVisuals = "function" == typeof n.updateVisuals ? n.updateVisuals : t.rotationUpdateFunction;
      var c = document.createElement("input");
      c.type = "range", c.step = a, c.min = s, c.max = l, c.value = this.initial, e.appendChild(c), this._container = e, this._container.classList.add("knob-input__container"), this._input = c, this._input.classList.add("knob-input__input"), this._visualElement = i, this._visualElement.classList.add("knob-input__visual"), this._visualContext = {
        element: this._visualElement,
        transformProperty: o
      }, this.setupVisualContext.apply(this._visualContext), this.updateVisuals = this.updateVisuals.bind(this._visualContext), this._activeDrag = !1, this._handlers = {
        inputChange: this.handleInputChange.bind(this),
        touchStart: this.handleTouchStart.bind(this),
        touchMove: this.handleTouchMove.bind(this),
        touchEnd: this.handleTouchEnd.bind(this),
        touchCancel: this.handleTouchCancel.bind(this),
        mouseDown: this.handleMouseDown.bind(this),
        mouseMove: this.handleMouseMove.bind(this),
        mouseUp: this.handleMouseUp.bind(this),
        mouseWheel: this.handleMouseWheel.bind(this),
        doubleClick: this.handleDoubleClick.bind(this),
        focus: this.handleFocus.bind(this),
        blur: this.handleBlur.bind(this)
      }, this._input.addEventListener("change", this._handlers.inputChange), this._input.addEventListener("touchstart", this._handlers.touchStart), this._input.addEventListener("mousedown", this._handlers.mouseDown), this._input.addEventListener("wheel", this._handlers.mouseWheel), this._input.addEventListener("dblclick", this._handlers.doubleClick), this._input.addEventListener("focus", this._handlers.focus), this._input.addEventListener("blur", this._handlers.blur), this.updateToInputValue();
    }

    return a(t, [{
      key: "handleInputChange",
      value: function (t) {
        this.updateToInputValue();
      }
    }, {
      key: "handleTouchStart",
      value: function (t) {
        this.clearDrag(), t.preventDefault();
        var e = t.changedTouches.item(t.changedTouches.length - 1);
        this._activeDrag = e.identifier, this.startDrag(e.clientY), document.body.addEventListener("touchmove", this._handlers.touchMove), document.body.addEventListener("touchend", this._handlers.touchEnd), document.body.addEventListener("touchcancel", this._handlers.touchCancel);
      }
    }, {
      key: "handleTouchMove",
      value: function (t) {
        var e = this.findActiveTouch(t.changedTouches);
        e ? this.updateDrag(e.clientY) : this.findActiveTouch(t.touches) || this.clearDrag();
      }
    }, {
      key: "handleTouchEnd",
      value: function (t) {
        var e = this.findActiveTouch(t.changedTouches);
        e && this.finalizeDrag(e.clientY);
      }
    }, {
      key: "handleTouchCancel",
      value: function (t) {
        this.findActiveTouch(t.changedTouches) && this.clearDrag();
      }
    }, {
      key: "handleMouseDown",
      value: function (t) {
        this.clearDrag(), t.preventDefault(), this._activeDrag = !0, this.startDrag(t.clientY), document.body.addEventListener("mousemove", this._handlers.mouseMove), document.body.addEventListener("mouseup", this._handlers.mouseUp);
      }
    }, {
      key: "handleMouseMove",
      value: function (t) {
        1 & t.buttons ? this.updateDrag(t.clientY) : this.finalizeDrag(t.clientY);
      }
    }, {
      key: "handleMouseUp",
      value: function (t) {
        this.finalizeDrag(t.clientY);
      }
    }, {
      key: "handleMouseWheel",
      value: function (t) {
        t.preventDefault(), this._input.focus(), this.clearDrag(), this._prevValue = parseFloat(this._input.value), this.updateFromDrag(t.deltaY, this.wheelResistance);
      }
    }, {
      key: "handleDoubleClick",
      value: function (t) {
        this.clearDrag(), this._input.value = this.initial, this.updateToInputValue();
      }
    }, {
      key: "handleFocus",
      value: function (t) {
        this._container.classList.add("focus-active");
      }
    }, {
      key: "handleBlur",
      value: function (t) {
        this._container.classList.remove("focus-active");
      }
    }, {
      key: "startDrag",
      value: function (t) {
        this._dragStartPosition = t, this._prevValue = parseFloat(this._input.value), this._input.focus(), document.body.classList.add("knob-input__drag-active"), this._container.classList.add("drag-active"), this._input.dispatchEvent(new InputEvent("knobdragstart"));
      }
    }, {
      key: "updateDrag",
      value: function (t) {
        var e = t - this._dragStartPosition;
        this.updateFromDrag(e, this.dragResistance), this._input.dispatchEvent(new InputEvent("change"));
      }
    }, {
      key: "finalizeDrag",
      value: function (t) {
        var e = t - this._dragStartPosition;
        this.updateFromDrag(e, this.dragResistance), this.clearDrag(), this._input.dispatchEvent(new InputEvent("change")), this._input.dispatchEvent(new InputEvent("knobdragend"));
      }
    }, {
      key: "clearDrag",
      value: function () {
        document.body.classList.remove("knob-input__drag-active"), this._container.classList.remove("drag-active"), this._activeDrag = !1, this._input.dispatchEvent(new InputEvent("change")), document.body.removeEventListener("mousemove", this._handlers.mouseMove), document.body.removeEventListener("mouseup", this._handlers.mouseUp), document.body.removeEventListener("touchmove", this._handlers.touchMove), document.body.removeEventListener("touchend", this._handlers.touchEnd), document.body.removeEventListener("touchcancel", this._handlers.touchCancel);
      }
    }, {
      key: "updateToInputValue",
      value: function () {
        var t = parseFloat(this._input.value);
        this.updateVisuals(this.normalizeValue(t), t);
      }
    }, {
      key: "updateFromDrag",
      value: function (t, e) {
        var i = this.clampValue(this._prevValue - t / e);
        this._input.value = i, this.updateVisuals(this.normalizeValue(i), i);
      }
    }, {
      key: "clampValue",
      value: function (t) {
        var e = parseFloat(this._input.min),
            i = parseFloat(this._input.max);
        return Math.min(Math.max(t, e), i);
      }
    }, {
      key: "normalizeValue",
      value: function (t) {
        var e = parseFloat(this._input.min);
        return (t - e) / (parseFloat(this._input.max) - e);
      }
    }, {
      key: "findActiveTouch",
      value: function (t) {
        var e, i;

        for (e = 0, i = t.length; e < i; e++) if (this._activeDrag === t.item(e).identifier) return t.item(e);

        return null;
      }
    }, {
      key: "addEventListener",
      value: function () {
        this._input.addEventListener.apply(this._input, arguments);
      }
    }, {
      key: "removeEventListener",
      value: function () {
        this._input.removeEventListener.apply(this._input, arguments);
      }
    }, {
      key: "focus",
      value: function () {
        this._input.focus.apply(this._input, arguments);
      }
    }, {
      key: "blur",
      value: function () {
        this._input.blur.apply(this._input, arguments);
      }
    }, {
      key: "value",
      get: function () {
        return parseFloat(this._input.value);
      },
      set: function (t) {
        this._input.value = t, this.updateToInputValue(), this._input.dispatchEvent(new Event("change"));
      }
    }], [{
      key: "setupRotationContext",
      value: function (t, e) {
        return function () {
          this.minRotation = t, this.maxRotation = e;
        };
      }
    }, {
      key: "rotationUpdateFunction",
      value: function (t) {
        this.element.style[this.transformProperty] = "rotate(".concat(this.maxRotation * t - this.minRotation * (t - 1), "deg)");
      }
    }]), t;
  }();

  e.default = s;
}, function (t, e, i) {
  "use strict";

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var r = {
    KnobInput: function (t) {
      return t && t.__esModule ? t : {
        default: t
      };
    }(i(0)).default
  };
  e.default = r;
}, function (t, e) {}, function (t, e, i) {
  "use strict";

  function r(t) {
    for (var e = 0; e < t.length; e++) if (void 0 !== document.body.style[t[e]]) return t[e];

    return null;
  }

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.getTransformProperty = function () {
    return r(["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"]);
  }, e.debounce = function (t, e, i) {
    var r;
    return function () {
      var n = this,
          a = arguments,
          o = i && !r;
      clearTimeout(r), r = setTimeout(function () {
        r = null, i || t.apply(n, a);
      }, e), o && t.apply(n, a);
    };
  };
}, function (t, e, i) {
  "use strict";

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var r = {
    val: 9135103,
    str: "#8b63ff"
  },
      n = {
    val: 5164287,
    str: "#4eccff"
  },
      a = {
    val: 8645442,
    str: "#83eb42"
  },
      o = {
    val: 16108615,
    str: "#f5cc47"
  },
      s = {
    val: 16731744,
    str: "#ff4e60"
  },
      l = {
    val: 16754736,
    str: "#ffa830"
  },
      c = {
    purple: r,
    blue: n,
    green: a,
    yellow: o,
    red: s,
    orange: l,
    panning: r,
    volume: n,
    modX: a,
    modY: o,
    pitch: s,
    misc: l,
    default: l
  };
  e.default = c;
}, function (t, e, i) {
  "use strict";

  function r(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    i && void 0 === e.fill && t.setAttribute("fill", "transparent");

    for (var n in e) e.hasOwnProperty(n) && ("id" === n ? t.id = e[n] : "classes" === n ? Array.isArray(e[n]) ? t.classList.add.apply(t.classList, e[n]) : t.classList.add(e[n]) : t.setAttribute(r ? l(n) : n, e[n]));
  }

  function n(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        i = document.createElementNS(s, t);
    return r(i, e), i;
  }

  function a(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : .1;
    "number" == typeof e && (t.setAttribute("x", -1 * e), t.setAttribute("y", -1 * e), t.setAttribute("width", 1 + 2 * e), t.setAttribute("height", 1 + 2 * e));
  }

  function o() {
    var t = document.getElementById("precision-inputs-svg-defs");
    if (t) return t;
    var e = document.createElementNS(s, "svg");
    e.style.position = "absolute", e.style.left = 0, e.style.top = 0, e.style.width = 0, e.style.height = 0, e.style.opacity = 0;
    var i = document.createElementNS(s, "defs");
    return i.id = "precision-inputs-svg-defs", e.appendChild(i), document.body.appendChild(e), i;
  }

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.createFilterPass = n, e.defineSvgGradient = function (t, e) {
    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    if (document.getElementById(t)) return "url(#".concat(t, ")");
    if ("linear" !== e && "radial" !== e) throw new Error("Unknown SVG Gradient type: ".concat(e));
    var n = document.createElementNS(s, "linear" === e ? "linearGradient" : "radialGradient");
    n.id = t, n.setAttribute("color-interpolation", "sRGB");

    for (var a in i) i.hasOwnProperty(a) && n.setAttribute(a, i[a]);

    var l;

    for (var c in r) if (r.hasOwnProperty(c)) {
      if (l = document.createElementNS(s, "stop"), isNaN(c)) {
        if ("%" !== c[c.length - 1]) continue;
        l.setAttribute("offset", c);
      } else l.setAttribute("offset", c + "%");

      "string" == typeof r[c] ? l.setAttribute("stop-color", r[c]) : ("string" == typeof r[c].color && l.setAttribute("stop-color", r[c].color), void 0 !== r[c].opacity && l.setAttribute("stop-opacity", r[c].opacity)), n.appendChild(l);
    }

    return o().appendChild(n), "url(#".concat(t, ")");
  }, e.defineBlurFilter = function (t, e) {
    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "none",
        r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
    if (document.getElementById(t)) return "url(#".concat(t, ")");
    var l = document.createElementNS(s, "filter");
    return l.id = t, l.setAttribute("color-interpolation-filters", "sRGB"), a(l, r), l.appendChild(n("feGaussianBlur", {
      in: "SourceGraphic",
      result: "blur",
      stdDeviation: e
    })), "none" !== i && l.appendChild(n("feComposite", {
      in: "blur",
      in2: "SourceGraphic",
      operator: i
    })), o().appendChild(l), "url(#".concat(t, ")");
  }, e.defineDarkenFilter = function (t, e, i) {
    var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
    if (document.getElementById(t)) return "url(#".concat(t, ")");
    var l = document.createElementNS(s, "filter");
    return l.id = t, l.setAttribute("color-interpolation-filters", "sRGB"), a(l, r), l.appendChild(n("feColorMatrix", {
      in: "SourceGraphic",
      type: "matrix",
      values: "".concat(e, " 0 0 0 ").concat(i, "  0 ").concat(e, " 0 0 ").concat(i, "  0 0 ").concat(e, " 0 ").concat(i, "  0 0 0 1 0")
    })), o().appendChild(l), "url(#".concat(t, ")");
  }, e.defineDropshadowFilter = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : .6,
        r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
        l = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 3,
        c = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : null;
    if (document.getElementById(t)) return "url(#".concat(t, ")");
    var u = document.createElementNS(s, "filter");
    return u.id = t, u.setAttribute("color-interpolation-filters", "sRGB"), a(u, c), u.appendChild(n("feOffset", {
      dx: r,
      dy: l
    })), u.appendChild(n("feColorMatrix", {
      result: "darken",
      type: "matrix",
      values: "0 0 0 0 ".concat((e >> 16 & 255) / 256, "  0 0 0 0 ").concat((e >> 8 & 255) / 256, "  0 0 0 0 ").concat((255 & e) / 256, "  0 0 0 ").concat(i, " 0")
    })), u.appendChild(n("feComposite", {
      in: "SourceGraphic",
      in2: "darken",
      operator: "over"
    })), o().appendChild(u), "url(#".concat(t, ")");
  }, e.defineMask = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
    if (document.getElementById(t)) return "url(#".concat(t, ")");
    var i = document.createElementNS(s, "mask");
    return i.id = t, e.forEach(function (t) {
      return i.appendChild(t);
    }), o().appendChild(i), "url(#".concat(t, ")");
  }, e.createGroup = function () {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        e = document.createElementNS(s, "g");
    return r(e, t, !1, !0), e;
  }, e.createRectangle = function (t, e, i, n) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
    if (void 0 === t || void 0 === e || void 0 === i || void 0 === n) throw new Error("Missing required parameters for creating SVG rectangle.");
    var o = document.createElementNS(s, "rect");
    return o.setAttribute("x", t), o.setAttribute("y", e), o.setAttribute("width", i), o.setAttribute("height", n), r(o, a, !0, !0), o;
  }, e.createCircle = function (t, e, i) {
    var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    if (void 0 === t || void 0 === e || void 0 === i) throw new Error("Missing required parameters for creating SVG circle.");
    var a = document.createElementNS(s, "circle");
    return a.setAttribute("cx", t), a.setAttribute("cy", e), a.setAttribute("r", i), r(a, n, !0, !0), a;
  }, e.createLine = function (t, e, i, n) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
    if (void 0 === t || void 0 === e || void 0 === i || void 0 === n) throw new Error("Missing required parameters for creating SVG line.");
    var o = document.createElementNS(s, "line");
    return o.setAttribute("x1", t), o.setAttribute("y1", e), o.setAttribute("x2", i), o.setAttribute("y2", n), r(o, a, !1, !0), o;
  }, e.createPath = function (t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    if (void 0 === t) throw new Error("Missing required parameters for creating SVG path.");
    var i = document.createElementNS(s, "path");
    return i.setAttribute("d", t), r(i, e, !0, !0), i;
  }, e.svgNS = void 0;
  var s = "http://www.w3.org/2000/svg";
  e.svgNS = s;

  var l = function (t) {
    return t.replace(/([A-Z])/g, function (t) {
      return "-".concat(t[0].toLowerCase());
    });
  };
}, function (t, e, i) {
  "use strict";

  function r(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  function n() {
    return (n = Object.assign || function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var i = arguments[e];

        for (var r in i) Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
      }

      return t;
    }).apply(this, arguments);
  }

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0;
  var a = r(i(1)),
      o = r(i(7)),
      s = r(i(9)),
      l = r(i(4)),
      c = n({
    FLStandardKnob: o.default,
    FLReactiveGripDial: s.default,
    colors: l.default
  }, a.default);
  e.default = c;
}, function (t, e, i) {
  "use strict";

  function r(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  function n(t) {
    return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }

  function a(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  }

  function o(t, e) {
    for (var i = 0; i < e.length; i++) {
      var r = e[i];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
    }
  }

  function s(t, e, i) {
    return e && o(t.prototype, e), i && o(t, i), t;
  }

  function l(t, e) {
    if (e && ("object" === n(e) || "function" == typeof e)) return e;
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t;
  }

  function c(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
  }

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0, i(8);

  var u = i(5),
      d = r(i(4)),
      h = r(i(0)),
      f = function (t) {
    function e(t) {
      var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (a(this, e), !t) throw new Error("FLStandardKnob constructor must receive a valid container element");

      var r = void 0 === i.indicatorDot || i.indicatorDot,
          n = void 0 !== i.indicatorRingType ? i.indicatorRingType : "split",
          o = void 0 !== i.color ? i.color : d.default.default.str,
          s = e._constructVisualElement(r, o);

      return i.visualContext = e._getVisualSetupFunction(r), i.updateVisuals = e._getVisualUpdateFunction(r, n), t.classList.add("fl-standard-knob"), t.appendChild(s), l(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, s, i));
    }

    return c(e, h.default), s(e, null, [{
      key: "_constructVisualElement",
      value: function (t, e) {
        var i = document.createElementNS(u.svgNS, "svg");
        i.classList.add("fl-standard-knob__svg"), i.setAttribute("viewBox", "0 0 40 40"), (0, u.defineBlurFilter)("filter__fl-standard-knob__focus-indicator-glow", 2, "none", .2);
        var r = document.createElementNS(u.svgNS, "circle");
        r.classList.add("fl-standard-knob__focus-indicator"), r.setAttribute("cx", 20), r.setAttribute("cy", 20), r.setAttribute("r", 18), r.setAttribute("fill", e), r.setAttribute("filter", "url(#filter__fl-standard-knob__focus-indicator-glow)");
        var n = document.createElementNS(u.svgNS, "circle");
        n.classList.add("fl-standard-knob__indicator-ring-bg"), n.setAttribute("cx", 20), n.setAttribute("cy", 20), n.setAttribute("r", 18), n.setAttribute("fill", "#353b3f"), n.setAttribute("stroke", "#23292d");
        var a = document.createElementNS(u.svgNS, "path");
        a.classList.add("fl-standard-knob__indicator-ring"), a.setAttribute("d", "M20,20Z"), a.setAttribute("fill", e);
        var o = document.createElementNS(u.svgNS, "g");
        o.classList.add("fl-standard-knob__dial"), (0, u.defineSvgGradient)("grad__fl-standard-knob__soft-shadow", "radial", {
          cx: .5,
          cy: .5,
          r: .5
        }, {
          "85%": {
            color: "#242a2e",
            opacity: .4
          },
          "100%": {
            color: "#242a2e",
            opacity: 0
          }
        });
        var s = document.createElementNS(u.svgNS, "circle");
        s.classList.add("fl-standard-knob__dial-soft-shadow"), s.setAttribute("cx", 20), s.setAttribute("cy", 20), s.setAttribute("r", 16), s.setAttribute("fill", "url(#grad__fl-standard-knob__soft-shadow)");
        var l = document.createElementNS(u.svgNS, "ellipse");
        l.classList.add("fl-standard-knob__dial-hard-shadow"), l.setAttribute("cx", 20), l.setAttribute("cy", 22), l.setAttribute("rx", 14), l.setAttribute("ry", 14.5), l.setAttribute("fill", "#242a2e"), l.setAttribute("opacity", .15), (0, u.defineSvgGradient)("grad__fl-standard-knob__dial-base", "linear", {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        }, {
          "0%": "#52595f",
          "100%": "#2b3238"
        });
        var c = document.createElementNS(u.svgNS, "circle");
        c.classList.add("fl-standard-knob__dial-base"), c.setAttribute("cx", 20), c.setAttribute("cy", 20), c.setAttribute("r", 14), c.setAttribute("fill", "url(#grad__fl-standard-knob__dial-base)"), c.setAttribute("stroke", "#242a2e"), c.setAttribute("stroke-width", 1.5), (0, u.defineSvgGradient)("grad__fl-standard-knob__dial-highlight", "linear", {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        }, {
          "0%": {
            color: "#70777d",
            opacity: 1
          },
          "40%": {
            color: "#70777d",
            opacity: 0
          },
          "55%": {
            color: "#70777d",
            opacity: 0
          },
          "100%": {
            color: "#70777d",
            opacity: .3
          }
        });
        var d = document.createElementNS(u.svgNS, "circle");
        d.classList.add("fl-standard-knob__dial-highlight-stroke"), d.setAttribute("cx", 20), d.setAttribute("cy", 20), d.setAttribute("r", 13), d.setAttribute("fill", "transparent"), d.setAttribute("stroke", "url(#grad__fl-standard-knob__dial-highlight)"), d.setAttribute("stroke-width", 1.5);
        var h = document.createElementNS(u.svgNS, "circle");
        h.classList.add("fl-standard-knob__dial-highlight"), h.setAttribute("cx", 20), h.setAttribute("cy", 20), h.setAttribute("r", 14), h.setAttribute("fill", "#ffffff");
        var f;
        return t && ((f = document.createElementNS(u.svgNS, "circle")).classList.add("fl-standard-knob__indicator-dot"), f.setAttribute("cx", 20), f.setAttribute("cy", 30), f.setAttribute("r", 1.5), f.setAttribute("fill", e)), o.appendChild(s), o.appendChild(l), o.appendChild(c), o.appendChild(d), o.appendChild(h), t && o.appendChild(f), i.appendChild(r), i.appendChild(n), i.appendChild(a), i.appendChild(o), i;
      }
    }, {
      key: "_getVisualSetupFunction",
      value: function (t) {
        return function () {
          this.indicatorRing = this.element.querySelector(".fl-standard-knob__indicator-ring");
          var e = getComputedStyle(this.element.querySelector(".fl-standard-knob__indicator-ring-bg"));
          this.r = parseFloat(e.r) - parseFloat(e.strokeWidth) / 2, t && (this.indicatorDot = this.element.querySelector(".fl-standard-knob__indicator-dot"), this.indicatorDot.style["".concat(this.transformProperty, "Origin")] = "20px 20px");
        };
      }
    }, {
      key: "_getVisualUpdateFunction",
      value: function (t, e) {
        return function (i) {
          var r = 2 * Math.PI * i + .5 * Math.PI,
              n = this.r * Math.cos(r) + 20,
              a = this.r * Math.sin(r) + 20;

          switch (e) {
            case "positive":
            default:
              this.indicatorRing.setAttribute("d", "M20,20l0,".concat(this.r).concat(i > .5 ? "A".concat(this.r, ",").concat(this.r, ",0,0,1,20,").concat(20 - this.r) : "", "A-").concat(this.r, ",").concat(this.r, ",0,0,1,").concat(n, ",").concat(a, "Z"));
              break;

            case "negative":
              this.indicatorRing.setAttribute("d", "M20,20l0,".concat(this.r).concat(i < .5 ? "A-".concat(this.r, ",").concat(this.r, ",0,0,0,20,").concat(20 - this.r) : "", "A").concat(this.r, ",").concat(this.r, ",0,0,0,").concat(n, ",").concat(a, "Z"));
              break;

            case "split":
              this.indicatorRing.setAttribute("d", "M20,20l0,-".concat(this.r, "A").concat(this.r, ",").concat(this.r, ",0,0,").concat(i < .5 ? 0 : 1, ",").concat(n, ",").concat(a, "Z"));
          }

          t && (this.indicatorDot.style[this.transformProperty] = "rotate(".concat(360 * i, "deg)"));
        };
      }
    }]), e;
  }();

  e.default = f;
}, function (t, e) {}, function (t, e, i) {
  "use strict";

  function r(t) {
    return t && t.__esModule ? t : {
      default: t
    };
  }

  function n(t) {
    return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
      return typeof t;
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    })(t);
  }

  function a(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  }

  function o(t, e) {
    for (var i = 0; i < e.length; i++) {
      var r = e[i];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
    }
  }

  function s(t, e, i) {
    return e && o(t.prototype, e), i && o(t, i), t;
  }

  function l(t, e) {
    if (e && ("object" === n(e) || "function" == typeof e)) return e;
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t;
  }

  function c(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
  }

  Object.defineProperty(e, "__esModule", {
    value: !0
  }), e.default = void 0, i(10);

  var u = i(5),
      d = r(i(4)),
      h = r(i(0)),
      f = 0,
      p = function (t) {
    return 1 - Math.cos(t * Math.PI / 2);
  },
      v = function (t) {
    return Math.sin(t * Math.PI / 2);
  },
      g = Math.PI / 2,
      m = function (t, e) {
    return 20 + t * Math.cos(g + e);
  },
      _ = function (t, e) {
    return 20 + t * Math.sin(g + e);
  },
      b = function (t) {
    function e(t) {
      var i,
          r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (a(this, e), !t) throw new Error("FLReactiveGripDial constructor must receive a valid container element");

      var n = void 0 !== r.color ? r.color : d.default.default.str,
          o = "number" == typeof r.guideTicks ? r.guideTicks : 9,
          s = "number" == typeof r.gripBumps ? r.gripBumps : 5,
          c = "number" == typeof r.gripExtrusion ? r.gripExtrusion : .5,
          u = "number" == typeof r.minRotation ? r.minRotation : .5 / o * 360,
          h = "number" == typeof r.maxRotation ? r.maxRotation : 360 * (1 - .5 / o),
          f = e._constructVisualElement(n, o, u, h);

      return r.visualContext = e._getVisualSetupFunction(u, h), r.updateVisuals = e._getVisualUpdateFunction(), t.classList.add("fl-reactive-grip-dial"), t.appendChild(f), i = l(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, f, r)), i.gripBumps = s, i.gripExtrusion = c, i.mouseX = 0, i.mouseY = 0, i.hoverTween = {
        rafId: null,
        direction: 1,
        progress: 0,
        startTime: 0,
        duration: 600
      }, i._reactiveDialHandlers = {
        hover: i.handleHover.bind(i),
        move: i.handleMove.bind(i),
        unhover: i.handleUnhover.bind(i),
        dragStart: i.handleDragStart.bind(i),
        dragEnd: i.handleDragEnd.bind(i)
      }, i.addEventListener("mouseover", i._reactiveDialHandlers.hover), i.addEventListener("knobdragstart", i._reactiveDialHandlers.dragStart), i;
    }

    return c(e, h.default), s(e, [{
      key: "handleHover",
      value: function (t) {
        this.mouseX = t.clientX, this.mouseY = t.clientY, this.startHoverEffect();
      }
    }, {
      key: "handleMove",
      value: function (t) {
        this.mouseX = t.clientX, this.mouseY = t.clientY;

        var e = this._input.getBoundingClientRect();

        (t.clientX < e.left || t.clientX > e.right || t.clientY < e.top || t.clientY > e.bottom) && this.stopHoverEffect();
      }
    }, {
      key: "handleUnhover",
      value: function (t) {
        this.stopHoverEffect();
      }
    }, {
      key: "handleDragStart",
      value: function (t) {
        this.startHoverEffect();
      }
    }, {
      key: "handleDragEnd",
      value: function (t) {
        this.stopHoverEffect();
      }
    }, {
      key: "startHoverEffect",
      value: function () {
        document.body.addEventListener("mousemove", this._reactiveDialHandlers.move), this.addEventListener("mouseout", this._reactiveDialHandlers.unhover), this.addEventListener("knobdragend", this._reactiveDialHandlers.dragEnd), this.hoverTween.rafId && window.cancelAnimationFrame(this.hoverTween.rafId), this.hoverTween = {
          rafId: window.requestAnimationFrame(this.tickHoverTween.bind(this)),
          direction: 1,
          duration: 300,
          startProgress: this.hoverTween.progress
        };
      }
    }, {
      key: "stopHoverEffect",
      value: function () {
        var t = this._input.getBoundingClientRect();

        if (this.mouseX >= t.left && this.mouseX <= t.right && this.mouseY >= t.top && this.mouseY <= t.bottom || this._activeDrag) return !1;
        document.body.removeEventListener("mousemove", this._reactiveDialHandlers.move), this.removeEventListener("mouseout", this._reactiveDialHandlers.unhover), this.removeEventListener("knobdragend", this._reactiveDialHandlers.dragEnd), this.hoverTween.rafId && window.cancelAnimationFrame(this.hoverTween.rafId), this.hoverTween = {
          rafId: window.requestAnimationFrame(this.tickHoverTween.bind(this)),
          direction: -1,
          duration: 600,
          startProgress: this.hoverTween.progress
        };
      }
    }, {
      key: "tickHoverTween",
      value: function (t) {
        this.hoverTween.startTime || (this.hoverTween.startTime = t), this.hoverTween.progress = (t - this.hoverTween.startTime) / this.hoverTween.duration, this.hoverTween.direction > 0 ? (this.hoverTween.progress *= 1 - this.hoverTween.startProgress, this.hoverTween.progress += this.hoverTween.startProgress, this.hoverTween.progress < 1 ? (this.morphGripShape(v(this.hoverTween.progress)), this.hoverTween.rafId = window.requestAnimationFrame(this.tickHoverTween.bind(this))) : (this.hoverTween.progress = 1, this.morphGripShape(1), this.hoverTween.rafId = null)) : (this.hoverTween.progress *= this.hoverTween.startProgress, this.hoverTween.progress = this.hoverTween.startProgress - this.hoverTween.progress, this.hoverTween.progress > 0 ? (this.morphGripShape(p(this.hoverTween.progress)), this.hoverTween.rafId = window.requestAnimationFrame(this.tickHoverTween.bind(this))) : (this.hoverTween.progress = 0, this.morphGripShape(0), this.hoverTween.rafId = null));
      }
    }, {
      key: "morphGripShape",
      value: function (t) {
        for (var e = Math.PI / this.gripBumps, i = (2 - t) * e, r = t * e, n = 13 / (18 * this.gripExtrusion + 1) * this.gripBumps, a = "M".concat(m(13, -i / 2), ",").concat(_(13, -i / 2)), o = 0; o < this.gripBumps; o++) {
          var s = 2 * o * e + i / 2,
              l = (2 * o + 1) * e + r / 2;
          a += "A-13,13,0,0,1,".concat(m(13, s), ",").concat(_(13, s)), a += "A-".concat(n, ",").concat(n, ",0,0,0,").concat(m(13, l), ",").concat(_(13, l));
        }

        a += "Z", this._visualContext.gripMask.setAttribute("d", a), this._visualContext.gripOutline.setAttribute("d", a);
      }
    }], [{
      key: "_constructVisualElement",
      value: function (t, e, i, r) {
        var n = document.createElementNS(u.svgNS, "svg");
        n.classList.add("fl-reactive-grip-dial__svg"), n.setAttribute("viewBox", "0 0 40 40");
        var a = document.createElementNS(u.svgNS, "defs"),
            o = document.createElementNS(u.svgNS, "mask");
        o.id = "mask__fl-reactive-grip__grip-outline--".concat(f++);
        var s = (0, u.createPath)("M20,33A13,13,0,0,1,20,7A-13,13,0,0,1,20,33Z", {
          classes: "fl-reactive-grip-dial__grip-mask-path",
          fill: "#ffffff"
        });
        o.appendChild(s), a.appendChild(o);

        for (var l = i * Math.PI / 180, c = r * Math.PI / 180, d = c - l, h = (0, u.createGroup)({
          classes: "fl-reactive-grip-dial__guides"
        }), p = (0, u.createPath)("M".concat(m(16, l), ",").concat(_(16, l), "A16,16,0,0,1,20,4A-16,16,0,0,1,").concat(m(16, c), ",").concat(_(16, c)), {
          classes: "fl-reactive-grip-dial__focus-indicator",
          stroke: t,
          strokeWidth: 3,
          strokeLinecap: "round",
          filter: (0, u.defineBlurFilter)("filter__fl-reactive-grip-dial__blur-focus-indicator", 1.5, "none", .2)
        }), v = (0, u.createPath)("M".concat(m(16, l), ",").concat(_(16, l), "A16,16,0,0,1,20,4A-16,16,0,0,1,").concat(m(16, c), ",").concat(_(16, c)), {
          classes: "fl-reactive-grip-dial__guide-ring",
          stroke: "#32383c",
          strokeWidth: 3,
          strokeLinecap: "round"
        }), g = [], b = 0; b < e; b++) {
          var y = l + b * d / (e - 1);
          g.push((0, u.createLine)(m(19.5, y), _(19.5, y), m(14.5, y), _(14.5, y), {
            classes: "fl-reactive-grip-dial__guide-tick",
            stroke: "#23292d"
          }));
        }

        h.appendChild(p), h.appendChild(v), g.forEach(function (t) {
          return h.appendChild(t);
        });
        var k = (0, u.createGroup)({
          classes: "fl-reactive-grip-dial__grip",
          filter: (0, u.defineDropshadowFilter)("filter__fl-reactive-grip-dial__drop-shadow", 2304301, .3, 0, 2, .3)
        }),
            w = (0, u.createRectangle)(6, 6, 28, 28, {
          classes: "fl-reactive-grip-dial__grip-fill",
          fill: (0, u.defineSvgGradient)("grad__fl-reactive-grip-dial__grip-fill", "radial", {
            cx: .5,
            cy: -.2,
            r: 1.2,
            fx: .5,
            fy: -.2
          }, {
            "0%": "#8b9499",
            "70%": "#10191e",
            "100%": "#2b3439"
          }),
          mask: "url(#".concat(o.id, ")")
        }),
            E = (0, u.createPath)("M20,33A13,13,0,0,1,20,7A-13,13,0,0,1,20,33Z", {
          classes: "fl-reactive-grip-dial__grip-outline",
          stroke: "#23292d",
          strokeWidth: .5
        }),
            C = (0, u.createCircle)(m(10.5, 0), _(10.5, 0), 1, {
          classes: "fl-reactive-grip-dial__indicator-dot",
          fill: t
        });
        k.appendChild(w), k.appendChild(E), k.appendChild(C);
        var A = (0, u.createGroup)({
          classes: "fl-reactive-grip-dial__chrome"
        }),
            S = (0, u.defineBlurFilter)("filter__fl-reactive-grip-dial__blur-base", 1.5),
            T = (0, u.defineBlurFilter)("filter__fl-reactive-grip-dial__blur-base", .5),
            x = {
          "0%": {
            color: "#ffffff",
            opacity: 0
          },
          "100%": {
            color: "#ffffff",
            opacity: .12
          }
        },
            L = (0, u.defineSvgGradient)("grad__fl-reactive-grip-dial__gradient-a", "linear", {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        }, x),
            M = (0, u.defineSvgGradient)("grad__fl-reactive-grip-dial__gradient-b", "linear", {
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }, x),
            D = (0, u.defineSvgGradient)("grad__fl-reactive-grip-dial__gradient-c", "linear", {
          x1: 0,
          y1: 0,
          x2: 1,
          y2: 0
        }, x),
            P = (0, u.defineSvgGradient)("grad__fl-reactive-grip-dial__gradient-d", "linear", {
          x1: 1,
          y1: 0,
          x2: 0,
          y2: 0
        }, x),
            R = (0, u.defineDarkenFilter)("filter__fl-reactive-grip-dial__darken", .75, .05),
            O = (0, u.createGroup)({
          classes: "fl-reactive-grip-dial__chrome-base",
          mask: (0, u.defineMask)("mask__fl-reactive-grip__chrome-base", [(0, u.createCircle)(20, 20, 8, {
            fill: "#ffffff"
          })]),
          transform: "rotate(-25 20 20)"
        }),
            F = (0, u.createGroup)({
          filter: S
        });
        F.appendChild((0, u.createRectangle)(12, 12, 16, 16, {
          fill: "#383d3f"
        })), F.appendChild((0, u.createRectangle)(12, 12, 8, 16, {
          fill: L
        })), F.appendChild((0, u.createRectangle)(20, 12, 8, 16, {
          fill: M
        })), F.appendChild((0, u.createRectangle)(12, 12, 16, 8, {
          fill: D
        })), F.appendChild((0, u.createRectangle)(12, 20, 16, 8, {
          fill: P
        })), F.appendChild((0, u.createLine)(12, 28, 19, 21, {
          stroke: "#ffffff",
          strokeOpacity: .8
        })), F.appendChild((0, u.createLine)(21, 19, 28, 12, {
          stroke: "#ffffff",
          strokeOpacity: .8
        })), O.appendChild(F), O.appendChild((0, u.createLine)(12, 28, 19.5, 20.5, {
          stroke: "#ffffff",
          strokeOpacity: .5,
          strokeWidth: .75,
          filter: T
        })), O.appendChild((0, u.createLine)(20.5, 19.5, 28, 12, {
          stroke: "#ffffff",
          strokeOpacity: .5,
          strokeWidth: .75,
          filter: T
        }));

        for (var N = [], G = 1; G < 11; G++) N.push((0, u.createCircle)(20, 20, 7.5 * G / 10, {
          stroke: "#ffffff",
          strokeWidth: .375
        }));

        var I = (0, u.createGroup)({
          classes: "fl-reactive-grip-dial__chrome-ridges",
          mask: (0, u.defineMask)("mask__fl-reactive-grip__chrome-ridges", N),
          transform: "rotate(-19 20 20)",
          filter: R
        }),
            V = (0, u.createGroup)({
          filter: S
        });
        V.appendChild((0, u.createRectangle)(12, 12, 16, 16, {
          fill: "#383d3f"
        })), V.appendChild((0, u.createRectangle)(12, 12, 8, 16, {
          fill: L
        })), V.appendChild((0, u.createRectangle)(20, 12, 8, 16, {
          fill: M
        })), V.appendChild((0, u.createRectangle)(12, 12, 16, 8, {
          fill: D
        })), V.appendChild((0, u.createRectangle)(12, 20, 16, 8, {
          fill: P
        })), V.appendChild((0, u.createLine)(12, 28, 19, 21, {
          stroke: "#ffffff",
          strokeOpacity: .8
        })), V.appendChild((0, u.createLine)(21, 19, 28, 12, {
          stroke: "#ffffff",
          strokeOpacity: .8
        })), I.appendChild(V), I.appendChild((0, u.createLine)(12, 28, 19.5, 20.5, {
          stroke: "#ffffff",
          strokeOpacity: .5,
          strokeWidth: .75,
          filter: T
        })), I.appendChild((0, u.createLine)(20.5, 19.5, 28, 12, {
          stroke: "#ffffff",
          strokeOpacity: .5,
          strokeWidth: .75,
          filter: T
        }));
        var B = (0, u.createCircle)(20, 20, 8, {
          classes: "fl-reactive-grip-dial__chrome-outline",
          stroke: "#23292d"
        }),
            j = (0, u.createCircle)(20, 20, 7.5, {
          classes: "fl-reactive-grip-dial__chrome-highlight",
          stroke: "#70777d",
          strokeOpacity: .6
        });
        return A.appendChild(O), A.appendChild(I), A.appendChild(B), A.appendChild(j), n.appendChild(a), n.appendChild(h), n.appendChild(k), n.appendChild(A), n;
      }
    }, {
      key: "_getVisualSetupFunction",
      value: function (t, e) {
        return function () {
          this.rotationDelta = e - t, this.minRotation = t, this.gripMask = this.element.querySelector(".fl-reactive-grip-dial__grip-mask-path"), this.gripMask.style["".concat(this.transformProperty, "Origin")] = "20px 20px", this.gripOutline = this.element.querySelector(".fl-reactive-grip-dial__grip-outline"), this.gripOutline.style["".concat(this.transformProperty, "Origin")] = "20px 20px", this.indicatorDot = this.element.querySelector(".fl-reactive-grip-dial__indicator-dot"), this.indicatorDot.style["".concat(this.transformProperty, "Origin")] = "20px 20px";
        };
      }
    }, {
      key: "_getVisualUpdateFunction",
      value: function () {
        return function (t) {
          var e = this.minRotation + t * this.rotationDelta;
          this.gripMask.style[this.transformProperty] = "rotate(".concat(e, "deg)"), this.gripOutline.style[this.transformProperty] = "rotate(".concat(e, "deg)"), this.indicatorDot.style[this.transformProperty] = "rotate(".concat(e, "deg)");
        };
      }
    }]), e;
  }();

  e.default = b;
}, function (t, e) {}]).default;
},{}],"../src/KnobCreate/KnobCreate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../node_modules/precision-inputs/css/precision-inputs.fl-controls.css");

var _precisionInputs = require("precision-inputs/common/precision-inputs.fl-controls");

function KnobCreate(knobContainerClass, eqNode, eqNode2) {
  this.knobContainer = document.querySelector(knobContainerClass);
  this.knob = new _precisionInputs.FLStandardKnob(this.knobContainer);
  eqNode.Q.value = 5;
  this.knob.addEventListener('change', function (evt) {
    if (eqNode2) {
      // eqNode.Q.value = 5;
      // eqNode2.Q.value = 5;
      // switch(evt.target.value){
      //     case(evt.target.value > -20):
      //         console.log('thing');
      //     default:
      //         console.log(evt.target.value)
      // }
      if (evt.target.value <= -30) {
        console.log('less than -30');
        console.log(840 + evt.target.value * 20);
        eqNode.frequency.value = 840 + evt.target.value * 20;
      } else if (evt.target.value <= -20) {
        console.log('-30 to -20'); // console.log(3516 + (evt.target.value*100))

        console.log(1139 + evt.target.value * 30);
        eqNode.frequency.value = 1139 + evt.target.value * 30;
      } else if (evt.target.value <= -10) {
        console.log('-20 to -10'); // console.log(2700 + (evt.target.value*60))

        console.log(2517 + evt.target.value * 100);
        eqNode.frequency.value = 2517 + evt.target.value * 100;
      } else if (evt.target.value <= 0) {
        console.log('-10 to 0');
        console.log(24000 + evt.target.value * 2280);
        eqNode.frequency.value = 24000 + evt.target.value * 2280;
      } else if (evt.target.value <= 10) {
        console.log('0 to 10');
        console.log(evt.target.value * 20);
        eqNode2.frequency.value = evt.target.value * 20;
      } else if (evt.target.value <= 20) {
        console.log('10 to 20');
        console.log(evt.target.value * 30 - 97);
        eqNode2.frequency.value = evt.target.value * 30 - 97;
      } else if (evt.target.value <= 30) {
        console.log('20 to 30');
        console.log(evt.target.value * 100 - 1503);
        eqNode2.frequency.value = evt.target.value * 100 - 1503;
      } else if (evt.target.value <= 40) {
        console.log('30 to 40');
        console.log(evt.target.value * 2280 - 67193);
        eqNode2.frequency.value = evt.target.value * 2280 - 67193;
      } // evt.target.value < 0 ?
      // eqNode.frequency.value = 8121 - ((Math.pow(evt.target.value, 2)) * (Math.log(evt.target.value*-4))) :
      // eqNode2.frequency.value = (((Math.pow(evt.target.value, 2)) * (Math.log(evt.target.value*4))) ) ;

    }

    eqNode.gain.value = evt.target.value;
  });
}

var _default = KnobCreate;
exports.default = _default;
},{"../../node_modules/precision-inputs/css/precision-inputs.fl-controls.css":"../node_modules/precision-inputs/css/precision-inputs.fl-controls.css","precision-inputs/common/precision-inputs.fl-controls":"../node_modules/precision-inputs/common/precision-inputs.fl-controls.js"}],"../src/Deck/Deck.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _soundcloudAudio = _interopRequireDefault(require("soundcloud-audio"));

var _precisionInputs = require("../../node_modules/precision-inputs/common/precision-inputs.fl-controls");

var _KnobCreate = _interopRequireDefault(require("../KnobCreate/KnobCreate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';
function Deck(deckNumberString, state) {
  //  State   //
  this.loadedTrack = null; //using soundcloud dependancy 

  this.scPlayer = new _soundcloudAudio.default('72e56a72d70b611ec8bcab7b2faf1015'); //instantiating web audio API audioContext

  this.audioContext = new AudioContext(); //avoiding CORS error

  this.scPlayer.audio.crossOrigin = 'anonymous'; //connecting soundcloud player html element to audioContext

  this.startNode = this.audioContext.createMediaElementSource(this.scPlayer.audio); //instantiating eq nodes

  this.lowShelf = this.audioContext.createBiquadFilter();
  this.lowShelf.type = 'lowshelf';
  this.lowShelf.frequency.value = 300;
  this.midBand = this.audioContext.createBiquadFilter();
  this.midBand.type = 'peaking';
  this.midBand.frequency.value = 1000;
  this.highBand = this.audioContext.createBiquadFilter();
  this.highBand.type = 'highshelf';
  this.highBand.frequency.value = 1000;
  this.lowPass = this.audioContext.createBiquadFilter();
  this.lowPass.type = 'lowpass';
  this.lowPass.frequency.value = 24000;
  this.lowPass.Q.value = 0;
  this.highPass = this.audioContext.createBiquadFilter();
  this.highPass.type = 'highpass'; //routing nodes

  this.startNode.connect(this.lowShelf);
  this.lowShelf.connect(this.midBand);
  this.midBand.connect(this.highBand);
  this.highBand.connect(this.lowPass);
  this.lowPass.connect(this.highPass);
  this.highPass.connect(this.audioContext.destination); // Methods

  this.playFunc = function () {
    var _this = this;

    this.audioContext.resume().then(function () {
      _this.scPlayer.play({
        // streamUrl: 'https://api.soundcloud.com/tracks/185533328/stream'
        // streamUrl: "https://api.soundcloud.com/tracks/774880408/stream"
        streamUrl: "".concat(_this.loadedTrack.uri, "/stream")
      });
    });
  };

  this.pauseFunc = function () {
    this.scPlayer.pause(); // this.startNode.mediaElement.playbackRate = 2
  };

  this.loadTrackFunc = function () {
    this.loadedTrack = state.selectedTrack;
  }; // instantiating knobs


  this.highKnob = new _KnobCreate.default(".deck".concat(deckNumberString, "-eq-high"), this.highBand);
  this.midKnob = new _KnobCreate.default(".deck".concat(deckNumberString, "-eq-mid"), this.midBand);
  this.lowShelfKnob = new _KnobCreate.default(".deck".concat(deckNumberString, "-eq-low"), this.lowShelf);
  this.filterKnob = new _KnobCreate.default(".deck".concat(deckNumberString, "-eq-filter"), this.lowPass, this.highPass); // Selectors

  this.playBtn = document.querySelector(".deck".concat(deckNumberString, "-transport-play"));
  this.pauseBtn = document.querySelector(".deck".concat(deckNumberString, "-transport-pause"));
  this.loadTrackBtn = document.querySelector(".deck".concat(deckNumberString, "-panel .loadBtn")); //  event listeners

  this.playBtn.addEventListener('click', this.playFunc.bind(this), false);
  this.pauseBtn.addEventListener('click', this.pauseFunc.bind(this), false);
  this.loadTrackBtn.addEventListener('click', this.loadTrackFunc.bind(this), false);
}

var _default = Deck;
exports.default = _default;
},{"soundcloud-audio":"../node_modules/soundcloud-audio/index.js","../../node_modules/precision-inputs/common/precision-inputs.fl-controls":"../node_modules/precision-inputs/common/precision-inputs.fl-controls.js","../KnobCreate/KnobCreate":"../src/KnobCreate/KnobCreate.js"}],"../src/PlayList/PlayList.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function PlayList(deck, state) {
  var _this = this;

  //  state   //
  this.selectedTrack = null; //  Selectors   //

  this.searchInput = document.querySelector('.search-input');
  this.addBtn = document.querySelector('.addbtn');
  this.clearAllBtn = document.querySelector('.clearbtn');
  this.tableBodySelect = document.querySelector('.tablebody'); //  Methods //

  this.addTrackFunc = function (url) {
    var self = this;
    deck.scPlayer.resolve(url, function (track) {
      self.trCreateFunc(track);
    });
  };

  this.trCreateFunc = function (track) {
    var self = this;
    var tableRow = document.createElement('tr');
    tableRow.id = document.querySelectorAll('tr').length - 1;
    tableRow.addEventListener('click', function (e) {
      self.selectTrFunc(e, track);
    });
    tableRow.innerHTML = "\n        \n        <td> <img style=\"max-height: 40px;\" src=".concat(track.artwork_url, "></img> </td>\n        <td>").concat(track.title, "</td>\n        <td>").concat(track.user.username, "</td>\n        <td>").concat(track.genre, "</td>\n        <td>").concat(this.millisecondConvert(track.duration), "</td>\n        <td>").concat(track.release_year, "</td>\n        \n        ");
    this.tableBodySelect.appendChild(tableRow);
  };

  this.millisecondConvert = function (millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = (millis % 60000 / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  };

  this.selectTrFunc = function (evt, track) {
    // console.log(track)
    if (this.selectedTrack) {
      if (evt.target.parentElement.id === this.selectedTrack.id) {
        this.selectedTrack.classList.remove('anotherclass');
        this.selectedTrack = null;
        state.selectedTrack = null;
      } else {
        this.selectedTrack.classList.remove('anotherclass');
        this.selectedTrack = evt.target.parentElement;
        this.selectedTrack.classList.add('anotherclass');
        state.selectedTrack = track;
      }
    } else {
      evt.target.parentElement.classList.add("anotherclass");
      this.selectedTrack = evt.target.parentElement;
      state.selectedTrack = track;
    }
  };

  this.clearAllFunc = function (tableBody) {
    tableBody.innerHTML = '';
  }; //  event listeners //


  this.addBtn.addEventListener('click', function () {
    return _this.addTrackFunc(_this.searchInput.value);
  });
  this.clearAllBtn.addEventListener('click', function () {
    return _this.clearAllFunc(_this.tableBodySelect);
  });
}

var _default = PlayList;
exports.default = _default;
},{}],"../src/State/State.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function State() {
  this.selectedTrack = null;
}

var _default = State;
exports.default = _default;
},{}],"../src/app.js":[function(require,module,exports) {
"use strict";

require("./scss/index.scss");

var _soundcloudAudio = _interopRequireDefault(require("soundcloud-audio"));

var _KnobCreate = _interopRequireDefault(require("./KnobCreate/KnobCreate.js"));

var _Deck = _interopRequireDefault(require("./Deck/Deck.js"));

var _PlayList = _interopRequireDefault(require("./PlayList/PlayList.js"));

var _State = _interopRequireDefault(require("./State/State.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// SCKEY1 = 'a3dd183a357fcff9a6943c0d65664087';
// SCKEY2 = '72e56a72d70b611ec8bcab7b2faf1015';
document.addEventListener('DOMContentLoaded', init, false);

function init() {
  var state = new _State.default();
  var deck1 = new _Deck.default('1', state);
  var deck2 = new _Deck.default('2', state);
  var playlist = new _PlayList.default(deck2, state); // const lowShelfKnob = new KnobCreate('.deck1-eq-low');
}

;
console.log('it works mofo');
},{"./scss/index.scss":"../src/scss/index.scss","soundcloud-audio":"../node_modules/soundcloud-audio/index.js","./KnobCreate/KnobCreate.js":"../src/KnobCreate/KnobCreate.js","./Deck/Deck.js":"../src/Deck/Deck.js","./PlayList/PlayList.js":"../src/PlayList/PlayList.js","./State/State.js":"../src/State/State.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61999" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/app.js"], null)
//# sourceMappingURL=/app.581aa3f0.js.map