var FONT_SIZE = 20;
var EMOJI_HEIGHT = FONT_SIZE * 1.1;
var EMOJI_WIDTH = FONT_SIZE * 1.1;

var INTERVAL_DURATION = 10;
var TRANSPARENCY_THRESHOLD = 100;
var SUBDIVISIONS = 3;

var index = 0;
var emoji = window.emoji;
var colorProps = ['r', 'g', 'b', 'a'];
var body = document.body;

var canvas = document.getElementById('sprite-canvas');
canvas.setAttribute('height', EMOJI_HEIGHT);
canvas.setAttribute('width', EMOJI_WIDTH);
var context = canvas.getContext('2d');
context.font = FONT_SIZE + 'px/1 sans-serif';
context.textAlign = 'center';

var averageColor = function(imageData) {
  var pixelCount = 0;
  var avgColor = { r: 0, g: 0, b: 0, a: 0 };
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var pixelColor = {};
    colorProps.forEach(function(prop, propIndex) {
      var n = data[i + propIndex];
      pixelColor[prop] = n * n;
    });
    if (pixelColor.a > TRANSPARENCY_THRESHOLD) {
      pixelCount += 1;
      colorProps.forEach(function(prop) {
        avgColor[prop] += pixelColor[prop];
      });
    }
  }
  colorProps.forEach(function(prop) {
    avgColor[prop] = Math.sqrt(avgColor[prop] / pixelCount);
  });
  return avgColor;
};

var colorString = function(color) {
  let values = colorProps.map(function(prop) {
    return color[prop];
  });
  values[3] = values[3] / 255;
  return 'rgba(' + values.join(',') + ')';
};

var run = function(i) {
  var sectionColors = [];
  var text = window.emoji[i];
  context.clearRect(0, 0, EMOJI_WIDTH, EMOJI_HEIGHT);
  context.fillText(text, EMOJI_WIDTH / 2, FONT_SIZE);

  var sectionWidth = EMOJI_WIDTH / SUBDIVISIONS;
  var sectionHeight = EMOJI_HEIGHT / SUBDIVISIONS;

  for (var y = 0; y < SUBDIVISIONS; y += 1) {
    for (var x = 0; x < SUBDIVISIONS; x += 1) {
      var data = context.getImageData(x * sectionWidth, y * sectionHeight, sectionWidth, sectionHeight);
      sectionColors.push(averageColor(data));
    }
  }

  body.append(document.createTextNode(text));
  sectionColors.forEach(function(color) {
    var swatch = document.createElement('span');
    swatch.style.backgroundColor = colorString(color);
    swatch.classList.add('swatch');
    body.append(swatch);
    body.append(document.createTextNode(' '));
  });
  body.append(document.createElement('br'));
};

var interval = window.setInterval(function() {
  run(index);
  index += 1;
  if (index > emoji.length) {
    window.clearInterval(interval);
  }
}, INTERVAL_DURATION);
