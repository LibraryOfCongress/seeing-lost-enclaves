import { Mesh, Vector3, Renderer as Renderer$1, Raycaster, Vector2, Intersection, Euler, WebGLRenderer, Object3D, Texture, WebGLRendererParameters, BufferGeometry, Material } from 'three';

/**
 * Default duration of the transition between panoramas
 */
declare const DEFAULT_TRANSITION = 1500;
/**
 *  Minimum duration of the animations created with {@link Viewer#animate}
 */
declare const ANIMATION_MIN_DURATION = 500;
/**
 * Number of pixels bellow which a mouse move will be considered as a click
 */
declare const MOVE_THRESHOLD = 4;
/**
 * Delay in milliseconds between two clicks to consider a double click
 */
declare const DBLCLICK_DELAY = 300;
/**
 * Delay in milliseconds to emulate a long touch
 */
declare const LONGTOUCH_DELAY = 500;
/**
 * Delay in milliseconds to for the two fingers overlay to appear
 */
declare const TWOFINGERSOVERLAY_DELAY = 100;
/**
 * Duration in milliseconds of the "ctrl zoom" overlay
 */
declare const CTRLZOOM_TIMEOUT = 2000;
/**
 * Duration of the mouse position history used to compute inertia
 */
declare const INERTIA_WINDOW = 300;
/**
 * Radius of the SphereGeometry, Half-length of the BoxGeometry
 */
declare const SPHERE_RADIUS = 10;
/**
 * Property name added to viewer element
 */
declare const VIEWER_DATA = "photoSphereViewer";
/**
 * CSS class that must be applied on elements whose mouse events must not bubble to the viewer itself
 */
declare const CAPTURE_EVENTS_CLASS = "psv--capture-event";
/**
 * Actions available for {@link ViewerConfig['keyboard']} configuration
 */
declare enum ACTIONS {
    ROTATE_UP = "ROTATE_UP",
    ROTATE_DOWN = "ROTATE_DOWN",
    ROTATE_RIGHT = "ROTATE_RIGHT",
    ROTATE_LEFT = "ROTATE_LEFT",
    ZOOM_IN = "ZOOM_IN",
    ZOOM_OUT = "ZOOM_OUT"
}
/**
 * Subset of keyboard codes
 */
declare const KEY_CODES: {
    Enter: string;
    Control: string;
    Escape: string;
    Space: string;
    PageUp: string;
    PageDown: string;
    ArrowLeft: string;
    ArrowUp: string;
    ArrowRight: string;
    ArrowDown: string;
    Delete: string;
    Plus: string;
    Minus: string;
};
/**
 * Collection of SVG icons
 */
declare const ICONS: {
    arrow: string;
    close: string;
    download: string;
    fullscreenIn: string;
    fullscreenOut: string;
    info: string;
    menu: string;
    zoomIn: string;
    zoomOut: string;
};
/**
 * Collection of easing functions
 * @link https://gist.github.com/frederickk/6165768
 */
declare const EASINGS: Record<string, (t: number) => number>;

type constants_ACTIONS = ACTIONS;
declare const constants_ACTIONS: typeof ACTIONS;
declare const constants_ANIMATION_MIN_DURATION: typeof ANIMATION_MIN_DURATION;
declare const constants_CAPTURE_EVENTS_CLASS: typeof CAPTURE_EVENTS_CLASS;
declare const constants_CTRLZOOM_TIMEOUT: typeof CTRLZOOM_TIMEOUT;
declare const constants_DBLCLICK_DELAY: typeof DBLCLICK_DELAY;
declare const constants_DEFAULT_TRANSITION: typeof DEFAULT_TRANSITION;
declare const constants_EASINGS: typeof EASINGS;
declare const constants_ICONS: typeof ICONS;
declare const constants_INERTIA_WINDOW: typeof INERTIA_WINDOW;
declare const constants_KEY_CODES: typeof KEY_CODES;
declare const constants_LONGTOUCH_DELAY: typeof LONGTOUCH_DELAY;
declare const constants_MOVE_THRESHOLD: typeof MOVE_THRESHOLD;
declare const constants_SPHERE_RADIUS: typeof SPHERE_RADIUS;
declare const constants_TWOFINGERSOVERLAY_DELAY: typeof TWOFINGERSOVERLAY_DELAY;
declare const constants_VIEWER_DATA: typeof VIEWER_DATA;
declare namespace constants {
  export { constants_ACTIONS as ACTIONS, constants_ANIMATION_MIN_DURATION as ANIMATION_MIN_DURATION, constants_CAPTURE_EVENTS_CLASS as CAPTURE_EVENTS_CLASS, constants_CTRLZOOM_TIMEOUT as CTRLZOOM_TIMEOUT, constants_DBLCLICK_DELAY as DBLCLICK_DELAY, constants_DEFAULT_TRANSITION as DEFAULT_TRANSITION, constants_EASINGS as EASINGS, constants_ICONS as ICONS, constants_INERTIA_WINDOW as INERTIA_WINDOW, constants_KEY_CODES as KEY_CODES, constants_LONGTOUCH_DELAY as LONGTOUCH_DELAY, constants_MOVE_THRESHOLD as MOVE_THRESHOLD, constants_SPHERE_RADIUS as SPHERE_RADIUS, constants_TWOFINGERSOVERLAY_DELAY as TWOFINGERSOVERLAY_DELAY, constants_VIEWER_DATA as VIEWER_DATA };
}

/**
 * Base class for UI components
 */
declare abstract class AbstractComponent {
    protected readonly parent: Viewer | AbstractComponent;
    /**
     * Reference to main controller
     */
    protected readonly viewer: Viewer;
    /**
     * Container element
     */
    readonly container: HTMLDivElement;
    constructor(parent: Viewer | AbstractComponent, config: {
        className?: string;
    });
    /**
     * Destroys the component
     */
    destroy(): void;
    /**
     * Displays or hides the component
     */
    toggle(visible?: boolean): void;
    /**
     * Hides the component
     */
    hide(options?: any): void;
    /**
     * Displays the component
     */
    show(options?: any): void;
    /**
     * Checks if the component is visible
     */
    isVisible(): boolean;
}

/**
 * Loader component
 */
declare class Loader extends AbstractComponent {
    private readonly loader;
    private readonly canvas;
    private readonly size;
    private readonly border;
    private readonly thickness;
    private readonly color;
    private readonly textColor;
    /**
     * Sets the loader progression
     */
    setProgress(value: number): void;
    private __updateContent;
}

/**
 * Configuration for {@link AbstractButton}
 */
type ButtonConfig = {
    id?: string;
    className?: string;
    title?: string;
    /**
     * if the button has an mouse hover effect
     * @default false
     */
    hoverScale?: boolean;
    /**
     * if the button can be moved to menu when the navbar is too small
     * @default false
     */
    collapsable?: boolean;
    /**
     * if the button is accessible with the keyboard
     * @default true
     */
    tabbable?: boolean;
    /**
     * icon of the button
     */
    icon?: string;
    /**
     * override icon when the button is active
     */
    iconActive?: string;
};
/**
 * Base class for navbar buttons
 */
declare abstract class AbstractButton extends AbstractComponent {
    /**
     * Unique identifier of the button
     */
    static readonly id: string;
    /**
     * Identifier to declare a group of buttons
     */
    static readonly groupId?: string;
    /**
     * Internal properties
     */
    protected readonly state: {
        visible: boolean;
        enabled: boolean;
        supported: boolean;
        collapsed: boolean;
        active: boolean;
        width: number;
    };
    protected readonly config: ButtonConfig;
    get id(): string;
    get title(): string;
    get content(): string;
    get width(): number;
    get collapsable(): boolean;
    constructor(navbar: Navbar, config: ButtonConfig);
    /**
     * Action when the button is clicked
     */
    abstract onClick(): void;
    show(refresh?: boolean): void;
    hide(refresh?: boolean): void;
    /**
     * Checks if the button can be displayed
     */
    isSupported(): boolean | ResolvableBoolean;
    /**
     * Changes the active state of the button
     */
    toggleActive(active?: boolean): void;
    /**
     * Disables the button
     */
    disable(): void;
    /**
     * Enables the button
     */
    enable(): void;
    /**
     * Collapses the button in the navbar menu
     */
    collapse(): void;
    /**
     * Uncollapses the button from the navbar menu
     */
    uncollapse(): void;
    private __setIcon;
}
type ButtonConstructor = (new (navbar: Navbar) => AbstractButton) & typeof AbstractButton;

/**
 * Register a new button available for all viewers
 * @param button
 * @param [defaultPosition]  If provided the default configuration of the navbar will be modified.
 * Possible values are :
 *    - `start`
 *    - `end`
 *    - `[id]:left`
 *    - `[id]:right`
 * @throws {@link PSVError} if the button constructor has no "id"
 */
declare function registerButton(button: ButtonConstructor, defaultPosition?: string): void;
/**
 * Navigation bar component
 */
declare class Navbar extends AbstractComponent {
    /**
     * Shows the navbar
     */
    show(): void;
    /**
     * Hides the navbar
     */
    hide(): void;
    /**
     * Change the buttons visible on the navbar
     */
    setButtons(buttons: ParsedViewerConfig['navbar']): void;
    /**
     * Changes the navbar caption
     */
    setCaption(html: string): void;
    /**
     * Returns a button by its identifier
     */
    getButton(id: string, warnNotFound?: boolean): AbstractButton;
}

/**
 * Configuration for {@link Notification.show}
 */
type NotificationConfig = {
    /**
     * unique identifier to use with {@link Notification.hide} and {@link Notification.isVisible}
     */
    id?: string;
    /**
     * notification content
     */
    content: string;
    /**
     * automatically hide the notification after X milliseconds
     */
    timeout?: number;
};
/**
 * Notification component
 */
