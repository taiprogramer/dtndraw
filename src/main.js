var CursorPosition = /** @class */ (function () {
    function CursorPosition(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    Object.defineProperty(CursorPosition.prototype, "x", {
        get: function () { return this._x; },
        set: function (xValue) { this._x = xValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CursorPosition.prototype, "y", {
        get: function () { return this._y; },
        set: function (yValue) { this._y = yValue; },
        enumerable: true,
        configurable: true
    });
    return CursorPosition;
}());
var Circle = /** @class */ (function () {
    function Circle(cx, cy, radius, color) {
        if (radius === void 0) { radius = 1; }
        if (color === void 0) { color = "#FFFFFF"; }
        this.root = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.root.setAttribute("fill", color);
        this.root.setAttribute("r", radius.toString());
        this.root.setAttribute("cx", cx.toString());
        this.root.setAttribute("cy", cy.toString());
    }
    return Circle;
}());
var Line = /** @class */ (function () {
    function Line(x1, y1, x2, y2, width, color) {
        if (width === void 0) { width = 2; }
        if (color === void 0) { color = "#FFFFFF"; }
        this.root = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.root.setAttribute("stroke", color);
        this.root.setAttribute("stroke-width", width.toString());
        this.root.setAttribute("x1", x1.toString());
        this.root.setAttribute("y1", y1.toString());
        this.root.setAttribute("x2", x2.toString());
        this.root.setAttribute("y2", y2.toString());
    }
    return Line;
}());
var SVG = /** @class */ (function () {
    function SVG() {
        this.root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    }
    SVG.prototype.draw = function (obj) {
        this.root.appendChild(obj.root);
    };
    SVG.prototype.erase = function () {
        while (this.root.lastChild) {
            this.root.removeChild(this.root.lastChild);
        }
    };
    SVG.prototype.getImage = function () {
        var xmlSerializer = new XMLSerializer();
        var svgXMLstr = xmlSerializer.serializeToString(this.root);
        var canvas = document.createElement("canvas");
        var rect = this.root.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        var ctx = canvas.getContext("2d");
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
        var image = new Image();
        image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgXMLstr);
        image.onload = function () {
            ctx.drawImage(image, 0, 0);
            var dataURL = canvas.toDataURL("image/png").replace("image/png", "octet-stream");
            var a = document.createElement("a");
            var d = new Date();
            // filename: dtndraw-ddmmyy-hhmmss.png
            var downloadFileName = "dtndraw";
            var date = d.getDate();
            var month = d.getMonth() + 1; // because getMonth() start from 0
            var year = d.getFullYear();
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var seconds = d.getSeconds();
            downloadFileName += "-";
            downloadFileName += date.toString().concat(month.toString()).concat(year.toString());
            downloadFileName += "-";
            downloadFileName += hours.toString().concat(minutes.toString()).concat(seconds.toString());
            downloadFileName += ".png";
            a.setAttribute("download", downloadFileName);
            a.setAttribute("href", dataURL);
            a.click();
        };
    };
    SVG.prototype.onTouchStart = function (f) {
        this.root.addEventListener("touchstart", f);
    };
    SVG.prototype.onTouchMove = function (f) {
        this.root.addEventListener("touchmove", f);
    };
    SVG.prototype.onTouchEnd = function (f) {
        this.root.addEventListener("touchend", f);
    };
    SVG.prototype.onMouseDown = function (f) {
        this.root.addEventListener("mousedown", f);
    };
    SVG.prototype.onMouseMove = function (f) {
        this.root.addEventListener("mousemove", f);
    };
    SVG.prototype.onMouseUp = function (f) {
        this.root.addEventListener("mouseup", f);
    };
    return SVG;
}());
var HelpPanel = /** @class */ (function () {
    function HelpPanel() {
        var _this = this;
        this.root = document.createElement("ul");
        this.shortcuts = new Array();
        this.items = new Array();
        this.root.classList.add("b-help-panel");
        this.shortcuts.push({ name: "C", description: "Alt + c: Erase everything (Clear)" });
        this.shortcuts.push({ name: "G", description: "Alt + g: Download image (Get)" });
        this.shortcuts.push({ name: "/", description: "Alt + /: Toggle this help" });
        this.shortcuts.forEach(function (shortcut) {
            var li = document.createElement("li");
            li.textContent = shortcut.name;
            _this.items.push(li);
            var div = document.createElement("div");
            div.textContent = shortcut.description;
            div.classList.add("tooltip");
            li.appendChild(div);
            _this.root.appendChild(li);
            _this.addEventListenerForItems();
        });
    }
    HelpPanel.prototype.toggle = function () {
        var visibility = this.root.style.visibility;
        if (visibility === "visible" || visibility === "") {
            this.root.style.visibility = "hidden";
            return;
        }
        if (visibility === "hidden") {
            this.root.style.visibility = "visible";
        }
    };
    HelpPanel.prototype.addEventListenerForItems = function () {
        this.items.forEach(function (item) {
            item.onclick = function (e) {
                switch (item.textContent.charAt(0)) {
                    case "C": {
                        var evt = new KeyboardEvent("keydown", { key: "c", altKey: true });
                        document.dispatchEvent(evt);
                        break;
                    }
                    case "G": {
                        var evt = new KeyboardEvent("keydown", { key: "g", altKey: true });
                        document.dispatchEvent(evt);
                        break;
                    }
                    case "/": {
                        var evt = new KeyboardEvent("keydown", { key: "/", altKey: true });
                        document.dispatchEvent(evt);
                        break;
                    }
                }
            };
        });
    };
    return HelpPanel;
}());
var ColorPicker = /** @class */ (function () {
    function ColorPicker() {
        this.root = document.createElement("div");
        this.root.classList.add("b-color-picker");
    }
    return ColorPicker;
}());
var svg = new SVG();
var helpPanel = new HelpPanel();
var colorPicker = new ColorPicker();
var current = new CursorPosition(0, 0);
var old = new CursorPosition(0, 0);
var drawing = false;
// Listen touch events of finger on mobile
svg.onTouchStart(function (e) {
    drawing = true;
    current.x = e.touches[0].clientX;
    current.y = e.touches[0].clientY;
    var circle = new Circle(current.x, current.y);
    svg.draw(circle);
});
svg.onTouchMove(function (e) {
    if (drawing === true) {
        old.x = current.x;
        old.y = current.y;
        current.x = e.touches[0].clientX;
        current.y = e.touches[0].clientY;
        var line = new Line(old.x, old.y, current.x, current.y);
        svg.draw(line);
    }
});
svg.onTouchEnd(function (e) {
    drawing = false;
});
// Listen move events of mouse on desktop
svg.onMouseDown(function (e) {
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
    var circle = new Circle(current.x, current.y);
    svg.draw(circle);
});
svg.onMouseMove(function (e) {
    if (drawing === true) {
        old.x = current.x;
        old.y = current.y;
        current.x = e.clientX;
        current.y = e.clientY;
        var line = new Line(old.x, old.y, current.x, current.y);
        svg.draw(line);
    }
});
svg.onMouseUp(function (e) {
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
document.body.appendChild(svg.root);
document.body.appendChild(helpPanel.root);
document.body.appendChild(colorPicker.root);
