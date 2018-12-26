var FONT_SIZE = 20;
var HEIGHT = FONT_SIZE * 1.1;
var WIDTH = FONT_SIZE * 1.1;

var INTERVAL_DURATION = 10;

var index = 0;
var emoji = window.emoji;
var colorProps = ['r', 'g', 'b', 'a'];

var canvas = document.getElementById('sprite-canvas');
canvas.setAttribute('height', HEIGHT);
canvas.setAttribute('width', WIDTH);
var context = canvas.getContext('2d');
context.font = FONT_SIZE + 'px/1 sans-serif';
context.textAlign = 'center';

var averageColor = function(imageData) {
  var color = { r: 0, g: 0, b: 0, a: 0 };
  var data = imageData.data;
  var pixelCount = data.length / colorProps.length;
  for (var i = 0; i < data.length; i += colorProps.length) {
    colorProps.forEach(function(prop, propIndex) {
      color[prop] += data[i + propIndex];
    });
  }
  colorProps.forEach(function(prop) {
    color[prop] = color[prop] / pixelCount;
  });
  return color;
};

var colorString = function(color) {
  let values = colorProps.map(function(prop) {
    return color[prop];
  });
  values[3] = values[3] / 255;
  return 'rgba(' + values.join(',') + ')';
};

var run = function(i) {
  var text = window.emoji[i];
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.fillText(text, WIDTH / 2, FONT_SIZE);
  var data = context.getImageData(0, 0, WIDTH, HEIGHT);
  var color = averageColor(data);

  document.body.append(document.createTextNode(text));
  var swatch = document.createElement('span');
  swatch.style.backgroundColor = colorString(color);
  swatch.classList.add('swatch');
  document.body.append(swatch);
  document.body.append(document.createElement('br'));

};

var interval = window.setInterval(function() {
  run(index);
  index += 1;
  if (index > emoji.length) {
    window.clearInterval(interval);
  }
}, INTERVAL_DURATION);
