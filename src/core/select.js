import { Emitter } from "./emitter.js";
import { defineProp, defaultOption, objToHtmlEl, initMarkup, htmlToObj } from "./utils/utils.js";

export default class Select extends Emitter {
  $el;
  value;
  disabled;
  options;

  constructor($el, opts) {
    super();
    if (opts.name) {
      this.name = opts.name;
    }

    this.options = new Map();
    this.$el = $el;

    defineProp(this, "value", (newValue, oldValue) => {
      if (this.disabled) {
        return;
      }
      const selectedOption = this.options.get(String(newValue));
      if (selectedOption) {
        this.$el.querySelector("[data-option='current'] span").innerText = selectedOption.text;
      }
    });

    defineProp(this, "disabled", (newValue, oldValue) => {
      if (newValue === true) {
        this.$el.setAttribute("disabled", "");
      } else if (newValue === false) {
        this.$el.removeAttribute("disabled");
      }
    });

    initMarkup(this);

    const selectEl = this.$el.querySelector("select");
    this.add(htmlToObj(selectEl.children));
    selectEl.remove();

    document.addEventListener("click", (event) => {
      event.preventDefault();
      if (event.target.closest("[data-select]") !== this.$el) {
        this.close();
        return;
      }

      const clickedOption = event.target.closest("[data-option]");
      if (
        clickedOption.dataset.option === "disabled" ||
        this.$el.getAttribute("disabled") !== null
      ) {
        return;
      }

      if (clickedOption.dataset.option === "current") {
        this.$el.getAttribute("data-open") ? this.close() : this.open();
        return;
      }

      if (clickedOption.dataset.option !== null) {
        this.value = clickedOption.dataset.value;
        this.close();
      }
    });
  }

  add(option) {
    if (!Array.isArray(option)) {
      option = [option];
    }

    option.forEach((opt) => {
      opt.value = String(opt.value);
      const _option = {
        ...defaultOption,
        ...opt,
      }
      _option.$el = objToHtmlEl(_option);
      
      this.$el.querySelector("[data-items] > div").appendChild(_option.$el);
      this.options.set(opt.value, _option);

      if (_option.selected) {
        this.value = _option.value;
      }
    });
  }

  remove(value) {
    value = String(value);
    this.$el.querySelector(`[data-option][data-value='${value}']`)?.remove();
    this.options.delete(value);
  }

  set(option) {
    this.clear();
    this.add(option);
  }

  clear() {
    this.$el.querySelector("[data-items] > div").innerHTML = "";
    this.options.clear();
  }

  item(index) {
    index = Math.max(0, Math.min(index, this.options.size - 1));
    const [key, value] = [...this.options][index];
    return value;
  }

  itemByValue(value) {
    return this.options.get(value);
  }

  open() {
    this.$el.setAttribute("data-open", "");
    this.emit("open");
  }

  close() {
    this.$el.removeAttribute("data-open");
    this.emit("close");
  }
}