declare class Notification extends AbstractComponent {
    private readonly content;
    /**
     * Checks if the notification is visible
     */
    isVisible(id?: string): boolean;
    /**
     * Displays a notification on the viewer
     *
     * @example
     * viewer.showNotification({ content: 'Hello world', timeout: 5000 })
     * @example
     * viewer.showNotification('Hello world')
     */
    show(config: string | NotificationConfig): void;
    /**
     * Hides the notification
     */
    hide(id?: string): void;
}

/**
 * Configuration for {@link Overlay.show}
 */
type OverlayConfig = {
    /**
     * unique identifier to use with {@link Overlay.hide} and {@link Overlay.isVisible}
     */
    id?: string;
    /**
     * SVG image/icon displayed above the text
     */
    image?: string;
    /**
     * main message
     */
    title: string;
    /**
     * secondary message
     */
    text?: string;
    /**
     * if the user can hide the overlay by clicking
     * @default true
     */
    dissmisable?: boolean;
};
/**
 * Overlay component
 */
declare class Overlay extends AbstractComponent {
    private readonly image;
    private readonly title;
    private readonly text;
    /**
     * Checks if the overlay is visible
     */
    isVisible(id?: string): boolean;
    /**
     * Displays an overlay on the viewer
     */
    show(config: string | OverlayConfig): void;
    /**
     * Hides the overlay
     */
    hide(id?: string): void;
}

/**
 * Configuration for {@link Panel.show}
 */
type PanelConfig = {
    /**
     * unique identifier to use with {@link Panel.hide} and {@link Panel.isVisible} and to store the width
     */
    id?: string;
    /**
     * HTML content of the panel
     */
    content: string;
    /**
     * remove the default margins
     * @default false
     */
    noMargin?: boolean;
    /**
     * initial width
     */
    width?: string;
    /**
     * called when the user clicks inside the panel or presses the Enter key while an element focused
     */
    clickHandler?: (target: HTMLElement) => void;
};
/**
 * Panel component
 */
declare class Panel extends AbstractComponent {
    private readonly content;
    /**
     * Checks if the panel is visible
     */
    isVisible(id?: string): boolean;
    /**
     * Shows the panel
     */
    show(config: string | PanelConfig): void;
    /**
     * Hides the panel
     */
    hide(id?: string): void;
    private __onMouseDown;
    private __onTouchStart;
    private __onMouseUp;
    private __onTouchEnd;
    private __onMouseMove;
    private __onTouchMove;
    private __onKeyPress;
    private __startResize;
    private __resize;
}

/**
 * Object defining the tooltip position
 */
type TooltipPosition = {
    /**
     * Position of the tip of the arrow of the tooltip, in pixels
     */
    top: number;
    /**
     * Position of the tip of the arrow of the tooltip, in pixels
     */
    left: number;
    /**
     * Tooltip position toward it's arrow tip.
     * Accepted values are combinations of `top`, `center`, `bottom` and `left`, `center`, `right`.
     */
    position?: string | [string, string];
};
/**
 * Configuration for {@link Viewer.createTooltip}
 */
type TooltipConfig = TooltipPosition & {
    /**
     * HTML content of the tooltip
     */
    content: string;
    /**
     * Additional CSS class added to the tooltip
     */
    className?: string;
    /**
     * CSS properties added to the tooltip
     */
    style?: Record<string, string>;
    /**
     * Userdata associated to the tooltip
     */
    data?: any;
};
/**
 * Tooltip component
 * @description Never instanciate tooltips directly use {@link Viewer#createTooltip} instead
 */
declare class Tooltip extends AbstractComponent {
    private readonly content;
    private readonly arrow;
    /**
     * Updates the content of the tooltip, optionally with a new position
     * @throws {@link PSVError} if the configuration is invalid
     */
    update(content: string, config?: TooltipPosition): void;
    /**
     * Moves the tooltip to a new position
     * @throws {@link PSVError} if the configuration is invalid
     */
    move(config: TooltipPosition): void;
    /**
     * Hides the tooltip
     */
    hide(): void;
    /**
     * Finalize transition
     */
    private __onTransitionEnd;
    /**
     * Computes the position of the tooltip and its arrow
     */
    private __computeTooltipPosition;
    /**
     * If the tooltip contains images, recompute its size once they are loaded
     */
    private __waitImages;
}

/**
 * Base class for events dispatched by {@link TypedEventTarget}
 * @template TTarget type of the event target
 */
declare abstract class TypedEvent<TTarget extends TypedEventTarget<any>> extends Event {
    static readonly type: string;
    target: TTarget;
    constructor(type: string, cancelable?: boolean);
}
/**
 * Decorator for EventTarget allowing to strongly type events and listeners
 * @link https://rjzaworski.com/2021/06/event-target-with-typescript
 * @template TEvents union of dispatched events
 */
declare class TypedEventTarget<TEvents extends TypedEvent<any>> extends EventTarget {
    dispatchEvent(e: TEvents): boolean;
    /**
     * @template T the name of event
     * @template E the class of the event
     */
    addEventListener<T extends TEvents['type'], E extends TEvents & {
        type: T;
    }>(type: T, callback: ((e: E) => void) | EventListenerObject | null, options?: AddEventListenerOptions | boolean): void;
    /**
     * @template T the name of event
     * @template E the class of the event
     */
    removeEventListener<T extends TEvents['type'], E extends TEvents & {
        type: T;
    }>(type: TEvents['type'], callback: ((e: E) => void) | EventListenerObject | null, options?: EventListenerOptions | boolean): void;
}

/**
 * Base class for all events dispatched by {@link Viewer}
 */
declare abstract class ViewerEvent extends TypedEvent<Viewer> {
}
/**
 * @event Triggered before an animation, can be cancelled
 */
declare class BeforeAnimateEvent extends ViewerEvent {
    /** target position, can be modified */
    position?: Position;
    /** target zoom level, can be modified */
    zoomLevel?: number;
    static readonly type = "before-animate";
    type: 'before-animate';
}
/**
 * @event Triggered before a render
 */
declare class BeforeRenderEvent extends ViewerEvent {
    /** time provided by requestAnimationFrame */
    readonly timestamp: number;
    /**  time elapsed since the previous frame */
    readonly elapsed: number;
    static readonly type = "before-render";
    type: 'before-render';
}
/**
 * @event Triggered before a rotate operation, can be cancelled
 */
declare class BeforeRotateEvent extends ViewerEvent {
    /** target position, can be modified */
    position: Position;
    static readonly type = "before-rotate";
    type: 'before-rotate';
}
/**
 * @event Triggered when the user clicks on the viewer (everywhere excluding the navbar and the side panel)
 */
declare class ClickEvent extends ViewerEvent {
    readonly data: ClickData;
    static readonly type = "click";
    type: 'click';
}
/**
 * @event Triggered when some options are changed
 */
declare class ConfigChangedEvent extends ViewerEvent {
    readonly options: Array<keyof ViewerConfig>;
    static readonly type = "config-changed";
    type: 'config-changed';
    /**
     * Checks if at least one of the `options` has been modified
     */
    containsOptions(...options: Array<keyof ViewerConfig>): boolean;
}
/**
 * @event Triggered when the user double clicks on the viewer. The simple `click` event is always fired before `dblclick`.
 */
declare class DoubleClickEvent extends ViewerEvent {
    readonly data: ClickData;
    static readonly type = "dblclick";
    type: 'dblclick';
}
/**
 * @event Triggered when the fullscreen is enabled/disabled
 */
declare class FullscreenEvent extends ViewerEvent {
    readonly fullscreenEnabled: boolean;
    static readonly type = "fullscreen";
    type: 'fullscreen';
}
/**
 * @event Triggered when the notification is hidden
 */
declare class HideNotificationEvent extends ViewerEvent {
    readonly notificationId?: string;
    static readonly type = "hide-notification";
    type: 'hide-notification';
}
/**
 * @event Triggered when the overlay is hidden
 */
declare class HideOverlayEvent extends ViewerEvent {
    readonly overlayId?: string;
    static readonly type = "hide-overlay";
    type: 'hide-overlay';
}
/**
 * @event Triggered when the panel is hidden
 */
declare class HidePanelEvent extends ViewerEvent {
    readonly panelId?: string;
    static readonly type = "hide-panel";
    type: 'hide-panel';
}
/**
 * @event Triggered when a tooltip is hidden
 */
declare class HideTooltipEvent extends ViewerEvent {
    /** Userdata associated to the tooltip */
    readonly tooltipData: TooltipConfig['data'];
    static readonly type = "hide-tooltip";
    type: 'hide-tooltip';
}
/**
 * @event Triggered when a key is pressed, can be cancelled
 */
declare class KeypressEvent extends ViewerEvent {
    readonly key: string;
    static readonly type = "key-press";
    type: 'key-press';
}
/**
 * @event Triggered when the loader value changes
 */
declare class LoadProgressEvent extends ViewerEvent {
    readonly progress: number;
    static readonly type = "load-progress";
    type: 'load-progress';
}
/**
 * @event Triggered when a panorama image starts loading
 */
declare class PanoramaLoadEvent extends ViewerEvent {
    readonly panorama: any;
    static readonly type = "panorama-load";
    type: 'panorama-load';
}
/**
 * @event Triggered when a panorama image has been loaded
 */
declare class PanoramaLoadedEvent extends ViewerEvent {
    readonly data: TextureData;
    static readonly type = "panorama-loaded";
    type: 'panorama-loaded';
}
/**
 * @event Triggered when an error occured when loading the panorama
 */
declare class PanoramaErrorEvent extends ViewerEvent {
    readonly panorama: any;
    readonly error: Error;
    static readonly type = "panorama-error";
    type: 'panorama-error';
}
/**
 * @event Triggered when the view angles change
 */
