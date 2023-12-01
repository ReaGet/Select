class Emitter {
  constructor() {
    this.listeners = {};
  }
  on(name, fn) {
    !this.listeners[name] && (this.listeners[name] = []);
    this.listeners[name].push(fn);
  }
  off(name, fn) {
    this.listeners[name] = this.listeners[name].filter(
      (listenerFn) => listenerFn !== fn,
    );
  }
  emit(name) {
    const listeners = this.listeners[name];
    listeners &&
      listeners.forEach((fn) =>
        fn.call(null, ...Array.prototype.slice.call(arguments, 1)),
      );
  }
}

function getEmitter() {
  return new Emitter();
}

export default getEmitter;
export { Emitter };
