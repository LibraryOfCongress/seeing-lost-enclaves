/*!
 * PhotoSphereViewer.StereoPlugin 5.7.4
 * @copyright 2024 Damien "Mistic" Sorel
 * @licence MIT (https://opensource.org/licenses/MIT)
 */
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { DEFAULTS, registerButton } from "@photo-sphere-viewer/core";

// src/events.ts
var events_exports = {};
__export(events_exports, {
  StereoUpdatedEvent: () => StereoUpdatedEvent
});
import { TypedEvent } from "@photo-sphere-viewer/core";
var _StereoUpdatedEvent = class _StereoUpdatedEvent extends TypedEvent {
  /** @internal */
  constructor(stereoEnabled) {
    super(_StereoUpdatedEvent.type);
    this.stereoEnabled = stereoEnabled;
  }
};
_StereoUpdatedEvent.type = "stereo-updated";
var StereoUpdatedEvent = _StereoUpdatedEvent;

// src/StereoButton.ts
import { AbstractButton } from "@photo-sphere-viewer/core";

// src/icons/stereo.svg
var stereo_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -2 16 16"><path fill="currentColor" d="M13.104 0H2.896C2.332 0 1 .392 1 .875h14C15 .392 13.668 0 13.104 0zM15 1H1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3.534a2 2 0 0 0 1.821-1.172l1.19-2.618a.5.5 0 0 1 .91 0l1.19 2.618A2 2 0 0 0 11.466 11H15a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/><!--Created by Idev\xE3 Batista from the Noun Project--></svg>';

// src/StereoButton.ts
var StereoButton = class extends AbstractButton {
  constructor(navbar) {
    super(navbar, {
      className: "psv-stereo-button",
      icon: stereo_default,
      hoverScale: true,
      collapsable: true,
      tabbable: true
    });
    this.plugin = this.viewer.getPlugin("stereo");
    if (this.plugin) {
      this.plugin.addEventListener(StereoUpdatedEvent.type, this);
    }
  }
  destroy() {
    if (this.plugin) {
      this.plugin.removeEventListener(StereoUpdatedEvent.type, this);
    }
    super.destroy();
  }
  isSupported() {
    return !this.plugin ? false : { initial: false, promise: this.plugin.isSupported };
  }
  handleEvent(e) {
    if (e instanceof StereoUpdatedEvent) {
      this.toggleActive(e.stereoEnabled);
    }
  }
  /**
   * Toggles stereo control
   */
  onClick() {
    this.plugin.toggle();
  }
};
StereoButton.id = "stereo";

// src/StereoPlugin.ts
import { AbstractPlugin, events, PSVError, utils } from "@photo-sphere-viewer/core";

// ../../node_modules/three/examples/jsm/effects/StereoEffect.js
import {
  StereoCamera,
  Vector2
} from "three";
var StereoEffect = class {
  constructor(renderer) {
    const _stereo = new StereoCamera();
    _stereo.aspect = 0.5;
    const size = new Vector2();
    this.setEyeSeparation = function(eyeSep) {
      _stereo.eyeSep = eyeSep;
    };
    this.setSize = function(width, height) {
      renderer.setSize(width, height);
    };
    this.render = function(scene, camera) {
      if (scene.matrixWorldAutoUpdate === true)
        scene.updateMatrixWorld();
      if (camera.parent === null && camera.matrixWorldAutoUpdate === true)
        camera.updateMatrixWorld();
      _stereo.update(camera);
      renderer.getSize(size);
      if (renderer.autoClear)
        renderer.clear();
      renderer.setScissorTest(true);
      renderer.setScissor(0, 0, size.width / 2, size.height);
      renderer.setViewport(0, 0, size.width / 2, size.height);
      renderer.render(scene, _stereo.cameraL);
      renderer.setScissor(size.width / 2, 0, size.width / 2, size.height);
      renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
      renderer.render(scene, _stereo.cameraR);
      renderer.setScissorTest(false);
    };
  }
};

