/**
 * @jest-environment jsdom
 */

import DualRangeInput from "./script";

const template = `
<div class='dual-range-input'>
  <input type='range' class='range-start' value="10" max="100">
  <input type='range' class='range-end' value="90" max="100">
</div>
`;

beforeEach(() => {
  document.body.innerHTML = template;
});

test("basic setup", () => {
  DualRangeInput(".dual-range-input");
  expect(document.body.querySelector(".ui")).toBeTruthy();
});

test("event firings using .on()", () => {
  const dri = DualRangeInput(".dual-range-input");
  const onChange = jest.fn();
  dri.on("change", onChange);
  const e = new Event("change");
  document.querySelector(".range-start").dispatchEvent(e);
  expect(onChange).toHaveBeenCalledWith(e, { start: "10", end: "90" });
});

test(".update(start, end) sets input values", () => {
  const dri = DualRangeInput(".dual-range-input");
  const start = document.querySelector(".range-start")
  const end = document.querySelector(".range-end")
  expect(start.value).toBe("10")
  expect(end.value).toBe("90")
  expect(start.max).toBe("100")
  dri.update({start: "11", end: "89", max: "92", min: "14"})
  expect(start.value).toBe("11")
  expect(end.value).toBe("89")
  expect(start.getAttribute("max")).toBe("92")
  expect(start.getAttribute("min")).toBe("14")
  expect(end.getAttribute("max")).toBe("92")
  expect(end.getAttribute("min")).toBe("14")
})
