/**
 * @jest-environment jsdom
 */

import DualRangeInput from "./script";

const template = `
<div class='dual-range-input'>
  <input type='range' class='range-start' value="10">
  <input type='range' class='range-end' value="90">
</div>
`

beforeEach(() => {
  document.body.innerHTML = template
})

test("basic setup", () => {
  DualRangeInput('.dual-range-input')
  expect(document.body.querySelector(".ui")).toBeTruthy()
})

test("event firings using .on()", () => {
  const dri = DualRangeInput('.dual-range-input')
  const onChange = jest.fn()
  dri.on('change', onChange)
  const e = new Event('change')
  document.querySelector('.range-start').dispatchEvent(e)
  expect(onChange).toHaveBeenCalledWith(e, {start: "10", end: "90"})
})
