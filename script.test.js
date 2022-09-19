/**
 * @jest-environment jsdom
 */

import DualRangeInput from "./script";

test("basic setup", () => {
  document.body.innerHTML = `
    <div class='dual-range-input'>
      <input type='range' class='range-start'>
      <input type='range' class='range-end'>
    </div>
  `
  DualRangeInput('.dual-range-input')
  expect(document.body.querySelector(".ui")).toBeTruthy()
})
