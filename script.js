var FONT_SIZE = 100;
var HEIGHT = FONT_SIZE * 1.1;
var WIDTH = FONT_SIZE;

var INTERVAL_DURATION = 50;

var index = 0;
var emoji = window.emoji;

var canvas = document.getElementById('sprite-canvas');
canvas.setAttribute('height', HEIGHT);
canvas.setAttribute('width', WIDTH);
var context = canvas.getContext('2d');
context.font = FONT_SIZE + 'px/1 sans-serif';
console.log(context.font);

var run = function(i) {
  var text = window.emoji[i];
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.fillText(text, 0, FONT_SIZE);
};

var interval = window.setInterval(function() {
  run(index);
  index += 1;
  if (index > emoji.length) {
    window.clearInterval(interval);
  }
}, INTERVAL_DURATION);
