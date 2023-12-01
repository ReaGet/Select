import { Select } from "./src/index.js";

const selects = new Select();
console.log(selects);

selects.map((select) => {
  select.on("change", (option) => {
    console.log(option)
  });
})

window.selects = selects;

// const select = new Select({
//   name: "vendors",
// });

// const select2 = new Select({
//   name: "second",
// });


// select.on("change", (option) => {
//   console.log(option)
// });

// select2.on("change", (option) => {
//   console.log(2, option)
// });

// window.select = select;
// window.select2 = select2;