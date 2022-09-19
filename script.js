export default function (opts) {
  const styles = document.createElement('style');
  styles.innerHTML=`
  .ui {
    background: #e9e9ed;
    border: 1px solid #8f8f9d;
    height: 4px;
    position: relative;
    border-radius: 30px;
    width: 160px;
  }
  
  .middle {
    height: 5px;
    width: 100px;
    background: #007aff;
    position: absolute;
    z-index: 1;
  }
  
  .ui .start,
  .ui .end {
    position: absolute;
    background: #676774;
    top: 50%;
    border: 2px solid white;
    cursor: col-resize;
    height: 18px;
    line-height: 18px;
    width: 18px;
    border-radius: 50%;
    text-align: center;
    user-select: none;
    color: white;
    transform: translate(-50%, -50%);
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.25);
    font-size: 0.8rem;
    z-index: 10;
  }
  `

  const root = document.querySelector(opts.selector || opts);
  root.appendChild(styles);
  const rangeStart = root.querySelector(".range-start");
  const rangeEnd = root.querySelector(".range-end");
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
