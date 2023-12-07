import Select from "../index.js";

// const selects = new Select();
// console.log(selects);

// selects.map((select) => {
//   select.on("change", (option) => {
//     console.log(option)
//   });
// })

// window.selects = selects;

const select = new Select({
  name: "vendors",
  template: {
    arrow: "<span data-icon><</span>"
  }
});

const select2 = new Select({
  name: "second",
});


select.on("change", (option) => {
  // console.log(select.value, option)
});

select2.on("change", (option) => {
  console.log(2, option)
});

window.select = select;
window.select2 = select2;