// src/icons/mobile-rotate.svg
var mobile_rotate_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="currentColor" d="M66.7 19a14 14 0 0 1 13.8 12.1l-3.9-2.7c-.5-.3-1.1-.2-1.4.3-.3.5-.2 1.1.3 1.4l5.7 3.9.6.2c.3 0 .6-.2.8-.4l3.9-5.7c.3-.5.2-1.1-.3-1.4-.5-.3-1.1-.2-1.4.3l-2.4 3.5A16 16 0 0 0 66.7 17c-.6 0-1 .4-1 1s.4 1 1 1zM25 15h10c.6 0 1-.4 1-1s-.4-1-1-1H25c-.6 0-1 .4-1 1s.4 1 1 1zm-6.9 30H16l-2 .2a1 1 0 0 0-.8 1.2c.1.5.5.8 1 .8h.2l1.7-.2h2.1c.6 0 1-.4 1-1s-.5-1-1.1-1zm10 0h-4c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1s-.4-1-1-1zM84 45H55V16A11 11 0 0 0 44 5H16A11 11 0 0 0 5 16v68a11 11 0 0 0 11 11h68a11 11 0 0 0 11-11V56a11 11 0 0 0-11-11zM16 93c-5 0-9-4-9-9V53.2c.3-.1.6-.3.7-.6a9.8 9.8 0 0 1 2-3c.4-.4.4-1 0-1.4a1 1 0 0 0-1.4 0l-1.2 1.5V16c0-5 4-9 9-9h28c5 0 9 4 9 9v68c0 5-4 9-9 9H16zm77-9c0 5-4 9-9 9H50.3c2.8-2 4.7-5.3 4.7-9V47h29c5 0 9 4 9 9v28zM38.1 45h-4c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1s-.5-1-1-1zm9.9 0h-4c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1s-.4-1-1-1zm38 19c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1s1-.4 1-1V65c0-.6-.4-1-1-1z"/><!--Created by Anthony Bresset from the Noun Project--></svg>';

// src/utils.ts
function getOrientation() {
  try {
    switch (screen.orientation.type) {
      case "landscape-primary":
      case "landscape-secondary":
        return "landscape";
      case "portrait-primary":
      case "portrait-secondary":
        return "portrait";
      default:
        throw new Error("unknown");
    }
  } catch {
    if (window.innerHeight > window.innerWidth) {
      return "portrait";
    } else {
      return "landscape";
    }
  }
}
function waitLandscape(cb) {
  try {
    const listener = () => {
      if (getOrientation() === "landscape") {
        cb();
      }
    };
    screen.orientation.addEventListener("change", listener);
    return listener;
  } catch {
    return setInterval(() => {
      if (getOrientation() === "landscape") {
        cb();
      }
    }, 500);
  }
}
function cancelWaitLandscape(id) {
  if (typeof id === "number") {
    clearInterval(id);
  } else {
    try {
      screen.orientation.removeEventListener("change", id);
    } catch {
    }
  }
}

