var days = document.querySelector(".days .disc");
var hours = document.querySelector(".hours .disc");
var minutes = document.querySelector(".minutes .disc");
var seconds = document.querySelector(".seconds .disc");

function start(hand, current, max) {
	hand.style.transform = "rotate(" + current / max + "turn)";
}

function setup() {
	var d = new Date();
	var getDays = Math.ceil((d - new Date(d.getFullYear(), 0, 1)) / 86400000);

	start(days, getDays, 23);
	start(hours, d.getHours(), 23);
	start(minutes, d.getMinutes(), 59);
	start(seconds, d.getSeconds(), 59);
}

setup();