declare class PositionUpdatedEvent extends ViewerEvent {
    readonly position: Position;
    static readonly type = "position-updated";
    type: 'position-updated';
}
/**
 * @event Triggered when camera roll change
 */
declare class RollUpdatedEvent extends ViewerEvent {
    readonly roll: number;
    static readonly type = "roll-updated";
    type: 'roll-updated';
}
/**
 * @event Triggered when the panorama image has been loaded and the viewer is ready to perform the first render
 */
declare class ReadyEvent extends ViewerEvent {
    static readonly type = "ready";
    type: 'ready';
}
/**
 * @event Triggered on each viewer render
 */
declare class RenderEvent extends ViewerEvent {
    static readonly type = "render";
    type: 'render';
}
/**
 * @event Triggered when the notification is shown
 */
declare class ShowNotificationEvent extends ViewerEvent {
    readonly notificationId?: string;
    static readonly type = "show-notification";
    type: 'show-notification';
}
/**
 * @event Triggered when the overlay is shown
 */
declare class ShowOverlayEvent extends ViewerEvent {
    readonly overlayId?: string;
    static readonly type = "show-overlay";
    type: 'show-overlay';
}
/**
 * @event Triggered when the panel is shown
 */
declare class ShowPanelEvent extends ViewerEvent {
    readonly panelId?: string;
    static readonly type = "show-panel";
    type: 'show-panel';
}
/**
 * @event Triggered when a tooltip is shown
 */
declare class ShowTooltipEvent extends ViewerEvent {
    /** Instance of the tooltip */
    readonly tooltip: Tooltip;
    /** Userdata associated to the tooltip */
    readonly tooltipData?: TooltipConfig['data'];
    static readonly type = "show-tooltip";
    type: 'show-tooltip';
}
/**
 * @event Triggered when the viewer size changes
 */
declare class SizeUpdatedEvent extends ViewerEvent {
    readonly size: Size;
    static readonly type = "size-updated";
    type: 'size-updated';
}
/**
 * @event Triggered when all current animations are stopped
 */
declare class StopAllEvent extends ViewerEvent {
    static readonly type = "stop-all";
    type: 'stop-all';
}
/**
 * @event Triggered when the viewer zoom changes
 */
declare class ZoomUpdatedEvent extends ViewerEvent {
    readonly zoomLevel: number;
    static readonly type = "zoom-updated";
    type: 'zoom-updated';
}
/**
 * Base class for events on three.js objects
 *
 * Note: {@link Viewer#observeObjects} must be called for these events to be dispatched
 */
declare abstract class ObjectEvent extends ViewerEvent {
    readonly originalEvent: MouseEvent;
    readonly object: Mesh<any, any>;
    readonly viewerPoint: Point;
    readonly userDataKey: string;
}
/**
 * @event Triggered when the cursor enters an object in the scene
 *
 * Note: {@link Viewer#observeObjects} must be called for this event to be dispatched
 */
declare class ObjectEnterEvent extends ObjectEvent {
    static readonly type = "enter-object";
    type: 'enter-object';
}
/**
 * @event Triggered when the cursor leaves an object in the scene
 *
 * Note: {@link Viewer#observeObjects} must be called for this event to be dispatched
 */
declare class ObjectLeaveEvent extends ObjectEvent {
    static readonly type = "leave-object";
    type: 'leave-object';
}
/**
 * @event Triggered when the cursor moves over an object in the scene
 *
 * Note: {@link Viewer#observeObjects} must be called for this event to be dispatched
 */
declare class ObjectHoverEvent extends ObjectEvent {
    static readonly type = "hover-object";
    type: 'hover-object';
}
type ViewerEvents = BeforeAnimateEvent | BeforeRenderEvent | BeforeRotateEvent | ClickEvent | ConfigChangedEvent | DoubleClickEvent | FullscreenEvent | HideNotificationEvent | HideOverlayEvent | HidePanelEvent | HideTooltipEvent | KeypressEvent | LoadProgressEvent | PanoramaLoadEvent | PanoramaLoadedEvent | PanoramaErrorEvent | PositionUpdatedEvent | RollUpdatedEvent | ReadyEvent | RenderEvent | ShowNotificationEvent | ShowOverlayEvent | ShowPanelEvent | ShowTooltipEvent | SizeUpdatedEvent | StopAllEvent | ZoomUpdatedEvent | ObjectEnterEvent | ObjectLeaveEvent | ObjectHoverEvent;

type events_BeforeAnimateEvent = BeforeAnimateEvent;
declare const events_BeforeAnimateEvent: typeof BeforeAnimateEvent;
type events_BeforeRenderEvent = BeforeRenderEvent;
declare const events_BeforeRenderEvent: typeof BeforeRenderEvent;
type events_BeforeRotateEvent = BeforeRotateEvent;
declare const events_BeforeRotateEvent: typeof BeforeRotateEvent;
type events_ClickEvent = ClickEvent;
declare const events_ClickEvent: typeof ClickEvent;
type events_ConfigChangedEvent = ConfigChangedEvent;
declare const events_ConfigChangedEvent: typeof ConfigChangedEvent;
type events_DoubleClickEvent = DoubleClickEvent;
declare const events_DoubleClickEvent: typeof DoubleClickEvent;
type events_FullscreenEvent = FullscreenEvent;
declare const events_FullscreenEvent: typeof FullscreenEvent;
type events_HideNotificationEvent = HideNotificationEvent;
declare const events_HideNotificationEvent: typeof HideNotificationEvent;
type events_HideOverlayEvent = HideOverlayEvent;
declare const events_HideOverlayEvent: typeof HideOverlayEvent;
type events_HidePanelEvent = HidePanelEvent;
declare const events_HidePanelEvent: typeof HidePanelEvent;
type events_HideTooltipEvent = HideTooltipEvent;
declare const events_HideTooltipEvent: typeof HideTooltipEvent;
type events_KeypressEvent = KeypressEvent;
declare const events_KeypressEvent: typeof KeypressEvent;
type events_LoadProgressEvent = LoadProgressEvent;
declare const events_LoadProgressEvent: typeof LoadProgressEvent;
type events_ObjectEnterEvent = ObjectEnterEvent;
declare const events_ObjectEnterEvent: typeof ObjectEnterEvent;
type events_ObjectEvent = ObjectEvent;
declare const events_ObjectEvent: typeof ObjectEvent;
type events_ObjectHoverEvent = ObjectHoverEvent;
declare const events_ObjectHoverEvent: typeof ObjectHoverEvent;
type events_ObjectLeaveEvent = ObjectLeaveEvent;
declare const events_ObjectLeaveEvent: typeof ObjectLeaveEvent;
type events_PanoramaErrorEvent = PanoramaErrorEvent;
declare const events_PanoramaErrorEvent: typeof PanoramaErrorEvent;
type events_PanoramaLoadEvent = PanoramaLoadEvent;
declare const events_PanoramaLoadEvent: typeof PanoramaLoadEvent;
type events_PanoramaLoadedEvent = PanoramaLoadedEvent;
declare const events_PanoramaLoadedEvent: typeof PanoramaLoadedEvent;
type events_PositionUpdatedEvent = PositionUpdatedEvent;
declare const events_PositionUpdatedEvent: typeof PositionUpdatedEvent;
type events_ReadyEvent = ReadyEvent;
declare const events_ReadyEvent: typeof ReadyEvent;
type events_RenderEvent = RenderEvent;
declare const events_RenderEvent: typeof RenderEvent;
type events_RollUpdatedEvent = RollUpdatedEvent;
declare const events_RollUpdatedEvent: typeof RollUpdatedEvent;
type events_ShowNotificationEvent = ShowNotificationEvent;
declare const events_ShowNotificationEvent: typeof ShowNotificationEvent;
type events_ShowOverlayEvent = ShowOverlayEvent;
declare const events_ShowOverlayEvent: typeof ShowOverlayEvent;
type events_ShowPanelEvent = ShowPanelEvent;
declare const events_ShowPanelEvent: typeof ShowPanelEvent;
type events_ShowTooltipEvent = ShowTooltipEvent;
declare const events_ShowTooltipEvent: typeof ShowTooltipEvent;
type events_SizeUpdatedEvent = SizeUpdatedEvent;
declare const events_SizeUpdatedEvent: typeof SizeUpdatedEvent;
type events_StopAllEvent = StopAllEvent;
declare const events_StopAllEvent: typeof StopAllEvent;
type events_ViewerEvent = ViewerEvent;
declare const events_ViewerEvent: typeof ViewerEvent;
type events_ViewerEvents = ViewerEvents;
type events_ZoomUpdatedEvent = ZoomUpdatedEvent;
declare const events_ZoomUpdatedEvent: typeof ZoomUpdatedEvent;
declare namespace events {
  export { events_BeforeAnimateEvent as BeforeAnimateEvent, events_BeforeRenderEvent as BeforeRenderEvent, events_BeforeRotateEvent as BeforeRotateEvent, events_ClickEvent as ClickEvent, events_ConfigChangedEvent as ConfigChangedEvent, events_DoubleClickEvent as DoubleClickEvent, events_FullscreenEvent as FullscreenEvent, events_HideNotificationEvent as HideNotificationEvent, events_HideOverlayEvent as HideOverlayEvent, events_HidePanelEvent as HidePanelEvent, events_HideTooltipEvent as HideTooltipEvent, events_KeypressEvent as KeypressEvent, events_LoadProgressEvent as LoadProgressEvent, events_ObjectEnterEvent as ObjectEnterEvent, events_ObjectEvent as ObjectEvent, events_ObjectHoverEvent as ObjectHoverEvent, events_ObjectLeaveEvent as ObjectLeaveEvent, events_PanoramaErrorEvent as PanoramaErrorEvent, events_PanoramaLoadEvent as PanoramaLoadEvent, events_PanoramaLoadedEvent as PanoramaLoadedEvent, events_PositionUpdatedEvent as PositionUpdatedEvent, events_ReadyEvent as ReadyEvent, events_RenderEvent as RenderEvent, events_RollUpdatedEvent as RollUpdatedEvent, events_ShowNotificationEvent as ShowNotificationEvent, events_ShowOverlayEvent as ShowOverlayEvent, events_ShowPanelEvent as ShowPanelEvent, events_ShowTooltipEvent as ShowTooltipEvent, events_SizeUpdatedEvent as SizeUpdatedEvent, events_StopAllEvent as StopAllEvent, events_ViewerEvent as ViewerEvent, type events_ViewerEvents as ViewerEvents, events_ZoomUpdatedEvent as ZoomUpdatedEvent };
}

