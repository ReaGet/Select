import { Emitter } from "./emitter.js";

export default class Select extends Emitter {
  constructor($el, opts) {
    super();
    if (opts.name) {
      this.name = opts.name;
    }

    this.root = $el;
    this.optionsList = null;
    this.options = new Map();
    this.selected = null;

    this.init();
  }

  init() {
    this.root.insertAdjacentHTML('beforeEnd', `
      <div data-items>
        <div>

        </div>
      </div>
    `);

    if (!this.root.querySelector("[data-option='current']")) {
      this.root.insertAdjacentHTML("afterbegin", `
        <div data-option="current">
          <span>Стандартное значение</span>
          <svg width="15" height="9" viewBox="0 0 15 9" xmlns="http://www.w3.org/2000/svg" data-icon>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7672 1.42833C15.0776 1.1116 15.0776 0.575594 14.7672 0.258865C14.4567 -0.0700459 13.9737 -0.057864 13.6633 0.258865L7.38501 6.72745L1.33672 0.246683C1.03775 -0.0822278 0.543312 -0.0822278 0.232848 0.246683C-0.0776159 0.575594 -0.0776159 1.09942 0.232848 1.41615L6.83308 8.49382C7.14354 8.82274 7.63798 8.81055 7.94845 8.49382L14.7672 1.42833Z"/>
          </svg>
        </div>
      `);
    }

    this.optionsList = this.root.querySelector("[data-items] > div");
    
    const selectEl = this.root.querySelector("select");
    this.htmlToOptions(selectEl.children);
    selectEl.remove();

    this.bind();
  }

  bind() {
    document.addEventListener("click", (event) => {
      event.preventDefault();
      if (event.target.closest("[data-select]") !== this.root) {
        this.close();
        return;
      }

      const clickedOption = event.target.closest("[data-option]");
      
      if (clickedOption.dataset.option === "disabled") {
        return;
      }

      if (clickedOption.dataset.option === "current") {
        this.isOpened() ? this.close() : this.open();
        return;
      }

      if (clickedOption.dataset.option !== null) {
        this.setSelected(clickedOption.dataset.value);
        this.close();
      }
    });
  }

  htmlToOptions(optionsEl) {
    return [...optionsEl].map((el) => {
      this.addOption({
        value: el.value,
        text: el.innerText,
        selected: el.selected,
        disabled: el.disabled,
        mounted: false,
      });
    });
  }

  setOptions(options) {
    this.options.forEach((opt) => this.removeOption(opt.value));
    this.addOptions(options);
  }

  addOptions(options) {
    if (!Array.isArray(options)) {
      options = [options];
    }


    options.forEach(this.addOption.bind(this));
  }

  addOption(option) {
    // Добавить стандартные значения selected и disabled
    option.value = String(option.value);
    if (this.options.has(option.value)) {
      return;
    }

    this.options.set(option.value, {
      selected: false,
      disabled: false,
      mounted: false,
      ...option,
    });

    const _option = this.options.get(option.value);
    const $el = this.createOptionHTML(_option);
    this.optionsList.appendChild($el);

    if (_option.selected) {
      this.selected = _option;
      this.updateSelectedText();
    }

    _option.mounted = true;
    _option.$el = $el;
  }

  createOptionHTML(option) {
    const optionEl = document.createElement("div");
    optionEl.setAttribute("data-value", option.value);
    optionEl.setAttribute("data-option", option.selected ? 'selected' : (option.disabled ? 'disabled' : ''));
    optionEl.innerText = option.text;
    return optionEl;
  }

  setSelected(value) {
    const check = this.options.get(value); 
    if (!check || check?.disabled || value === this.selected.value) {
      return;
    }

    const current = [...this.options].find((item) => item[1].selected);
    
    if (current) {
      this.setOptionProp(current[0], "selected", false);
    }
    
    this.setOptionProp(value, "selected", true);
    this.selected = check;
    this.updateSelectedText();
    this.emit("change", this.selected);
  }

  setOptionProp(name, key, value) {
    const option = this.options.get(name);
    if (!option) return;
    option[key] = value;
    this.updateOptionUI(option);
  }

  updateOptionUI(option) {
    option?.$el.setAttribute("data-option", option.selected ? 'selected' : (option.disabled ? 'disabled' : ''));    
  }

  updateSelectedText() {
    this.root.querySelector("[data-option='current'] span").innerText = this.selected.text;
  }

  open() {
    this.root.setAttribute("data-open", "");
    this.emit("open");
  }

  isOpened() {
    return this.root.getAttribute("data-open") !== null;
  }

  close() {
    this.root.removeAttribute("data-open");
    this.emit("close");
  }

  removeOption(value) {
    this.optionsList.querySelector(`[data-option][data-value='${value}']`)?.remove();
    this.options.delete(value);
  }
}