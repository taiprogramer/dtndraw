interface Drawable {
  root: SVGElement;
}

interface Shortcut {
  name: string;
  description: string;
}

type CursorPosition = {
  x: number;
  y: number;
};

class Circle implements Drawable {
  root: SVGElement;
  constructor(
    cx: number,
    cy: number,
    radius: number = 1,
    color: string = "#FFFFFF",
  ) {
    this.root = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.root.setAttribute("fill", color);
    this.root.setAttribute("r", radius.toString());
    this.root.setAttribute("cx", cx.toString());
    this.root.setAttribute("cy", cy.toString());
  }
}

class Line implements Drawable {
  root: SVGElement;
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number = 2,
    color: string = "#FFFFFF",
  ) {
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.root.setAttribute("stroke", color);
    this.root.setAttribute("stroke-width", width.toString());
    this.root.setAttribute("x1", x1.toString());
    this.root.setAttribute("y1", y1.toString());
    this.root.setAttribute("x2", x2.toString());
    this.root.setAttribute("y2", y2.toString());
  }
}

// Class::SVG
class SVG {
  root: SVGElement;
  constructor() {
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }

  draw(obj: Drawable) {
    this.root.appendChild(obj.root);
  }

  erase() {
    while (this.root.lastChild) {
      this.root.removeChild(this.root.lastChild);
    }
  }

  getImage() {
    const xmlSerializer = new XMLSerializer();
    const svgXMLstr = xmlSerializer.serializeToString(this.root);
    const canvas = document.createElement("canvas");
    const rect = this.root.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext("2d");
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.root.style.backgroundColor;
    ctx.fill();
    const image = new Image();
    image.src = "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svgXMLstr);
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
      const dataURL = canvas.toDataURL("image/png").replace(
        "image/png",
        "octet-stream",
      );
      const a = document.createElement("a");
      const d = new Date();
      // filename: dtndraw-ddmmyy-hhmmss.png
      let downloadFileName: string = "dtndraw";
      const date: number = d.getDate();
      const month: number = d.getMonth() + 1; // because getMonth() start from 0
      const year: number = d.getFullYear();
      const hours: number = d.getHours();
      const minutes: number = d.getMinutes();
      const seconds: number = d.getSeconds();
      downloadFileName += "-";
      downloadFileName += date.toString().concat(month.toString()).concat(
        year.toString(),
      );
      downloadFileName += "-";
      downloadFileName += hours.toString().concat(minutes.toString()).concat(
        seconds.toString(),
      );
      downloadFileName += ".png";
      a.setAttribute("download", downloadFileName);
      a.setAttribute("href", dataURL);
      a.click();
    };
  }

  onTouchStart(f: EventListener) {
    this.root.addEventListener("touchstart", f);
  }

  onTouchMove(f: EventListener) {
    this.root.addEventListener("touchmove", f);
  }

  onTouchEnd(f: EventListener) {
    this.root.addEventListener("touchend", f);
  }

  onMouseDown(f: EventListener) {
    this.root.addEventListener("mousedown", f);
  }

  onMouseMove(f: EventListener) {
    this.root.addEventListener("mousemove", f);
  }

  onMouseUp(f: EventListener) {
    this.root.addEventListener("mouseup", f);
  }
}

class HelpPanel {
  root: HTMLUListElement;
  shortcuts: Array<Shortcut>;
  items: Array<HTMLLIElement>;
  constructor() {
    this.root = document.createElement("ul");
    this.shortcuts = new Array<Shortcut>();
    this.items = new Array<HTMLLIElement>();
    this.root.classList.add("b-help-panel");
    this.shortcuts.push({
      name: "C",
      description: "Alt + c: Erase everything (Clear)",
    });
    this.shortcuts.push({
      name: "G",
      description: "Alt + g: Download image (Get)",
    });
    this.shortcuts.push({
      name: "/",
      description: "Alt + /: Toggle this help",
    });
    this.shortcuts.forEach((shortcut) => {
      const li: HTMLLIElement = document.createElement("li");
      li.textContent = shortcut.name;
      this.items.push(li);
      const div: HTMLDivElement = document.createElement("div");
      div.textContent = shortcut.description;
      div.classList.add("tooltip");
      li.appendChild(div);
      this.root.appendChild(li);
      this.addEventListenerForItems();
    });
  }

  toggle() {
    let visibility: string = this.root.style.visibility;
    if (visibility === "visible" || visibility === "") {
      this.root.style.visibility = "hidden";
      return;
    }
    if (visibility === "hidden") {
      this.root.style.visibility = "visible";
    }
  }