/**
 * Base class for plugins
 * @template TEvents union of dispatched events
 */
declare abstract class AbstractPlugin<TEvents extends TypedEvent<AbstractPlugin> = never> extends TypedEventTarget<TEvents> {
    protected viewer: Viewer;
    /**
     * Unique identifier of the plugin
     */
    static readonly id: string;
    /**
     * Expected version of the core
     * DO NOT USE on custom plugins
     */
    static readonly VERSION: string;
    constructor(viewer: Viewer);
    /**
     * Initializes the plugin
     */
    init(): void;
    /**
     * Destroys the plugin
     */
    destroy(): void;
}
/**
 * Base class for plugins with updatable configuration
 * The implementation must have a static `configParser` property which is the result of {@link utils.getConfigParser}
 *
 * @template TConfig type of input config
 * @template TParsedConfig type of config after parsing
 * @template TUpdatableConfig type of config that can be updated
 * @template TEvents union of dispatched events
 */
declare abstract class AbstractConfigurablePlugin<TConfig extends Record<string, any>, TParsedConfig extends TConfig = TConfig, TUpdatableConfig extends TConfig = TConfig, TEvents extends TypedEvent<AbstractPlugin> = never> extends AbstractPlugin<TEvents> {
    static configParser: ConfigParser<any, any>;
    static readonlyOptions: string[];
    readonly config: TParsedConfig;
    constructor(viewer: Viewer, config: TConfig);
    /**
     * Update options
     */
    setOption<T extends keyof TUpdatableConfig>(option: T, value: TUpdatableConfig[T]): void;
    /**
     * Update options
     */
    setOptions(options: Partial<TUpdatableConfig>): void;
}
type PluginConstructor = new (viewer: Viewer, config?: any) => AbstractPlugin<any>;

/**
 * Internal properties of the viewer
 */
declare class ViewerState {
    /**
     * when all components are loaded
     */
    ready: boolean;
    /**
     * if the view needs to be renderer
     */
    needsUpdate: boolean;
    /**
     * number of plugins requesting to continuously render the scene
     */
    continuousUpdateCount: number;
    /**
     * if the keyboard events are currently listened to
     */
    keyboardEnabled: boolean;
    /**
     * direction of the camera
     */
    direction: Vector3;
    /**
     * current camera roll
     */
    roll: number;
    /**
     * vertical FOV
     */
    vFov: number;
    /**
     * horizontal FOV
     */
    hFov: number;
    /**
     * renderer aspect ratio
     */
    aspect: number;
    /**
     * currently running animation
     */
    animation: Animation;
    /**
     * currently running transition
     */
    transitionAnimation: Animation;
    /**
     * promise of the last "setPanorama()" call
     */
    loadingPromise: Promise<any>;
    /**
     * special tweaks for LittlePlanetAdapter
     */
    littlePlanet: boolean;
    /**
     * time of the last user action
     */
    idleTime: number;
    /**
     * registered THREE objects observer
     */
    objectsObservers: Record<string, Mesh | null>;
    /**
     * size of the container
     */
    size: Size;
    /**
     * Current panorama texture displayed
     */
    textureData: TextureData;
    /**
     * Current override of the global cursor
     */
    cursorOverride: string;
}

/**
 * Base class for services
 */
declare abstract class AbstractService {
    protected readonly viewer: Viewer;
    protected readonly config: ParsedViewerConfig;
    protected readonly state: ViewerState;
}

/**
 * Collections of data converters for the viewer
 */
declare class DataHelper extends AbstractService {
    /**
     * Converts vertical FOV to zoom level
     */
    fovToZoomLevel(fov: number): number;
    /**
     * Converts zoom level to vertical FOV
     */
    zoomLevelToFov(level: number): number;
    /**
     * Converts vertical FOV to horizontal FOV
     */
    vFovToHFov(vFov: number): number;
    /**
     * Converts pixel texture coordinates to spherical radians coordinates
     * @throws {@link PSVError} when the current adapter does not support texture coordinates
     */
    textureCoordsToSphericalCoords(point: PanoramaPosition): Position;
    /**
     * Converts spherical radians coordinates to pixel texture coordinates
     * @throws {@link PSVError} when the current adapter does not support texture coordinates
     */
    sphericalCoordsToTextureCoords(position: Position): PanoramaPosition;
    /**
     * Converts spherical radians coordinates to a Vector3
     */
    sphericalCoordsToVector3(position: Position, vector?: Vector3, distance?: number): Vector3;
    /**
     * Converts a Vector3 to spherical radians coordinates
     */
    vector3ToSphericalCoords(vector: Vector3): Position;
    /**
     * Converts position on the viewer to a THREE.Vector3
     */
    viewerCoordsToVector3(viewerPoint: Point): Vector3;
    /**
     * Converts position on the viewer to spherical radians coordinates
     */
    viewerCoordsToSphericalCoords(viewerPoint: Point): Position;
    /**
     * Converts a Vector3 to position on the viewer
     */
    vector3ToViewerCoords(vector: Vector3): Point;
    /**
     * Converts spherical radians coordinates to position on the viewer
     */
    sphericalCoordsToViewerCoords(position: Position): Point;
    /**
     * Checks if a point in the 3D scene is currently visible
     */
    isPointVisible(vector: Vector3): boolean;
    /**
     * Checks if a point on the sphere is currently visible
     */
    isPointVisible(position: Position): boolean;
    /**
     * Converts pixel position to angles if present and ensure boundaries
     */
    cleanPosition(position: ExtendedPosition): Position;
    /**
     * Ensure a SphereCorrection object is valid
     */
    cleanSphereCorrection(sphereCorrection: SphereCorrection): SphereCorrection;
    /**
     * Parse the pose angles of the pano data
     */
    cleanPanoramaPose(panoData: PanoData): SphereCorrection;
}

type CustomRenderer = Pick<Renderer$1, 'render'> & {
    getIntersections?(raycaster: Raycaster, vector: Vector2): Array<Intersection<Mesh>>;
};
/**
 * Controller for the three.js scene
 */
declare class Renderer extends AbstractService {
    private readonly renderer;
    private readonly scene;
    private readonly mesh;
    private readonly meshContainer;
    private readonly raycaster;
    private readonly frustum;
    private readonly container;
    private timestamp?;
    private frustumNeedsUpdate;
    private customRenderer?;
    get panoramaPose(): Euler;
    get sphereCorrection(): Euler;
    /**
     * Hides the viewer
     */
    hide(): void;
    /**
     * Shows the viewer
     */
    show(): void;
    /**
     * Resets or replaces the THREE renderer by a custom one
     */
    setCustomRenderer(factory: (renderer: WebGLRenderer) => CustomRenderer): void;
    /**
     * Updates the size of the renderer and the aspect of the camera
     */
    private __onSizeUpdated;
    /**
     * Updates the fov of the camera
     */
    private __onZoomUpdated;
    /**
     * Updates the position of the camera
     */
    private __onPositionUpdated;
    /**
     * Main event loop, performs a render if `state.needsUpdate` is true
     */
    private __renderLoop;
    /**
     * Returns intersections with objects in the scene
     */
    getIntersections(viewerPoint: Point): Array<Intersection<Mesh>>;
    /**
     * Checks if an object/point is currently visible
     */
    isObjectVisible(value: Object3D | Vector3): boolean;
    /**
     * Adds an object to the THREE scene
     */
    addObject(object: Object3D): void;
    /**
     * Removes an object from the THREE scene
     */
    removeObject(object: Object3D): void;
}

/**
 * Image and texture loading system
 */
declare class TextureLoader extends AbstractService {
    private readonly fileLoader;
    private readonly imageLoader;
    private abortCtrl;
    /**
     * Loads a Blob with FileLoader
     */
    loadFile(url: string, onProgress?: (p: number) => void, cacheKey?: string): Promise<Blob>;
    /**
     * Loads an image with ImageLoader or with FileLoader if progress is tracked or if request headers are configured
     */
    loadImage(url: string, onProgress?: (p: number) => void, cacheKey?: string): Promise<HTMLImageElement>;
    /**
     * Converts a file loaded with {@link loadFile} into an image
     */
    blobToImage(blob: Blob): Promise<HTMLImageElement>;
    /**
     * Preload a panorama file without displaying it
     */
    preloadPanorama(panorama: any): Promise<unknown>;
    /**
     * Get an abort signal
     * the signal is shared accross all requests with the same cache key (for tiles adapters)
     */
    private __getAbortSignal;
}

/**
 * Photo Sphere Viewer controller
 */
