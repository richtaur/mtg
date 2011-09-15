var bind = function (context, fn) {
	return function () {
		fn.apply(context, arguments);
	}
};

// Card name
var cardName = document.getElementById("card_name");

// Make card
var make = document.getElementById("make");
make.addEventListener("click", function () {
	var card = new Card(cardName.value);
}, false);
