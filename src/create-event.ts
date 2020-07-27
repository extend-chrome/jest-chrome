export interface EventCallback {
  (...args: any[]): void
}
export interface EventSelector<C extends EventCallback> {
  (...args: any[]): Parameters<C>
}
export interface MonotypeEventSelector<C extends EventCallback> {
  (...args: Parameters<C>): Parameters<C>
}
export interface OptionsSelector {
  (...options: any[]): any[]
}

/** An object which allows the addition, removal, and invocation of listener functions. */
type CoreEvent<C extends EventCallback> = {
  /**
   * Registers an event listener callback to an event.
   * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
   * The callback parameter should be a function that looks like this:
   * function() {...};
   */
  addListener(callback: C): void
  /**
   * @param callback Listener whose registration status shall be tested.
   */
  hasListener(callback: C): boolean
  hasListeners(): boolean
  /**
   * Deregisters an event listener callback from an event.
   * @param callback Listener that shall be unregistered.
   * The callback parameter should be a function that looks like this:
   * function() {...};
   */
  removeListener(callback: C): void
}

type Callable<
  C extends EventCallback,
  R extends MonotypeEventSelector<C> | EventSelector<C>
> = {
  /**
   * Calls all listeners with a data argument.
   */
  callListeners: (...args: Parameters<R>) => void

  /**
   * Remove all listeners
   */
  clearListeners(): void

  /**
   * Get the listener Set
   */
  getListeners(): Set<C>

  /**
   * Returns CallableEvent without callListeners
   */
  toEvent(): CoreEvent<C>
}

export type CallableEvent<
  C extends EventCallback,
  R extends MonotypeEventSelector<C> | EventSelector<C>
> = CoreEvent<C> & Callable<C, R>

export const createEvent = <C extends EventCallback>(
  // Use to map the arguments for Event#callListeners
  selector: EventSelector<C>,
  // Use to validate extra option arguments
  validator?: OptionsSelector,
) => {
  if (validator) {
    return createMapEvent(selector, validator)
  } else {
    return createSetEvent(selector)
  }
}

/**
 * Create an event that takes a single callback as an argument
 *
 * @export
 * @template C The callback signature
 * @template R The event selector signature
 * @param {R} selector Validate a call to callListeners and map it to the callback arguments
 * @returns {CallableEvent<C, R>}
 */
export function createSetEvent<
  C extends EventCallback,
  R extends EventSelector<C> | MonotypeEventSelector<C>
>(selector: R): CallableEvent<C, R> {
  const _cbs = new Set<C>()

  return {
    addListener,
    hasListener,
    hasListeners,
    callListeners,
    clearListeners,
    getListeners,
    removeListener,
    toEvent() {
      return {
        addListener,
        hasListener,
        hasListeners,
        removeListener,
      }
    },
  }

  function addListener(cb: C) {
    _cbs.add(cb)
  }
  function hasListener(cb: C) {
    return _cbs.has(cb)
  }
  function hasListeners() {
    return _cbs.size > 0
  }
  function callListeners(...args: Parameters<R>) {
    // eslint-disable-next-line
    // @ts-ignore
    const cbArgs = selector(...args)

    if (cbArgs) {
      _cbs.forEach((cb) => {
        cb(...cbArgs)
      })
    }
  }
  function removeListener(cb: C) {
    _cbs.delete(cb)
  }
  function clearListeners() {
    _cbs.clear()
  }
  function getListeners() {
    return new Set(_cbs.values())
  }
}

/**
 * Create an event that takes a single callback and any number of option arguments
 *
 * @export
 * @template C The listener callback signature. Will be called with the result of the event selector
 * @template E The event selector function signature. Will be called with the result of the options selector and the arguments for callListeners
 * @template O The options selector function signature. Will be called with the options arguments from addListener
 * @param {E} eventSelector Validate a call to callListeners and map it to the callback arguments
 * @param {O} [optionsSelector] Validate the options arguments passed to addListener
 * @returns {CallableEvent<C, E>}
 */
export function createMapEvent<
  C extends EventCallback,
  E extends EventSelector<C> | MonotypeEventSelector<C>,
  O extends OptionsSelector
>(eventSelector: E, optionsSelector?: O): CallableEvent<C, E> {
  const _cbs: Map<C, any[]> = new Map()

  return {
    addListener,
    hasListener,
    hasListeners,
    callListeners,
    clearListeners,
    getListeners,
    removeListener,
    toEvent() {
      return {
        addListener,
        hasListener,
        hasListeners,
        removeListener,
      }
    },
  }

  function addListener(cb: C, ...options: any[]) {
    const _options =
      (typeof optionsSelector === 'function' &&
        optionsSelector(...options)) ||
      options

    _cbs.set(cb, _options)
  }
  function hasListener(cb: C) {
    return _cbs.has(cb)
  }
  function hasListeners() {
    return _cbs.size > 0
  }
  function callListeners(...args: any[]) {
    _cbs.forEach((options, cb) => {
      // eslint-disable-next-line
      // @ts-ignore
      const cbArgs = eventSelector(...options, ...args)

      if (cbArgs) {
        cb(...cbArgs)
      }
    })
  }
  function removeListener(cb: C) {
    _cbs.delete(cb)
  }
  function clearListeners() {
    _cbs.clear()
  }
  function getListeners() {
    return new Set(_cbs.keys())
  }
}