declare class Viewer extends TypedEventTarget<ViewerEvents> {
    readonly state: ViewerState;
    readonly config: ParsedViewerConfig;
    readonly parent: HTMLElement;
    readonly container: HTMLElement;
    readonly renderer: Renderer;
    readonly textureLoader: TextureLoader;
    readonly dataHelper: DataHelper;
    readonly loader: Loader;
    readonly navbar: Navbar;
    readonly notification: Notification;
    readonly overlay: Overlay;
    readonly panel: Panel;
    private readonly onResize;
    constructor(config: ViewerConfig);
    /**
     * Destroys the viewer
     */
    destroy(): void;
    private init;
    /**
     * Returns the instance of a plugin if it exists
     * @example By plugin identifier
     * ```js
     * viewer.getPlugin('markers')
     * ```
     * @example By plugin class with TypeScript support
     * ```ts
     * viewer.getPlugin<MarkersPlugin>(MarkersPlugin)
     * ```
     */
    getPlugin<T extends AbstractPlugin<any>>(pluginId: string | PluginConstructor): T;
    /**
     * Returns the current position of the camera
     */
    getPosition(): Position;
    /**
     * Returns the current zoom level
     */
    getZoomLevel(): number;
    /**
     * Returns the current viewer size
     */
    getSize(): Size;
    /**
     * Checks if the viewer is in fullscreen
     */
    isFullscreenEnabled(): boolean;
    /**
     * Request a new render of the scene
     */
    needsUpdate(): void;
    /**
     * Request the scene to be continuously renderer (when using videos)
     */
    needsContinuousUpdate(enabled: boolean): void;
    /**
     * Resizes the scene if the viewer is resized
     */
    autoSize(): void;
    /**
     * Loads a new panorama file
     * @description Loads a new panorama file, optionally changing the camera position/zoom and activating the transition animation.<br>
     * If the "options" parameter is not defined, the camera will not move and the ongoing animation will continue.<br>
     * If another loading is already in progress it will be aborted.
     * @returns promise resolved with false if the loading was aborted by another call
     */
    setPanorama(path: any, options?: PanoramaOptions): Promise<boolean>;
    /**
     * Update options
     * @throws {@link PSVError} if the configuration is invalid
     */
    setOptions(options: Partial<UpdatableViewerConfig>): void;
    /**
     * Update options
     * @throws {@link PSVError} if the configuration is invalid
     */
    setOption<T extends keyof UpdatableViewerConfig>(option: T, value: UpdatableViewerConfig[T]): void;
    /**
     * Displays an error message over the viewer
     */
    showError(message: string): void;
    /**
     *  Hides the error message
     */
    hideError(): void;
    /**
     * Rotates the view to specific position
     */
    rotate(position: ExtendedPosition): void;
    /**
     * Zooms to a specific level between `maxFov` and `minFov`
     */
    zoom(level: number): void;
    /**
     * Increases the zoom level
     */
    zoomIn(step?: number): void;
    /**
     * Decreases the zoom level
     */
    zoomOut(step?: number): void;
    /**
     * Rotates and zooms the view with a smooth animation
     */
    animate(options: AnimateOptions): Animation;
    /**
     * Stops the ongoing animation
     * @description The return value is a Promise because the is no guaranty the animation can be stopped synchronously.
     */
    stopAnimation(): PromiseLike<any>;
    /**
     * Resizes the viewer
     */
    resize(size: CssSize): void;
    private __setSize;
    /**
     * Enters the fullscreen mode
     */
    enterFullscreen(): void;
    /**
     * Exits the fullscreen mode
     */
    exitFullscreen(): void;
    /**
     * Enters or exits the fullscreen mode
     */
    toggleFullscreen(): void;
    /**
     * Enables the keyboard controls
     */
    startKeyboardControl(): void;
    /**
     * Disables the keyboard controls
     */
    stopKeyboardControl(): void;
    /**
     * Creates a new tooltip
     * @description Use {@link Tooltip.move} to update the tooltip without re-create
     * @throws {@link PSVError} if the configuration is invalid
     */
    createTooltip(config: TooltipConfig): Tooltip;
    /**
     * Changes the global mouse cursor
     */
    setCursor(cursor: string): void;
    /**
     * Subscribes to events on objects in the three.js scene
     * @param userDataKey - only objects with the following `userData` will be observed
     */
    observeObjects(userDataKey: string): void;
    /**
     * Unsubscribes to events on objects
     */
    unobserveObjects(userDataKey: string): void;
}

/**
 * Base class for adapters
 * @template TPanorama type of the panorama object
 * @template TTexture type of the loaded texture
 * @template TData type of the panorama metadata
 */
declare abstract class AbstractAdapter<TPanorama, TTexture, TData> {
    protected readonly viewer: Viewer;
    /**
     * Unique identifier of the adapter
     */
    static readonly id: string;
    /**
     * Expected version of the core
     * DO NOT USE on custom adapters
     */
    static readonly VERSION: string;
    /**
     * Indicates if the adapter supports panorama download natively
     */
    static readonly supportsDownload: boolean;
    constructor(viewer: Viewer);
    /**
     * Initializes the adapter
     */
    init(): void;
    /**
     * Destroys the adapter
     */
    destroy(): void;
    /**
     * Indicates if the adapter supports transitions between panoramas
     */
    supportsTransition(panorama: TPanorama): boolean;
    /**
     * Indicates if the adapter supports preload of a panorama
     */
    supportsPreload(panorama: TPanorama): boolean;
    /**
     * Converts pixel texture coordinates to spherical radians coordinates
     * @throws {@link PSVError} when the current adapter does not support texture coordinates
     */
    textureCoordsToSphericalCoords(point: PanoramaPosition, data: TData): Position;
    /**
     * Converts spherical radians coordinates to pixel texture coordinates
     * @throws {@link PSVError} when the current adapter does not support texture coordinates
     */
    sphericalCoordsToTextureCoords(position: Position, data: TData): PanoramaPosition;
    /**
     * Loads the panorama texture
     */
    abstract loadTexture(panorama: TPanorama, loader?: boolean, newPanoData?: PanoData | PanoDataProvider, useXmpPanoData?: boolean): Promise<TextureData<TTexture, TPanorama, TData>>;
    /**
     * Creates the mesh
     */
    abstract createMesh(scale?: number): Mesh;
    /**
     * Applies the texture to the mesh
     */
    abstract setTexture(mesh: Mesh, textureData: TextureData<TTexture, TPanorama, TData>, transition?: boolean): void;
    /**
     * Changes the opacity of the mesh
     */
    abstract setTextureOpacity(mesh: Mesh, opacity: number): void;
    /**
     * Clear a loaded texture from memory
     */
    abstract disposeTexture(textureData: TextureData<TTexture, TPanorama, TData>): void;
}
type AdapterConstructor = (new (viewer: Viewer, config?: any) => AbstractAdapter<any, any, any>);

/**
 * A wrapper around a Promise with an initial value before resolution
 */
type ResolvableBoolean = {
    initial: boolean;
    promise: Promise<boolean>;
};
/**
 * Object defining a point
 */
type Point = {
    x: number;
    y: number;
};
/**
 * Object defining a size
 */
type Size = {
    width: number;
    height: number;
};
/**
 * Object defining a size in CSS
 */
type CssSize = {
    width: string;
    height: string;
};
/**
 * Object defining angular corrections to a sphere
 */
type SphereCorrection = {
    pan?: number;
    tilt?: number;
    roll?: number;
};
/**
 * Object defining a spherical position (radians)
 */
type Position = {
    yaw: number;
    pitch: number;
};
/**
 * Object defining a spherical position (radians or degrees)
 */
type SphericalPosition = {
    yaw: number | string;
    pitch: number | string;
};
/**
 * Object defining a position on the panorama image (pixels)
 */
type PanoramaPosition = {
    textureX: number;
    textureY: number;
    textureFace?: string;
};
/**
 * Object defining a spherical or panorama position
 */
type ExtendedPosition = SphericalPosition | PanoramaPosition;
/**
 * Object defining options for {@link Viewer.animate}
 */
type AnimateOptions = Partial<ExtendedPosition> & {
    /**
     * Animation speed or duration in milliseconds
     */
    speed: string | number;
    /**
     * New zoom level between 0 and 100
     */
    zoom?: number;
    /**
     * Easing function used for the animation
     * @default 'inOutSine'
     */
    easing?: AnimationOptions<any>['easing'];
};
/**
 * Crop information of an equirectangular panorama
 */
type PanoData = {
    isEquirectangular: true;
    fullWidth: number;
    fullHeight: number;
    croppedWidth: number;
    croppedHeight: number;
    croppedX: number;
    croppedY: number;
    poseHeading?: number;
    posePitch?: number;
    poseRoll?: number;
};
/**
 * Function to compute panorama data once the image is loaded
 */
type PanoDataProvider = (image: HTMLImageElement, xmpData?: PanoData) => PanoData;
/**
 * Object defining options for {@link Viewer.setPanorama}
 */
type PanoramaOptions = {
    /**
     * new panorama position
     */
    position?: ExtendedPosition;
    /**
     * new navbar caption
     */
    caption?: string;
    /**
     * new panorama description
     */
    description?: string;
    /**
     * new zoom level between 0 and 100
     */
    zoom?: number;
    /**
     * enable transition (rotation + fading) between old and new panorama
     * @default true
     */
    transition?: boolean | 'fade-only';
    /**
     * speed or duration of the transition between old and new panorama
     * @default 1500
     */
    speed?: string | number;
    /**
     * show the loader while loading the new panorama
     * @default true
     */
    showLoader?: boolean;
    /**
     * new sphere correction to apply to the panorama
     */
    sphereCorrection?: SphereCorrection;
    /**
     * new data used for this panorama
     */
    panoData?: PanoData | PanoDataProvider;
};
/**
 * Result of {@link AbstractAdapter.loadTexture}
 */
type TextureData<TTexture = Texture | Texture[] | Record<string, Texture>, TPanorama = any, TData = any> = {
    /**
     * Actual texture or list of textures
     */
    texture: TTexture;
    /**
     * Original panorama definition
     */
    panorama: TPanorama;
    /**
     * Panorama metadata
     */
    panoData?: TData;
    /**
     * Key used in the loader cache
     */
    cacheKey?: string;
};
/**
 * Data of {@link events.ClickEvent}
 */
