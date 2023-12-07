import { Emitter } from "./emitter.js";
import { defineProp, defaultOption, objToHtmlEl, initMarkup, htmlToObj, defaultSelectOptions, handleOptionWrapperPadding } from "./utils/utils.js";

export default class Select extends Emitter {
  $el;
  value;
  disabled;
  options;
  parent = [];
  children = [];

  constructor($el, opts) {
    super();
    if (opts.name) {
      this.name = opts.name;
    }

    opts = {
      ...defaultSelectOptions,
      ...opts,
    }

    this.vars = opts.vars

    this.options = new Map();
    this.$el = $el;

    defineProp(this, "value", (newValue, oldValue) => {
      let { value, type } = newValue;
      if (typeof newValue !== 'object') {
        value = newValue;
        type = "direct";
      } 

      if (this.disabled || value === oldValue) {
        return;
      }

      const oldOption = this.options.get(String(oldValue));
      if (oldOption) {
        oldOption.selected = false;
        oldOption.$el.setAttribute("data-option", "");
      }

      const selectedOption = this.options.get(String(value));

      if (selectedOption) {
        this.$el.querySelector("[data-option='current'] span").innerText = selectedOption.text;
        selectedOption.$el.setAttribute("data-option", "selected");
        selectedOption.selected = true;
        this.emit("change", selectedOption, type);
      } else {
        this.value = oldValue;
      }
    });

    defineProp(this, "disabled", (newValue, oldValue) => {
      if (newValue === true) {
        this.$el.setAttribute("disabled", "");
      } else if (newValue === false) {
        this.$el.removeAttribute("disabled");
      }
    });

    initMarkup(this, opts);

    const selectEl = this.$el.querySelector("select");
    this.add(htmlToObj(selectEl.children));
    selectEl.remove();

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-select]") !== this.$el) {
        this.close();
        return;
      }

      const clickedOption = event.target.closest("[data-option]");
      if (
        !clickedOption ||
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
        this.value = { value: clickedOption.dataset.value, type: "click" };
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

      if (this.options.has(opt.value)) {
        return;
      }

      const _option = {
        ...defaultOption,
        ...opt,
      }

      _option.$el = objToHtmlEl(_option);
      
      this.$el.querySelector("[data-items] > div").appendChild(_option.$el);
      this.options.set(opt.value, _option);

      if (_option.selected) {
        this.value = { value: _option.value, type: "add" };
      }
    });
    
    handleOptionWrapperPadding(this);
  }

  remove(value) {
    value = String(value);
    this.$el.querySelector(`[data-option][data-value='${value}']`)?.remove();
    this.options.delete(value);
    handleOptionWrapperPadding(this);
  }

  set(option) {
    this.clear();
    this.add(option);
  }

  clear() {
    this.$el.querySelector("[data-items] > div").innerHTML = "";
    this.options.clear();
    handleOptionWrapperPadding(this);
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
    handleOptionWrapperPadding(this);
    this.emit("open");
  }

  close() {
    this.$el.removeAttribute("data-open");
    this.emit("close");
  }
}