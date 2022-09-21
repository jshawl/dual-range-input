export const css = `
.ui {
  background: #e9e9ed;
  border: 1px solid #8f8f9d;
  height: 4px;
  position: relative;
  border-radius: 30px;
  width: 160px;
}

.ui:hover {
  border-color: #676774;
  background: #D0D0D7;
}

.middle {
  height: 5px;
  width: 100px;
  background: #007aff;
  position: absolute;
  z-index: 0;
}

.ui .start,
.ui .end {
  position: absolute;
  background: #676774;
  top: 50%;
  border: 2px solid white;
  height: 16px;
  line-height: 16px;
  width: 16px;
  border-radius: 50%;
  text-align: center;
  user-select: none;
  transform: translate(-50%, -50%);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.25);
  font-size: 0.8rem;
  z-index: 1;
}
.ui .start span,
.ui .end span {
  transform: translateY(-100%);
  display: none;
}
.ui .active:not(.middle) {
  background: #007aff;
  z-index: 2;
}
.ui .active span {
  display: inline-block;
}
`

export default function (opts) {
  if (typeof opts == "string") {
    opts = {
      selector: opts,
    };
  }
  opts.label =
    opts.label ||
    function (d) {
      return d;
    };
  const styles = document.createElement("style");
  styles.innerHTML = css;

  const root = document.querySelector(opts.selector);
  root.appendChild(styles);
  const rangeStart = root.querySelector(".range-start");
  const rangeEnd = root.querySelector(".range-end");
  let dragging = false;

  setup(rangeStart);
  setup(rangeEnd);

  root.addEventListener("pointerdown", onMouseDown);
  addEventListener("pointerup", onMouseUp);
  addEventListener("pointermove", onMouseMove);

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
    const startPercent =
      (100 * rangeStart.value) / rangeStart.getAttribute("max");
    const endPercent = (100 * rangeEnd.value) / rangeEnd.getAttribute("max");
    uiStart.innerHTML = "<span>" + opts.label(rangeStart.value) + "</span>";
    uiEnd.innerHTML = "<span>" + opts.label(rangeEnd.value) + "</span>";

    uiStart.style.left = startPercent + "%";
    middle.style.left = startPercent + "%";
    uiEnd.style.left = endPercent + "%";

    middle.style.width = endPercent - startPercent + "%";
    middle.style.transform =
      parseInt(rangeStart.value) > rangeEnd.value
        ? "translateX(-100%)"
        : "translateX(0)";
  }

  function createAndAddElement(tagName, classList, parent) {
    const child = document.createElement(tagName);
    child.classList.add(classList);
    parent.appendChild(child);
    return child;
  }

  function onMouseDown(e) {
    dragging = e.target;
    dragging.classList?.add('active')
  }

  function onMouseUp(e) {
    dragging.classList?.remove('active')
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
    const tr = targetRange(e.target);
    tr.value = (percent / 100) * tr.getAttribute("max");
    render();
    onChange(e);
  }

  let listeners = {};

  function onChange(e) {
    if (typeof listeners.change === "function") {
      listeners.change(e, {
        start: rangeStart.value,
        end: rangeEnd.value,
      });
    }
    const tr = targetRange(e.target);
    const condition = parseInt(rangeEnd.value) <= rangeStart.value;
    if (tr.classList.contains("range-end") && condition) {
      update({start: rangeEnd.value})
    }
    if (tr.classList.contains("range-start") && condition) {
      update({end: rangeStart.value})
    }
    render();
  }

  function on(name, callback) {
    listeners[name] = callback;
  }

  function update(opts){
    if(opts.start){
      rangeStart.value = opts.start
    }
    if(opts.end){
      rangeEnd.value = opts.end
    }
    if(opts.min){
      rangeStart.setAttribute("min", opts.min)
      rangeEnd.setAttribute("min", opts.min)
    }
    if(opts.max){
      rangeStart.setAttribute("max", opts.max)
      rangeEnd.setAttribute("max", opts.max)
    }
    render()
  }

  return {
    on,
    update
  };
}