type ClickData = {
    /**
     * if it's a right click
     */
    rightclick: boolean;
    /**
     * position in the browser window
     */
    clientX: number;
    /**
     * position in the browser window
     */
    clientY: number;
    /**
     * position in the viewer
     */
    viewerX: number;
    /**
     * position in the viewer
     */
    viewerY: number;
    /**
     * position in spherical coordinates
     */
    yaw: number;
    /**
     * position in spherical coordinates
     */
    pitch: number;
    /**
     * position on the texture, if applicable
     */
    textureX?: number;
    /**
     * position on the texture, if applicable
     */
    textureY?: number;
    /**
     * position on the texture, if applicable
     */
    textureFace?: string;
    /**
     * Original element which received the click
     */
    target: HTMLElement;
    /**
     * List of THREE scenes objects under the mouse
     */
    objects: Object3D[];
    /**
     * clicked Marker
     */
    marker?: any;
};
/**
 * Custom Web Component interface for navbar buttons
 */
interface NavbarButtonElement extends HTMLElement {
    attachViewer?(viewer: Viewer): void;
}
/**
 * Definition of a custom navbar button
 */
type NavbarCustomButton = {
    /**
     * Unique identifier of the button, usefull when using the {@link Navbar.getButton} method
     */
    id?: string;
    /**
     * Tooltip displayed when the mouse is over the button
     */
    title?: string;
    /**
     * Content of the button. Preferably a square image or SVG icon
     */
    content: string | NavbarButtonElement;
    /**
     * CSS class added to the button
     */
    className?: string;
    /**
     * Function called when the button is clicked
     */
    onClick?: (viewer: Viewer) => void;
    /**
     * initial state of the button
     * @default false
     */
    disabled?: boolean;
    /**
     * initial visibility of the button
     * @default true
     */
    visible?: boolean;
    /**
     * if the button can be moved to menu when the navbar is too small
     * @default true
     */
    collapsable?: boolean;
    /**
     * if the button is accessible with the keyboard
     * @default true
     */
    tabbable?: boolean;
};
/**
 * Viewer configuration
 * @link https://photo-sphere-viewer.js.org/guide/config.html
 */
type ViewerConfig = {
    container: HTMLElement | string;
    panorama?: any;
    /** @default equirectangular */
    adapter?: AdapterConstructor | [AdapterConstructor, any];
    plugins?: Array<PluginConstructor | [PluginConstructor, any]>;
    /** @default null */
    caption?: string;
    /** @default null */
    description?: string;
    /** @default null */
    downloadUrl?: string;
    /** @default null */
    downloadName?: string;
    /** @default null */
    loadingImg?: string;
    /** @default 'Loading...' */
    loadingTxt?: string;
    /** @default `container` size */
    size?: CssSize;
    /** @default false */
    fisheye?: boolean | number;
    /** @default 30 */
    minFov?: number;
    /** @default 90 */
    maxFov?: number;
    /** @default 50 */
    defaultZoomLvl?: number;
    /** @default 0 */
    defaultYaw?: number | string;
    /** @default 0 */
    defaultPitch?: number | string;
    /** @default `0,0,0` */
    sphereCorrection?: SphereCorrection;
    /** @default 1 */
    moveSpeed?: number;
    /** @default 1 */
    zoomSpeed?: number;
    /** @default true */
    moveInertia?: boolean;
    /** @default true */
    mousewheel?: boolean;
    /** @default true */
    mousemove?: boolean;
    /** @default false */
    mousewheelCtrlKey?: boolean;
    /** @default false */
    touchmoveTwoFingers?: boolean;
    panoData?: PanoData | PanoDataProvider;
    requestHeaders?: Record<string, string> | ((url: string) => Record<string, string>);
    /** @default '{ alpha: true, antialias: true }' */
    rendererParameters?: WebGLRendererParameters;
    /** @default false */
    withCredentials?: boolean;
    /** @default 'zoom move download description caption fullscreen' */
    navbar?: boolean | string | Array<string | NavbarCustomButton>;
    lang?: Record<string, string>;
    keyboard?: boolean | 'always' | 'fullscreen' | Record<string, ACTIONS | ((viewer: Viewer) => void)>;
    keyboardActions?: Record<string, ACTIONS | ((viewer: Viewer) => void)>;
};
/**
 * Viewer configuration after applying parsers
 */
type ParsedViewerConfig = Omit<ViewerConfig, 'adapter' | 'plugins' | 'defaultYaw' | 'defaultPitch' | 'fisheye' | 'requestHeaders' | 'navbar' | 'keyboard'> & {
    adapter?: [AdapterConstructor, any];
    plugins?: Array<[PluginConstructor, any]>;
    defaultYaw?: number;
    defaultPitch?: number;
    fisheye?: number;
    requestHeaders?: (url: string) => Record<string, string>;
    navbar?: Array<string | NavbarCustomButton>;
    keyboard?: false | 'always' | 'fullscreen';
};
/**
 * Readonly viewer configuration
 */
type ReadonlyViewerConfig = 'panorama' | 'panoData' | 'container' | 'adapter' | 'plugins';
/**
 * Updatable viewer configuration
 */
type UpdatableViewerConfig = Omit<ViewerConfig, ReadonlyViewerConfig>;

/**
 * Get an element in the page by an unknown selector
 */
declare function getElement(selector: string | HTMLElement): HTMLElement;
/**
 * Toggles a CSS class
 */
declare function toggleClass(element: Element, className: string, active?: boolean): void;
/**
 * Adds one or several CSS classes to an element
 */
declare function addClasses(element: Element, className: string): void;
/**
 * Removes one or several CSS classes to an element
 */
declare function removeClasses(element: Element, className: string): void;
/**
 * Searches if an element has a particular parent at any level including itself
 */
declare function hasParent(el: HTMLElement, parent: Element): boolean;
/**
 * Gets the closest parent (can by itself)
 */
declare function getClosest(el: HTMLElement, selector: string): HTMLElement | null;
/**
 * Gets the position of an element in the viewer without reflow
 * @description Will gives the same result as getBoundingClientRect() as soon as there are no CSS transforms
 */
declare function getPosition(el: HTMLElement): Point;
/**
 * Gets an element style value
 */
declare function getStyleProperty(elt: Element, varname: string): string;
type TouchData = {
    distance: number;
    angle: number;
    center: Point;
};
/**
 * Returns data about a touch event (first 2 fingers) : distance, angle, center
 */
declare function getTouchData(e: TouchEvent): TouchData;
/**
 * Detects if fullscreen is enabled
 */
declare function isFullscreenEnabled(elt: HTMLElement): boolean;
/**
 * Enters fullscreen mode
 */
declare function requestFullscreen(elt: HTMLElement): void;
/**
 * Exits fullscreen mode
 */
declare function exitFullscreen(): void;

/**
 * Ensures a value is within 0 and `max` by wrapping max to 0
 */
declare function wrap(value: number, max: number): number;
/**
 * Computes the sum of an array
 */
declare function sum(array: number[]): number;
/**
 * Computes the distance between two points
 */
declare function distance(p1: Point, p2: Point): number;
/**
 * Computes the angle wet ween two points
 */
declare function angle(p1: Point, p2: Point): number;
/**
 * Compute the shortest offset between two angles on a sphere
 */
declare function getShortestArc(from: number, to: number): number;
/**
 * Computes the angle between the current position and a target position
 */
declare function getAngle(position1: Position, position2: Position): number;
/**
 * Returns the distance between two points on a sphere of radius one
 * @link http://www.movable-type.co.uk/scripts/latlong.html
 */
declare function greatArcDistance([yaw1, pitch1]: [number, number], [yaw2, pitch2]: [number, number]): number;

/**
 * Transforms a string to dash-case
 * @link https://github.com/shahata/dasherize
 */
declare function dasherize(str: string): string;
/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
 */
