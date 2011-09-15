(function () {

// Constants
var FETCH_URL = "fetch/?card_name=";
var IMAGE_SRC = "media/images/cards/back.jpg";

var currentZIndex = 1;

// Event listeners
var dragging;
var mouseDownOn;
addEventListener("mousemove", function (e) {
	if (!mouseDownOn) {
		return;
	}

	if (!dragging) {
		dragging = {
			target: mouseDownOn,
			x: e.pageX - mouseDownOn.offsetLeft,
			y: e.pageY - mouseDownOn.offsetTop
		}
	}

	var target = dragging.target;
	target.style.left = (e.pageX - dragging.x) + "px";
	target.style.top = (e.pageY - dragging.y) + "px";
});

document.body.addEventListener("mouseup", function (e) {
	dragging = null;
	mouseDownOn = null;
});

Card = function (name) {
	var card = new Image();
	card.className = "card";
	card.src = IMAGE_SRC;

	card.addEventListener("mousedown", function (e) {
		e.preventDefault();
		mouseDownOn = card;
	});

	card.addEventListener("mouseup", bind(this, function () {
		if (!dragging) {
			card.style.zIndex = currentZIndex;
			++currentZIndex;
			this.toggleTap();
		}
	}));

	document.body.appendChild(card);
	this._image = card;

	if (name) {
		this.makeImageFromCardName(name);
	}
};

Card.prototype.makeImageFromCardName = function (name) {
	var card = this._image;

	var request = new XMLHttpRequest();
	request.open("GET", FETCH_URL + name, true);
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			try {
				var json = JSON.parse(request.responseText);
				card.src = json.imageURL;
				card.title = json.text;
			} catch (e) {
				card.title = "Could not find " + name;
			}
		}
	};
	request.send();
};

Card.prototype.rotate = function (deg) {
	var rule = "rotate(%sdeg)".replace(/%s/, deg);
	var card = this._image;
	card.style["-moz-transform"] = rule;
	card.style["-webkit-transform"] = rule;
};

Card.prototype.tap = function () {
	this.tapped = true;
	this.rotate(90);
};

Card.prototype.untap = function () {
	this.tapped = false;
	this.rotate(0);
};

Card.prototype.toggleTap = function () {
	this.tapped = !this.tapped;
	if (this.tapped) {
		this.tap();
	} else {
		this.untap();
	}
};

}());