// src/StereoPlugin.ts
var ID_OVERLAY_PLEASE_ROTATE = "pleaseRotate";
var StereoPlugin = class extends AbstractPlugin {
  constructor(viewer) {
    super(viewer);
    this.state = {
      enabled: false,
      wakeLock: null,
      waitLandscape: null
    };
  }
  /**
   * @internal
   */
  get isSupported() {
    return this.gyroscope.isSupported();
  }
  /**
   * @internal
   */
  init() {
    super.init();
    this.markers = this.viewer.getPlugin("markers");
    this.compass = this.viewer.getPlugin("compass");
    this.gyroscope = this.viewer.getPlugin("gyroscope");
    if (!this.gyroscope) {
      throw new PSVError("Stereo plugin requires the Gyroscope plugin");
    }
    this.viewer.addEventListener(events.StopAllEvent.type, this);
    this.viewer.addEventListener(events.ClickEvent.type, this);
  }
  /**
   * @internal
   */
  destroy() {
    this.viewer.removeEventListener(events.StopAllEvent.type, this);
    this.viewer.removeEventListener(events.ClickEvent.type, this);
    this.stop();
    delete this.markers;
    delete this.compass;
    delete this.gyroscope;
    super.destroy();
  }
  /**
   * @internal
   */
  handleEvent(e) {
    if (e instanceof events.StopAllEvent || e instanceof events.ClickEvent) {
      this.stop();
    }
  }
  /**
   * Checks if the stereo view is enabled
   */
  isEnabled() {
    return this.state.enabled;
  }
  /**
   * Enables the stereo view
   * @description
   *  - enables wake lock
   *  - enables full screen
   *  - starts gyroscope controle
   *  - hides markers, navbar and panel
   *  - instanciate the stereo effect
   */
  start() {
    this.viewer.enterFullscreen();
    this.__startWakelock();
    this.__lockOrientation();
    return this.gyroscope.start("fast").then(
      () => {
        this.viewer.renderer.setCustomRenderer((renderer) => new StereoEffect(renderer));
        this.state.enabled = true;
        this.markers?.hideAllMarkers();
        this.compass?.hide();
        this.viewer.navbar.hide();
        this.viewer.panel.hide();
        this.dispatchEvent(new StereoUpdatedEvent(true));
        this.viewer.notification.show({
          content: this.viewer.config.lang.stereoNotification,
          timeout: 3e3
        });
      },
      () => {
        this.__unlockOrientation();
        this.__stopWakelock();
        this.viewer.exitFullscreen();
        return Promise.reject();
      }
    );
  }
  /**
   * Disables the stereo view
   */
  stop() {
    if (this.isEnabled()) {
      this.viewer.renderer.setCustomRenderer(null);
      this.state.enabled = false;
      this.markers?.showAllMarkers();
      this.compass?.show();
      this.viewer.navbar.show();
      this.__unlockOrientation();
      this.__stopWakelock();
      this.viewer.exitFullscreen();
      this.gyroscope.stop();
      this.dispatchEvent(new StereoUpdatedEvent(false));
    }
  }
  /**
   * Enables or disables the stereo view
   */
  toggle() {
    if (this.isEnabled()) {
      this.stop();
    } else {
      this.start();
    }
  }
  /**
   * Enables WakeLock
   */
  __startWakelock() {
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then((wakeLock) => {
        this.state.wakeLock = wakeLock;
      }).catch(() => utils.logWarn("Cannot acquire WakeLock"));
    } else {
      utils.logWarn("WakeLock is not available");
    }
  }
  /**
   * Disables WakeLock
   */
  __stopWakelock() {
    if (this.state.wakeLock) {
      this.state.wakeLock.release();
      this.state.wakeLock = null;
    }
  }
  /**
   * Tries to lock the device in landscape or display a message
   */
  __lockOrientation() {
    let displayRotateMessageTimeout;
    const displayRotateMessage = () => {
      if (getOrientation() !== "landscape" && !this.viewer.overlay.isVisible(ID_OVERLAY_PLEASE_ROTATE)) {
        this.viewer.overlay.show({
          id: ID_OVERLAY_PLEASE_ROTATE,
          image: mobile_rotate_default,
          title: this.viewer.config.lang.pleaseRotate,
          text: this.viewer.config.lang.tapToContinue
        });
        this.state.waitLandscape = waitLandscape(() => {
          this.viewer.overlay.hide(ID_OVERLAY_PLEASE_ROTATE);
          cancelWaitLandscape(this.state.waitLandscape);
          this.state.waitLandscape = null;
        });
      }
      if (displayRotateMessageTimeout) {
        clearTimeout(displayRotateMessageTimeout);
        displayRotateMessageTimeout = null;
      }
    };
    try {
      screen.orientation.lock("landscape").then(null, () => displayRotateMessage());
      displayRotateMessageTimeout = setTimeout(() => displayRotateMessage(), 1e3);
    } catch {
      displayRotateMessage();
    }
  }
  /**
   * Unlock the device orientation
   */
  __unlockOrientation() {
    this.viewer.overlay.hide(ID_OVERLAY_PLEASE_ROTATE);
    if (this.state.waitLandscape) {
      cancelWaitLandscape(this.state.waitLandscape);
      this.state.waitLandscape = null;
    }
    try {
      screen.orientation?.unlock();
    } catch {
    }
  }
};
StereoPlugin.id = "stereo";
StereoPlugin.VERSION = "5.7.4";

// src/index.ts
DEFAULTS.lang[StereoButton.id] = "Stereo view";
registerButton(StereoButton, "caption:right");
DEFAULTS.lang.stereoNotification = "Tap anywhere to exit stereo view.";
DEFAULTS.lang.pleaseRotate = "Please rotate your device";
DEFAULTS.lang.tapToContinue = "(or tap to continue)";
export {
  StereoPlugin,
  events_exports as events
};
//# sourceMappingURL=index.module.js.map