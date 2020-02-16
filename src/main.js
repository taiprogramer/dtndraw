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
    function SVG(svg) {
        this.root = svg;
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
            a.setAttribute("download", "dtndraw.png");
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
var svg = new SVG(document.getElementsByTagName("svg")[0]);
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
            }
        }
    }
});
