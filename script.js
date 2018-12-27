var EMOJI_SIZE = 50;
var EMOJI_HEIGHT = EMOJI_SIZE;
var EMOJI_WIDTH = EMOJI_SIZE;

var INTERVAL_DURATION = 10;
var ALPHA_THRESHOLD = 100;
var EMOJI_SUBDIVISIONS = 2;

var index = 0;
var emoji = window.emoji;
var colorProps = ['r', 'g', 'b', 'a'];

var isPaused = false;
var body = document.body;
body.addEventListener('click', function() {
  isPaused = !isPaused;
});

var canvas = document.getElementById('sprite-canvas');
canvas.setAttribute('height', EMOJI_HEIGHT);
canvas.setAttribute('width', EMOJI_WIDTH);
var context = canvas.getContext('2d');
context.font = EMOJI_SIZE + 'px/1 system';
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
    if (pixelColor.a > ALPHA_THRESHOLD) {
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
    return Math.floor(color[prop]);
  });
  values[3] = values[3] / 255;
  return 'rgba(' + values.join(',') + ')';
};

var renderSample = function(emojiString, colors) {
  var container = document.createElement('div');
  container.classList.add('sample');
  var emoji = document.createElement('div');
  emoji.classList.add('sample-emoji');
  emoji.append(document.createTextNode(emojiString));
  container.append(emoji);
  colors.forEach(function(color) {
    var swatch = document.createElement('div');
    swatch.style.backgroundColor = colorString(color);
    swatch.classList.add('sample-swatch');
    container.append(swatch);
    container.append(document.createTextNode(' '));
  });
  body.append(container);
}

var run = function(i) {
  var sectionColors = [];
  var text = window.emoji[i];
  context.clearRect(0, 0, EMOJI_WIDTH, EMOJI_HEIGHT);
  context.fillText(text, EMOJI_WIDTH / 2, EMOJI_SIZE - (EMOJI_SIZE * 0.05));

  var sectionWidth = EMOJI_WIDTH / EMOJI_SUBDIVISIONS;
  var sectionHeight = EMOJI_HEIGHT / EMOJI_SUBDIVISIONS;

  for (var y = 0; y < EMOJI_SUBDIVISIONS; y += 1) {
    for (var x = 0; x < EMOJI_SUBDIVISIONS; x += 1) {
      var data = context.getImageData(x * sectionWidth, y * sectionHeight, sectionWidth, sectionHeight);
      sectionColors.push(averageColor(data));
    }
  }

  renderSample(text, sectionColors);
};

var interval = window.setInterval(function() {
  if (isPaused) { return; }
  run(index);
  index += 1;
  if (index > emoji.length) {
    window.clearInterval(interval);
  }
}, INTERVAL_DURATION);
