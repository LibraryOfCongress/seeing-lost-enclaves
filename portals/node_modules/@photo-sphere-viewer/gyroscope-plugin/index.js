(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three'), require('@photo-sphere-viewer/core')) :
    typeof define === 'function' && define.amd ? define(['exports', 'three', '@photo-sphere-viewer/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.PhotoSphereViewer = global.PhotoSphereViewer || {}, global.PhotoSphereViewer.GyroscopePlugin = {}), global.THREE, global.PhotoSphereViewer));
})(this, (function (exports, THREE, PhotoSphereViewer) {

console.warn('PhotoSphereViewer "index.js" scripts are deprecated and will be removed in a future version. Please use ES Modules: https://photo-sphere-viewer.js.org/guide/#your-first-viewer');

/*!
 * PhotoSphereViewer.GyroscopePlugin 5.7.4
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
"use strict";
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };

  // @photo-sphere-viewer/core
  var require_core = () => PhotoSphereViewer;

  // three
  var require_three = () => THREE;

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    GyroscopePlugin: () => GyroscopePlugin,
    events: () => events_exports
  });
  var import_core4 = require_core();

  // src/GyroscopeButton.ts
  var import_core2 = require_core();

  // src/compass.svg
  var compass_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="currentColor" d="M50 0a50 50 0 1 0 0 100A50 50 0 0 0 50 0zm0 88.81a38.86 38.86 0 0 1-38.81-38.8 38.86 38.86 0 0 1 38.8-38.82A38.86 38.86 0 0 1 88.82 50 38.87 38.87 0 0 1 50 88.81z"/><path fill="currentColor" d="M72.07 25.9L40.25 41.06 27.92 74.12l31.82-15.18v-.01l12.32-33.03zM57.84 54.4L44.9 42.58l21.1-10.06-8.17 21.9z"/><!--Created by iconoci from the Noun Project--></svg>';

  // src/events.ts
  var events_exports = {};
  __export(events_exports, {
    GyroscopeUpdatedEvent: () => GyroscopeUpdatedEvent
  });
  var import_core = require_core();
  var _GyroscopeUpdatedEvent = class _GyroscopeUpdatedEvent extends import_core.TypedEvent {
    /** @internal */
    constructor(gyroscopeEnabled) {
      super(_GyroscopeUpdatedEvent.type);
      this.gyroscopeEnabled = gyroscopeEnabled;
    }
  };
  _GyroscopeUpdatedEvent.type = "gyroscope-updated";
  var GyroscopeUpdatedEvent = _GyroscopeUpdatedEvent;

  // src/GyroscopeButton.ts
  var GyroscopeButton = class extends import_core2.AbstractButton {
    /**
     * @param {PSV.components.Navbar} navbar
     */
    constructor(navbar) {
      super(navbar, {
        className: "psv-gyroscope-button",
        icon: compass_default,
        hoverScale: true,
        collapsable: true,
        tabbable: true
      });
      this.plugin = this.viewer.getPlugin("gyroscope");
      if (this.plugin) {
        this.plugin.addEventListener(GyroscopeUpdatedEvent.type, this);
      }
    }
    destroy() {
      if (this.plugin) {
        this.plugin.removeEventListener(GyroscopeUpdatedEvent.type, this);
      }
      super.destroy();
    }
    isSupported() {
      return !this.plugin ? false : { initial: false, promise: this.plugin.isSupported() };
    }
    /**
     * @internal
     */
    handleEvent(e) {
      if (e instanceof GyroscopeUpdatedEvent) {
        this.toggleActive(e.gyroscopeEnabled);
      }
    }
    /**
     * Toggles gyroscope control
     */
    onClick() {
      this.plugin.toggle();
    }
  };
  GyroscopeButton.id = "gyroscope";

  // src/GyroscopePlugin.ts
  var import_core3 = require_core();
  var import_three2 = require_three();

  // src/DeviceOrientationControls.js
  var import_three = require_three();
  var _zee = new import_three.Vector3(0, 0, 1);
  var _euler = new import_three.Euler();
  var _q0 = new import_three.Quaternion();
  var _q1 = new import_three.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
  var DeviceOrientationControls = class {
    constructor(object, preferAbsolute) {
      if (window.isSecureContext === false) {
        console.error(
          "THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)"
        );
      }
      const scope = this;
      const EPS = 1e-6;
      const lastQuaternion = new import_three.Quaternion();
      let nonAbsoluteListener = false;
      this.object = object;
      this.object.rotation.reorder("YXZ");
      this.enabled = true;
      this.deviceOrientation = {};
      this.screenOrientation = 0;
      this.alphaOffset = 0;
      const onDeviceOrientationChangeEvent = function(event) {
        scope.deviceOrientation = event;
      };
      const onDeviceOrientationAbsoluteChangeEvent = function(event) {
        if (nonAbsoluteListener) {
          window.removeEventListener("deviceorientation", onDeviceOrientationChangeEvent);
          nonAbsoluteListener = false;
        }
        scope.deviceOrientation = event;
      };
      const onScreenOrientationChangeEvent = function() {
        scope.screenOrientation = window.orientation || 0;
      };
      const setObjectQuaternion = function(quaternion, alpha, beta, gamma, orient) {
        _euler.set(beta, alpha, -gamma, "YXZ");
        quaternion.setFromEuler(_euler);
        quaternion.multiply(_q1);
        quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient));
      };
      this.connect = function() {
        onScreenOrientationChangeEvent();
        if (window.DeviceOrientationEvent !== void 0 && typeof window.DeviceOrientationEvent.requestPermission === "function") {
          window.DeviceOrientationEvent.requestPermission().then(function(response) {
            if (response == "granted") {
              window.addEventListener("orientationchange", onScreenOrientationChangeEvent);
              window.addEventListener("deviceorientation", onDeviceOrientationChangeEvent);
              if (preferAbsolute) {
                window.addEventListener("deviceorientationabsolute", onDeviceOrientationAbsoluteChangeEvent);
                nonAbsoluteListener = true;
              }
            }
          }).catch(function(error) {
            console.error("THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:", error);
          });
        } else {
          window.addEventListener("orientationchange", onScreenOrientationChangeEvent);
          window.addEventListener("deviceorientation", onDeviceOrientationChangeEvent);
          if (preferAbsolute) {
            window.addEventListener("deviceorientationabsolute", onDeviceOrientationAbsoluteChangeEvent);
            nonAbsoluteListener = true;
          }
        }
        scope.enabled = true;
      };
      this.disconnect = function() {
        window.removeEventListener("orientationchange", onScreenOrientationChangeEvent);
        window.removeEventListener("deviceorientation", onDeviceOrientationChangeEvent);
        window.removeEventListener("deviceorientationabsolute", onDeviceOrientationAbsoluteChangeEvent);
        nonAbsoluteListener = false;
        scope.enabled = false;
      };
      this.update = function() {
        if (scope.enabled === false)
          return false;
        const device = scope.deviceOrientation;
        if (device) {
          if (!device.alpha && !device.beta && !device.gamma) {
            return false;
          }
          const alpha = device.alpha ? import_three.MathUtils.degToRad(device.alpha) + scope.alphaOffset : 0;
          const beta = device.beta ? import_three.MathUtils.degToRad(device.beta) : 0;
          const gamma = device.gamma ? import_three.MathUtils.degToRad(device.gamma) : 0;
          const orient = scope.screenOrientation ? import_three.MathUtils.degToRad(scope.screenOrientation) : 0;
          setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);
          if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
            lastQuaternion.copy(scope.object.quaternion);
          }
          return true;
        }
        return false;
      };
      this.dispose = function() {
        scope.disconnect();
      };
      this.connect();
    }
  };

  // src/GyroscopePlugin.ts
  var getConfig = import_core3.utils.getConfigParser(
    {
      touchmove: true,
      roll: true,
      absolutePosition: false,
      moveMode: "smooth"
    },
    {
      moveMode(moveMode, { defValue }) {
        if (moveMode !== "smooth" && moveMode !== "fast") {
          import_core3.utils.logWarn(`GyroscopePlugin: invalid moveMode`);
          return defValue;
        } else {
          return moveMode;
        }
      }
    }
  );
  var direction = new import_three2.Vector3();
  var GyroscopePlugin = class extends import_core3.AbstractConfigurablePlugin {
    constructor(viewer, config) {
      super(viewer, config);
      this.state = {
        isSupported: this.__checkSupport(),
        alphaOffset: 0,
        enabled: false,
        config_moveInertia: true,
        moveMode: this.config.moveMode
      };
    }
    /**
     * @internal
     */
    init() {
      super.init();
      this.viewer.addEventListener(import_core3.events.StopAllEvent.type, this);
      this.viewer.addEventListener(import_core3.events.BeforeRotateEvent.type, this);
      this.viewer.addEventListener(import_core3.events.BeforeRenderEvent.type, this);
    }
    /**
     * @internal
     */
    destroy() {
      this.viewer.removeEventListener(import_core3.events.StopAllEvent.type, this);
      this.viewer.removeEventListener(import_core3.events.BeforeRotateEvent.type, this);
      this.viewer.removeEventListener(import_core3.events.BeforeRenderEvent.type, this);
      this.stop();
      this.controls?.disconnect();
      delete this.controls;
      super.destroy();
    }
    /**
     * @internal
     */
    handleEvent(e) {
      if (e instanceof import_core3.events.StopAllEvent) {
        this.stop();
      } else if (e instanceof import_core3.events.BeforeRenderEvent) {
        this.__onBeforeRender();
      } else if (e instanceof import_core3.events.BeforeRotateEvent) {
        this.__onBeforeRotate(e);
      }
    }
    /**
     * Checks if the gyroscope is supported
     */
    isSupported() {
      return this.state.isSupported;
    }
    /**
     * Checks if the gyroscope is enabled
     */
    isEnabled() {
      return this.state.enabled;
    }
    /**
     * Enables the gyroscope navigation if available
     */
    start(moveMode = this.config.moveMode) {
      return this.state.isSupported.then((supported) => {
        if (supported) {
          return this.__requestPermission();
        } else {
          import_core3.utils.logWarn("gyroscope not available");
          return Promise.reject();
        }
      }).then((granted) => {
        if (granted) {
          return Promise.resolve();
        } else {
          import_core3.utils.logWarn("gyroscope not allowed");
          return Promise.reject();
        }
      }).then(() => {
        this.viewer.stopAll();
        this.state.moveMode = moveMode;
        this.state.config_moveInertia = this.viewer.config.moveInertia;
        this.viewer.config.moveInertia = false;
        if (!this.controls) {
          this.controls = new DeviceOrientationControls(new import_three2.Object3D(), this.config.absolutePosition);
        }
        this.controls.alphaOffset = 0;
        this.state.alphaOffset = this.config.absolutePosition ? 0 : null;
        this.state.enabled = true;
        this.dispatchEvent(new GyroscopeUpdatedEvent(true));
      });
    }
    /**
     * Disables the gyroscope navigation
     */
    stop() {
      if (this.isEnabled()) {
        this.state.enabled = false;
        this.viewer.config.moveInertia = this.state.config_moveInertia;
        if (this.config.roll) {
          this.viewer.dynamics.roll.goto(0, 30);
        }
        this.dispatchEvent(new GyroscopeUpdatedEvent(false));
        this.viewer.resetIdleTimer();
      }
    }
    /**
     * Enables or disables the gyroscope navigation
     */
    toggle() {
      if (this.isEnabled()) {
        this.stop();
      } else {
        this.start();
      }
    }
    /**
     * Handles gyro movements
     */
    __onBeforeRender() {
      if (!this.isEnabled()) {
        return;
      }
      if (!this.controls.deviceOrientation) {
        return;
      }
      const position = this.viewer.getPosition();
      if (this.state.alphaOffset === null) {
        if (this.controls.update()) {
          this.controls.object.getWorldDirection(direction);
          const sphericalCoords = this.viewer.dataHelper.vector3ToSphericalCoords(direction);
          this.state.alphaOffset = sphericalCoords.yaw - position.yaw;
        }
      } else {
        this.controls.alphaOffset = this.state.alphaOffset;
        if (this.controls.update()) {
          this.controls.object.getWorldDirection(direction);
          const sphericalCoords = this.viewer.dataHelper.vector3ToSphericalCoords(direction);
          const target = {
            yaw: sphericalCoords.yaw,
            pitch: -sphericalCoords.pitch
          };
          const step = this.state.moveMode === "smooth" ? 3 : 10;
          this.viewer.dynamics.position.goto(target, import_core3.utils.getAngle(position, target) < 0.01 ? 1 : step);
          if (this.config.roll) {
            this.viewer.dynamics.roll.goto(-this.controls.object.rotation.z, this.state.moveMode === "smooth" ? 10 : 30);
          }
        }
      }
    }
    /**
     * Intercepts moves and offsets the alpha angle
     */
    __onBeforeRotate(e) {
      if (this.isEnabled()) {
        e.preventDefault();
        if (this.config.touchmove) {
          this.state.alphaOffset -= e.position.yaw - this.viewer.getPosition().pitch;
        }
      }
    }
    /**
     * Detects if device orientation is supported
     */
    __checkSupport() {
      if ("DeviceOrientationEvent" in window && typeof DeviceOrientationEvent.requestPermission === "function") {
        return Promise.resolve(true);
      } else if ("DeviceOrientationEvent" in window) {
        return new Promise((resolve) => {
          const listener = (e) => {
            resolve(!!e && !import_core3.utils.isNil(e.alpha) && !isNaN(e.alpha));
            window.removeEventListener("deviceorientation", listener);
          };
          window.addEventListener("deviceorientation", listener, false);
          setTimeout(listener, 1e4);
        });
      } else {
        return Promise.resolve(false);
      }
    }
    /**
     * Request permission to the motion API
     */
    __requestPermission() {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        return DeviceOrientationEvent.requestPermission().then((response) => response === "granted").catch(() => false);
      } else {
        return Promise.resolve(true);
      }
    }
  };
  GyroscopePlugin.id = "gyroscope";
  GyroscopePlugin.VERSION = "5.7.4";
  GyroscopePlugin.configParser = getConfig;
  GyroscopePlugin.readonlyOptions = ["absolutePosition"];

  // src/index.ts
  import_core4.DEFAULTS.lang[GyroscopeButton.id] = "Gyroscope";
  (0, import_core4.registerButton)(GyroscopeButton, "caption:right");
  __copyProps(__defProp(exports, "__esModule", { value: true }), src_exports);

}));//# sourceMappingURL=index.js.map