  addEventListenerForItems() {
    this.items.forEach((item) => {
      item.onclick = (e) => {
        switch (item.textContent.charAt(0)) {
          case "C": {
            const evt = new KeyboardEvent("keydown", {
              key: "c",
              altKey: true,
            });
            document.dispatchEvent(evt);
            break;
          }
          case "G": {
            const evt = new KeyboardEvent("keydown", {
              key: "g",
              altKey: true,
            });
            document.dispatchEvent(evt);
            break;
          }
          case "/": {
            const evt = new KeyboardEvent("keydown", {
              key: "/",
              altKey: true,
            });
            document.dispatchEvent(evt);
            break;
          }
        }
      };
    });
  }
}

class ColorPicker {
  root: HTMLDivElement;
  bgPicker: HTMLInputElement;
  fgPicker: HTMLInputElement;
  bgPickerFaceMask: HTMLDivElement;
  fgPickerFaceMask: HTMLDivElement;

  constructor() {
    this.root = document.createElement("div");
    this.root.classList.add("b-color-picker");

    this.bgPicker = document.createElement("input");
    this.bgPicker.setAttribute("type", "color");
    this.bgPicker.setAttribute("value", "#000000");

    this.fgPicker = document.createElement("input");
    this.fgPicker.setAttribute("type", "color");
    this.fgPicker.setAttribute("value", "#ffffff");

    this.bgPickerFaceMask = document.createElement("div");
    this.bgPickerFaceMask.setAttribute("id", "background-picker");
    this.bgPickerFaceMask.onclick = () => {
      this.bgPicker.click();
    };
    this.bgPickerFaceMask.style.backgroundColor = this.bgPicker.value;

    this.fgPickerFaceMask = document.createElement("div");
    this.fgPickerFaceMask.setAttribute("id", "foreground-picker");
    this.fgPickerFaceMask.onclick = () => {
      this.fgPicker.click();
    };
    this.fgPickerFaceMask.style.backgroundColor = this.fgPicker.value;

    this.root.appendChild(this.bgPickerFaceMask);
    this.root.appendChild(this.fgPickerFaceMask);
  }

  onBackgroundColorChanged(f: EventListener) {
    this.bgPicker.onchange = f;
  }

  onForegroundColorChanged(f: EventListener) {
    this.fgPicker.onchange = f;
  }
}

// Main
let drawColor: string = "#ffffff";
const svg: SVG = new SVG();
const helpPanel = new HelpPanel();
const colorPicker: ColorPicker = new ColorPicker();
const current: CursorPosition = { x: 0, y: 0 };
const old: CursorPosition = { x: 0, y: 0 };
let drawing: boolean = false;

// Listen touch events of finger on mobile
svg.onTouchStart(
  function (e: TouchEvent) {
    drawing = true;
    current.x = e.touches[0].clientX;
    current.y = e.touches[0].clientY;
    const circle: Circle = new Circle(
      current.x,
      current.y,
      undefined,
      drawColor,
    );
    svg.draw(circle);
  },
);

svg.onTouchMove(function (e: TouchEvent) {
  if (drawing === true) {
    old.x = current.x;
    old.y = current.y;
    current.x = e.touches[0].clientX;
    current.y = e.touches[0].clientY;
    const line = new Line(
      old.x,
      old.y,
      current.x,
      current.y,
      undefined,
      drawColor,
    );
    svg.draw(line);
  }
});

svg.onTouchEnd(function (e: TouchEvent) {
  drawing = false;
});

// Listen move events of mouse on desktop
svg.onMouseDown(function (e: MouseEvent) {
  drawing = true;
  current.x = e.clientX;
  current.y = e.clientY;
  const circle: Circle = new Circle(current.x, current.y, undefined, drawColor);
  svg.draw(circle);
});

svg.onMouseMove(function (e: MouseEvent) {
  if (drawing === true) {
    old.x = current.x;
    old.y = current.y;
    current.x = e.clientX;
    current.y = e.clientY;
    const line = new Line(
      old.x,
      old.y,
      current.x,
      current.y,
      undefined,
      drawColor,
    );
    svg.draw(line);
  }
});

svg.onMouseUp(function (e: MouseEvent) {
  drawing = false;
});

// handle shortcut
document.addEventListener("keydown", function (e) {
  if (e.altKey === true) {
    switch (e.key) {
      case "c": {
        svg.erase();
        break;
      }
      case "g": {
        svg.getImage();
        break;
      }
      case "/": {
        helpPanel.toggle();
        break;
      }
    }
  }
});

// color picker onchange
colorPicker.onBackgroundColorChanged((e: Event) => {
  const bgPicker = <HTMLInputElement> e.target;
  svg.root.style.backgroundColor = bgPicker.value;
  colorPicker.bgPickerFaceMask.style.backgroundColor = bgPicker.value;
});

colorPicker.onForegroundColorChanged((e: Event) => {
  const fgPicker = <HTMLInputElement> e.target;
  colorPicker.fgPickerFaceMask.style.backgroundColor = fgPicker.value;
  drawColor = fgPicker.value;
});

document.body.appendChild(svg.root);
document.body.appendChild(helpPanel.root);
document.body.appendChild(colorPicker.root);
