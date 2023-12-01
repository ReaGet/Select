import { default as SelectInstance } from "./core/select.js";

export default function Select(opts = {}) {
  if (opts.name) {
    const $el = document.querySelector(`[data-select='${opts.name}']`);
    if (!$el) {
      throw new Error(`There is no select with name '${opts.name}'`);
    }

    const _select = new SelectInstance($el, opts);
    return _select;
  } else {
    const $els = [...document.querySelectorAll("[data-select]")];
    return $els.map(($el) => new SelectInstance($el, opts));
  }  
}