declare function throttle<T extends (...args: any) => any>(callback: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Test if an object is a plain object
 * @description Test if an object is a plain object, i.e. is constructed
 * by the built-in Object constructor and inherits directly from Object.prototype
 * or null.
 * @link https://github.com/lodash/lodash/blob/master/isPlainObject.js
 */
declare function isPlainObject<T extends Record<string, any>>(value: any): value is T;
/**
 * Merges the enumerable attributes of two objects
 * @description Replaces arrays and alters the target object.
 * @copyright Nicholas Fisher <nfisher110@gmail.com>
 */
declare function deepmerge<T>(target: T, src: T): T;
/**
 * Deeply clones an object
 */
declare function clone<T>(src: T): T;
/**
 * Tests of an object is empty
 */
declare function isEmpty(obj: any): boolean;
/**
 * Returns if a valu is null or undefined
 */
declare function isNil(val: any): val is null | undefined;
/**
 * Returns the first non null non undefined parameter
 */
declare function firstNonNull<T>(...values: T[]): T | null;
/**
 * Returns deep equality between objects
 * @link https://gist.github.com/egardner/efd34f270cc33db67c0246e837689cb9
 */
declare function deepEqual(obj1: any, obj2: any): boolean;

/**
 * Executes a callback with the value of a ResolvableBoolean
 */
declare function resolveBoolean(value: boolean | ResolvableBoolean, cb: (val: boolean, init: boolean) => void): void;
/**
 * Inverts the result of a ResolvableBoolean
 */
declare function invertResolvableBoolean(value: ResolvableBoolean): ResolvableBoolean;
/**
 * Builds an Error with name 'AbortError'
 */
declare function getAbortError(): Error;
/**
 * Tests if an Error has name 'AbortError'
 */
declare function isAbortError(err: Error): boolean;
/**
 * Displays a warning in the console with "PhotoSphereViewer" prefix
 */
declare function logWarn(message: string): void;
/**
 * Checks if an object is a ExtendedPosition, ie has textureX/textureY or yaw/pitch
 */
declare function isExtendedPosition(object: any): object is ExtendedPosition;
/**
 * Returns the value of a given attribute in the panorama metadata
 */
declare function getXMPValue(data: string, attr: string): number | null;
/**
 * Translate CSS values like "top center" or "10% 50%" as top and left positions (0-1 range)
 * @description The implementation is as close as possible to the "background-position" specification
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/background-position}
 */
declare function parsePoint(value: string | Point): Point;
/**
 * Parse a CSS-like position into an array of position keywords among top, bottom, left, right and center
 * @param value
 * @param [options]
 * @param [options.allowCenter=true] allow "center center"
 * @param [options.cssOrder=true] force CSS order (y axis then x axis)
 */
declare function cleanCssPosition(value: string | string[], { allowCenter, cssOrder }?: {
    allowCenter: boolean;
    cssOrder: boolean;
}): [string, string] | null;
/**
 * Checks if an array of two positions is ordered (y axis then x axis)
 */
declare function cssPositionIsOrdered(value: string[]): boolean;
/**
 * @summary Parses an speed
 * @param speed in radians/degrees/revolutions per second/minute
 * @throws {@link PSVError} when the speed cannot be parsed
 */
declare function parseSpeed(speed: string | number): number;
/**
 * Converts a speed into a duration for a specific angle to travel
 */
declare function speedToDuration(value: string | number, angle: number): number;
/**
 * Parses an angle value in radians or degrees and returns a normalized value in radians
 * @param angle - eg: 3.14, 3.14rad, 180deg
 * @param [zeroCenter=false] - normalize between -Pi - Pi instead of 0 - 2*Pi
 * @param [halfCircle=zeroCenter] - normalize between -Pi/2 - Pi/2 instead of -Pi - Pi
 * @throws {@link PSVError} when the angle cannot be parsed
 */
declare function parseAngle(angle: string | number, zeroCenter?: boolean, halfCircle?: boolean): number;
/**
 * Creates a THREE texture from an image
 */
declare function createTexture(img: HTMLImageElement | HTMLCanvasElement, mimaps?: boolean): Texture;
/**
 * Applies the inverse of Euler angles to a vector
 */
declare function applyEulerInverse(vector: Vector3, euler: Euler): void;
/**
 * Declaration of configuration parsers, used by {@link getConfigParser}
 */
type ConfigParsers<T, U extends T = T> = {
    [key in keyof T]: (val: T[key], opts: {
        defValue: U[key];
        rawConfig: T;
    }) => U[key];
};
/**
 * Result of {@link getConfigParser}
 */
type ConfigParser<T, U extends T> = {
    (config: T): U;
    defaults: Required<U>;
    parsers: ConfigParsers<T, U>;
};
/**
 * Creates a function to validate an user configuration object
 *
 * @template T type of input config
 * @template U type of config after parsing
 *
 * @param defaults the default configuration
 * @param parsers function used to parse/validate the configuration
 *
 * @example
 * ```ts
 * type MyConfig = {
 *      value: number;
 *      label?: string;
 * };
 *
 * const getConfig<MyConfig>({
 *      value: 1,
 *      label: 'Title',
 * }, {
 *      value(value, { defValue }) {
 *          return value < 10 ? value : defValue;
 *      }
 * });
 *
 * const config = getConfig({ value: 3 });
 * ```
 */
declare function getConfigParser<T extends Record<string, any>, U extends T = T>(defaults: Required<U>, parsers?: ConfigParsers<T, U>): ConfigParser<T, U>;
/**
 * Checks if a stylesheet is loaded by the presence of a CSS variable
 */
declare function checkStylesheet(element: HTMLElement, name: string): void;
/**
 * Checks that a dependency version is the same as the core
 */
declare function checkVersion(name: string, version: string, coreVersion: string): void;

/**
 * Options for {@link Animation}
 */
type AnimationOptions<T> = {
    /**
     * interpolated properties
     */
    properties: Partial<Record<keyof T, {
        start: number;
        end: number;
    }>>;
    /**
     * duration of the animation
     */
    duration: number;
    /**
     * delay before start
     * @default 0
     */
    delay?: number;
    /**
     * interpoaltion function, see {@link CONSTANTS.EASINGS}
     * @default 'linear'
     */
    easing?: string | ((t: number) => number);
    /**
     * function called for each frame
     */
    onTick: (properties: Record<keyof T, number>, progress: number) => void;
};
/**
 * @summary Interpolation helper for animations
 * @description
 * Implements the Promise API with an additional "cancel" method.
 * The promise is resolved with `true` when the animation is completed and `false` if the animation is cancelled.
 * @template T the type of interpoalted properties
 *
 * @example
 * ```ts
 * const anim = new Animation({
 *     properties: {
 *         width: {start: 100, end: 200}
 *     },
 *     duration: 5000,
 *     onTick: (properties) => element.style.width = `${properties.width}px`;
 * });
 *
 * anim.then((completed) => ...);
 *
 * anim.cancel();
 * ```
 */
declare class Animation<T = any> implements PromiseLike<boolean> {
    private options;
    private easing;
    private callbacks;
    private start?;
    private delayTimeout;
    private animationFrame;
    resolved: boolean;
    cancelled: boolean;
    constructor(options: AnimationOptions<T>);
    private __run;
    private __resolve;
    /**
     * Promise chaining
     * @param [onFulfilled] - Called when the animation is complete (true) or cancelled (false)
     */
    then<U>(onFulfilled: (complete: boolean) => PromiseLike<U> | U): Promise<U>;
    /**
     * Cancels the animation
     */
    cancel(): void;
}

/**
 * Represents a variable that can dynamically change with time (using requestAnimationFrame)
 */
declare class Dynamic {
    private readonly fn;
    private readonly min;
    private readonly max;
    private readonly wrap;
    private mode;
    private speed;
    private speedMult;
    private currentSpeed;
    private target;
    private __current;
    get current(): number;
    private set current(value);
    constructor(fn: (val: number) => void, config: {
        min: number;
        max: number;
        defaultValue: number;
        wrap: boolean;
    });
    /**
     * Changes base speed
     */
    setSpeed(speed: number): void;
    /**
     * Defines the target position
     */
    goto(position: number, speedMult?: number): void;
    /**
     * Increases/decreases the target position
     */
    step(step: number, speedMult?: number): void;
    /**
     * Starts infinite movement
     */
    roll(invert?: boolean, speedMult?: number): void;
    /**
     * Stops movement
     */
    stop(): void;
    /**
     * Defines the current position and immediately stops movement
     * @param {number} value
     */
    setValue(value: number): boolean;
}

/**
 * Wrapper for multiple {@link Dynamic} evolving together
 */
declare class MultiDynamic<T extends Record<string, Dynamic>> {
    private readonly fn;
    private readonly dynamics;
    get current(): Record<keyof T, number>;
    constructor(fn: (val: Record<keyof T, number>) => void, dynamics: T);
    /**
     * Changes base speed
     */
    setSpeed(speed: number): void;
    /**
     * Defines the target positions
     */
    goto(positions: Partial<Record<keyof T, number>>, speedMult?: number): void;
    /**
     * Increase/decrease the target positions
     */
    step(steps: Partial<Record<keyof T, number>>, speedMult?: number): void;
    /**
     * Starts infinite movements
     */
    roll(rolls: Partial<Record<keyof T, boolean>>, speedMult?: number): void;
    /**
     * Stops movements
     */
    stop(): void;
    /**
     * Defines the current positions and immediately stops movements
     */
    setValue(values: Partial<Record<keyof T, number>>): boolean;
}

/**
 * Direction of a {@link Slider}
 */
declare enum SliderDirection {
    VERTICAL = "VERTICAL",
    HORIZONTAL = "HORIZONTAL"
}
/**
 * Data transmitted to the {@link Slider} listener
 */
type SliderUpdateData = {
    /**
     * slider progression for 0-1
     */
    readonly value: number;
    /**
     * the user clicked on the slider
     */
    readonly click: boolean;
    /**
     * the user moves the cursor above the slider, without click
     */
    readonly mouseover: boolean;
    /**
     * the user moves the cursor above the slider while maintaining click
     */
    readonly mousedown: boolean;
    /**
     * the cursor position on the page
     */
    readonly cursor: {
        clientX: number;
        clientY: number;
    };
};
/**
 * Helper to make sliders elements
 */
declare class Slider {
    /** main container of the sliding element */
    private readonly container;
    /** direction of the slider */
    private readonly direction;
    /** callback when the user interacts with the slider */
    private readonly listener;
    private mousedown;
    private mouseover;
    get isVertical(): boolean;
    get isHorizontal(): boolean;
    constructor(
    /** main container of the sliding element */
    container: HTMLElement, 
    /** direction of the slider */
    direction: SliderDirection, 
    /** callback when the user interacts with the slider */
    listener: (data: SliderUpdateData) => void);
    destroy(): void;
    private __onMouseDown;
    private __onMouseEnter;
    private __onTouchStart;
    private __onMouseMove;
    private __onTouchMove;
    private __onMouseUp;
    private __onMouseLeave;
    private __onTouchEnd;
    private __update;
}

type index_Animation<T = any> = Animation<T>;
declare const index_Animation: typeof Animation;
type index_AnimationOptions<T> = AnimationOptions<T>;
type index_ConfigParser<T, U extends T> = ConfigParser<T, U>;
type index_ConfigParsers<T, U extends T = T> = ConfigParsers<T, U>;
type index_Dynamic = Dynamic;
declare const index_Dynamic: typeof Dynamic;
type index_MultiDynamic<T extends Record<string, Dynamic>> = MultiDynamic<T>;
declare const index_MultiDynamic: typeof MultiDynamic;
type index_Slider = Slider;
declare const index_Slider: typeof Slider;
type index_SliderDirection = SliderDirection;
declare const index_SliderDirection: typeof SliderDirection;
type index_SliderUpdateData = SliderUpdateData;
type index_TouchData = TouchData;
declare const index_addClasses: typeof addClasses;
declare const index_angle: typeof angle;
declare const index_applyEulerInverse: typeof applyEulerInverse;
declare const index_checkStylesheet: typeof checkStylesheet;
declare const index_checkVersion: typeof checkVersion;
declare const index_cleanCssPosition: typeof cleanCssPosition;
declare const index_clone: typeof clone;
declare const index_createTexture: typeof createTexture;
declare const index_cssPositionIsOrdered: typeof cssPositionIsOrdered;
declare const index_dasherize: typeof dasherize;
declare const index_deepEqual: typeof deepEqual;
declare const index_deepmerge: typeof deepmerge;
declare const index_distance: typeof distance;
declare const index_exitFullscreen: typeof exitFullscreen;
declare const index_firstNonNull: typeof firstNonNull;
declare const index_getAbortError: typeof getAbortError;
declare const index_getAngle: typeof getAngle;
declare const index_getClosest: typeof getClosest;
declare const index_getConfigParser: typeof getConfigParser;
declare const index_getElement: typeof getElement;
declare const index_getPosition: typeof getPosition;
declare const index_getShortestArc: typeof getShortestArc;
declare const index_getStyleProperty: typeof getStyleProperty;
declare const index_getTouchData: typeof getTouchData;
declare const index_getXMPValue: typeof getXMPValue;
declare const index_greatArcDistance: typeof greatArcDistance;
declare const index_hasParent: typeof hasParent;
declare const index_invertResolvableBoolean: typeof invertResolvableBoolean;
declare const index_isAbortError: typeof isAbortError;
declare const index_isEmpty: typeof isEmpty;
declare const index_isExtendedPosition: typeof isExtendedPosition;
declare const index_isFullscreenEnabled: typeof isFullscreenEnabled;
declare const index_isNil: typeof isNil;
declare const index_isPlainObject: typeof isPlainObject;
declare const index_logWarn: typeof logWarn;
declare const index_parseAngle: typeof parseAngle;
declare const index_parsePoint: typeof parsePoint;
declare const index_parseSpeed: typeof parseSpeed;
declare const index_removeClasses: typeof removeClasses;
declare const index_requestFullscreen: typeof requestFullscreen;
declare const index_resolveBoolean: typeof resolveBoolean;
declare const index_speedToDuration: typeof speedToDuration;
declare const index_sum: typeof sum;
declare const index_throttle: typeof throttle;
declare const index_toggleClass: typeof toggleClass;
declare const index_wrap: typeof wrap;
declare namespace index {
  export { index_Animation as Animation, type index_AnimationOptions as AnimationOptions, type index_ConfigParser as ConfigParser, type index_ConfigParsers as ConfigParsers, index_Dynamic as Dynamic, index_MultiDynamic as MultiDynamic, index_Slider as Slider, index_SliderDirection as SliderDirection, type index_SliderUpdateData as SliderUpdateData, type index_TouchData as TouchData, index_addClasses as addClasses, index_angle as angle, index_applyEulerInverse as applyEulerInverse, index_checkStylesheet as checkStylesheet, index_checkVersion as checkVersion, index_cleanCssPosition as cleanCssPosition, index_clone as clone, index_createTexture as createTexture, index_cssPositionIsOrdered as cssPositionIsOrdered, index_dasherize as dasherize, index_deepEqual as deepEqual, index_deepmerge as deepmerge, index_distance as distance, index_exitFullscreen as exitFullscreen, index_firstNonNull as firstNonNull, index_getAbortError as getAbortError, index_getAngle as getAngle, index_getClosest as getClosest, index_getConfigParser as getConfigParser, index_getElement as getElement, index_getPosition as getPosition, index_getShortestArc as getShortestArc, index_getStyleProperty as getStyleProperty, index_getTouchData as getTouchData, index_getXMPValue as getXMPValue, index_greatArcDistance as greatArcDistance, index_hasParent as hasParent, index_invertResolvableBoolean as invertResolvableBoolean, index_isAbortError as isAbortError, index_isEmpty as isEmpty, index_isExtendedPosition as isExtendedPosition, index_isFullscreenEnabled as isFullscreenEnabled, index_isNil as isNil, index_isPlainObject as isPlainObject, index_logWarn as logWarn, index_parseAngle as parseAngle, index_parsePoint as parsePoint, index_parseSpeed as parseSpeed, index_removeClasses as removeClasses, index_requestFullscreen as requestFullscreen, index_resolveBoolean as resolveBoolean, index_speedToDuration as speedToDuration, index_sum as sum, index_throttle as throttle, index_toggleClass as toggleClass, index_wrap as wrap };
}

/**
 * Configuration for {@link EquirectangularAdapter}
 */
type EquirectangularAdapterConfig = {
    /**
     * Background color of the canvas, which will be visible when using cropped panoramas
     * @default '#000'
     */
    backgroundColor?: string;
    /**
     * Interpolate the missing parts of cropped panoramas (async)
     */
    interpolateBackground?: boolean;
    /**
     * number of faces of the sphere geometry, higher values may decrease performances
     * @default 64
     */
    resolution?: number;
    /**
     * read real image size from XMP data
     * @default true
     */
    useXmpData?: boolean;
};
type EquirectangularMesh = Mesh<BufferGeometry, Material>;
type EquirectangularTexture = TextureData<Texture, string, PanoData>;
/**
 * Adapter for equirectangular panoramas
 */
declare class EquirectangularAdapter extends AbstractAdapter<string, Texture, PanoData> {
    static readonly id: string;
    static readonly VERSION: string;
    static readonly supportsDownload: boolean;
    private readonly config;
    private interpolationWorker;
    readonly SPHERE_SEGMENTS: number;
    readonly SPHERE_HORIZONTAL_SEGMENTS: number;
    constructor(viewer: Viewer, config?: EquirectangularAdapterConfig);
    supportsTransition(): boolean;
    supportsPreload(): boolean;
    destroy(): void;
    textureCoordsToSphericalCoords(point: PanoramaPosition, data: PanoData): Position;
    sphericalCoordsToTextureCoords(position: Position, data: PanoData): PanoramaPosition;
    loadTexture(panorama: string, loader?: boolean, newPanoData?: PanoData | PanoDataProvider, useXmpPanoData?: boolean): Promise<EquirectangularTexture>;
    /**
     * Loads the XMP data of an image
     */
    private loadXMP;
    /**
     * Reads a Blob as a string
     */
    private loadBlobAsString;
    /**
     * Creates the final texture from image and panorama data
     */
    private createEquirectangularTexture;
    createMesh(scale?: number): EquirectangularMesh;
    setTexture(mesh: EquirectangularMesh, textureData: EquirectangularTexture): void;
    setTextureOpacity(mesh: EquirectangularMesh, opacity: number): void;
    disposeTexture(textureData: EquirectangularTexture): void;
    private __defaultPanoData;
}

declare const Cache: {
    enabled: boolean;
    maxItems: number;
    ttl: number;
    items: Record<string, {
        files: Record<string, HTMLImageElement | Blob>;
        lastAccess: number;
    }>;
    purgeInterval: NodeJS.Timer;
    init(): void;
    add(url: string, key: string, data: HTMLImageElement | Blob): void;
    get(url: string, key: string): HTMLImageElement | Blob;
    remove(url: string, key: string): void;
    purge(): void;
};

/**
 * Default options
 */
declare const DEFAULTS: Required<ParsedViewerConfig>;

/**
 * General information about the system
 */
declare const SYSTEM: {
    /**
     * Indicates if the system data has been loaded
     */
    loaded: boolean;
    /**
     * Device screen pixel ratio
     */
    pixelRatio: number;
    /**
     * Device supports WebGL
     */
    isWebGLSupported: boolean;
    /**
     * Maximum WebGL texture width
     */
    maxTextureWidth: number;
    /**
     * Device supports touch events
     */
    isTouchEnabled: ResolvableBoolean;
    /**
     * Name of the fullscreen event
     */
    fullscreenEvent: string;
    /**
     * @internal
     */
    __maxCanvasWidth: number;
    /**
     * Maximum canvas width
     */
    readonly maxCanvasWidth: number;
    /**
     * Loads the system if not already loaded
     * @internal
     */
    load(): void;
};

declare class PSVError extends Error {
    constructor(message: string);
}

declare const VERSION: string;

export { AbstractAdapter, AbstractButton, AbstractComponent, AbstractConfigurablePlugin, AbstractPlugin, type AdapterConstructor, type AnimateOptions, type ButtonConfig, type ButtonConstructor, constants as CONSTANTS, Cache, type ClickData, type CssSize, type CustomRenderer, DEFAULTS, DataHelper, EquirectangularAdapter, type EquirectangularAdapterConfig, type ExtendedPosition, Loader, Navbar, type NavbarButtonElement, type NavbarCustomButton, Notification, type NotificationConfig, Overlay, type OverlayConfig, PSVError, Panel, type PanelConfig, type PanoData, type PanoDataProvider, type PanoramaOptions, type PanoramaPosition, type ParsedViewerConfig, type PluginConstructor, type Point, type Position, type ReadonlyViewerConfig, Renderer, type ResolvableBoolean, SYSTEM, type Size, type SphereCorrection, type SphericalPosition, type TextureData, TextureLoader, Tooltip, type TooltipConfig, type TooltipPosition, TypedEvent, TypedEventTarget, type UpdatableViewerConfig, VERSION, Viewer, type ViewerConfig, ViewerState, events, registerButton, index as utils };
