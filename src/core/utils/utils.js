export function defineProp(context, prop, callback = () => {}) {
  let _value;
  Object.defineProperty(context, prop, {
    set(newValue) {
      callback(newValue, _value);
      _value = newValue;
    },
    get() {
      return _value;
    }
  });
}

export function initMarkup(context) {
  const wrapper = context.$el;
  wrapper.insertAdjacentHTML('beforeEnd', `
    <div data-items>
      <div>

      </div>
    </div>
  `);

  if (!wrapper.querySelector("[data-option='current']")) {
    wrapper.insertAdjacentHTML("afterbegin", `
      <div data-option="current">
        <span>Стандартное значение</span>
        <svg width="15" height="9" viewBox="0 0 15 9" xmlns="http://www.w3.org/2000/svg" data-icon>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7672 1.42833C15.0776 1.1116 15.0776 0.575594 14.7672 0.258865C14.4567 -0.0700459 13.9737 -0.057864 13.6633 0.258865L7.38501 6.72745L1.33672 0.246683C1.03775 -0.0822278 0.543312 -0.0822278 0.232848 0.246683C-0.0776159 0.575594 -0.0776159 1.09942 0.232848 1.41615L6.83308 8.49382C7.14354 8.82274 7.63798 8.81055 7.94845 8.49382L14.7672 1.42833Z"/>
        </svg>
      </div>
    `);
  }
}

export function objToHtmlEl(option) {
  const el = document.createElement("div");
  el.setAttribute("data-value", option.value);
  el.setAttribute("data-option", getDataOptionVal(option));
  el.innerText = option.text;
  return el;
}

export function htmlToObj(selectChildren) {
  return [...selectChildren].map((el) => {
    return {
      value: el.value,
      text: el.innerText,
      selected: el.selected ?? false,
      disabled: el.disabled ?? false,
      // mounted: false,
    };
  });
}

export function getDataOptionVal(option) {
  return option.selected ? 'selected' : (option.disabled ? 'disabled' : '');
}

export const defaultOption = {
  selected: false,
  disabled: false,
  value: undefined,
  $el: undefined,
};