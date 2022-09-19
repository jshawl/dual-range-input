var DualRangeInput = function (opts) {
  const root = document.querySelector(opts.selector || opts);
  const rangeStart = root.querySelector(".range-start");
  const rangeEnd = root.querySelector(".range-end");
  let mouseDownX = 0;
  let dragging = false;

  setup(rangeStart);
  setup(rangeEnd);

  root.addEventListener("mousedown", onMouseDown);
  addEventListener("mouseup", onMouseUp);
  addEventListener("mousemove", onMouseMove);

  const ui = createAndAddElement("div", "ui", root);
  const uiStart = createAndAddElement("div", "start", ui);
  const middle = createAndAddElement("div", "middle", ui);
  const uiEnd = createAndAddElement("div", "end", ui);

  render();

  function setup(range) {
    range.addEventListener("input", onChange);
    range.addEventListener("change", onChange);
    if (!opts.debug) range.style.display = "none";
  }

  function render() {
    uiStart.innerHTML = rangeStart.value;
    uiStart.style.left = rangeStart.value + "%";
    middle.style.left = rangeStart.value + "%";
    middle.style.width = rangeEnd.value - rangeStart.value + "%";
    if (!opts.ordinal) {
      middle.style.transform =
        parseInt(rangeStart.value) > rangeEnd.value
          ? "translateX(-100%)"
          : "translateX(0)";
    }
    uiEnd.innerHTML = rangeEnd.value;
    uiEnd.style.left = rangeEnd.value + "%";
  }

  function createAndAddElement(tagName, classList, parent) {
    const child = document.createElement(tagName);
    child.classList.add(classList);
    parent.appendChild(child);
    return child;
  }

  function onMouseDown(e) {
    dragging = e.target;
    mouseDownX = e.x;
  }

  function onMouseUp(e) {
    dragging = false;
  }

  const targetRange = (element) => {
    if (element.value) return element;
    if (dragging.classList.contains("start")) return rangeStart;
    if (dragging.classList.contains("end")) return rangeEnd;
  };

  function onMouseMove(e) {
    if (!dragging) return;
    if (dragging.getAttribute("type") === "range") return;
    console.log("dragging?", dragging);
    const total = ui.clientWidth;
    const mouseMoveX = e.clientX - ui.offsetLeft;
    const percent = Math.floor((100 * mouseMoveX) / total);
    targetRange(e.target).value = percent;
    render();
    onChange(e);
  }

  function onChange(e) {
    if (!dragging) return;
    const tr = targetRange(e.target);
    const condition = parseInt(rangeEnd.value) <= rangeStart.value;
    if (tr.classList.contains("range-end") && condition) {
      rangeStart.value = rangeEnd.value;
    }
    if (tr.classList.contains("range-start") && condition) {
      rangeEnd.value = rangeStart.value;
    }
    render();
  }
};

DualRangeInput(".dual-range-1");
DualRangeInput({ selector: ".dual-range-2", debug: true });
DualRangeInput({ selector: ".dual-range-4", debug: true });
