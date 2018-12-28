var EMOJI_SIZE = 50;
var EMOJI_HEIGHT = EMOJI_SIZE;
var EMOJI_WIDTH = EMOJI_SIZE;

var INTERVAL_DURATION = 0;
var ALPHA_THRESHOLD = 100;
var EMOJI_SUBDIVISIONS = 2;

var colorProps = ['r', 'g', 'b', 'a'];

var emojiCanvas = document.getElementById('emoji-canvas');
var imageCanvas = document.getElementById('image-canvas');
var emojiProgressBar = document.getElementById('emoji-progress');
var imageProgressBar = document.getElementById('image-progress');

var emojiContext = emojiCanvas.getContext('2d');
var imageContext = imageCanvas.getContext('2d');

emojiCanvas.setAttribute('height', EMOJI_HEIGHT);
emojiCanvas.setAttribute('width', EMOJI_WIDTH);
emojiContext.font = EMOJI_SIZE + 'px/1 system';
emojiContext.textAlign = 'center';

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

var updateProgressBar = function(node, current, max) {
  node.style.width = Math.ceil((current / max) * 100) + '%';
};

var colorString = function(color) {
  let values = colorProps.map(function(prop) {
    return Math.floor(color[prop]);
  });
  values[3] = values[3] / 255;
  return 'rgba(' + values.join(',') + ')';
};

var sampleColorsForEmoji = function(emoji) {
  var sectionColors = [];
  emojiContext.clearRect(0, 0, EMOJI_WIDTH, EMOJI_HEIGHT);
  emojiContext.fillText(emoji, EMOJI_WIDTH / 2, EMOJI_SIZE - (EMOJI_SIZE * 0.05));

  var sectionWidth = EMOJI_WIDTH / EMOJI_SUBDIVISIONS;
  var sectionHeight = EMOJI_HEIGHT / EMOJI_SUBDIVISIONS;

  for (var y = 0; y < EMOJI_SUBDIVISIONS; y += 1) {
    for (var x = 0; x < EMOJI_SUBDIVISIONS; x += 1) {
      var data = emojiContext.getImageData(x * sectionWidth, y * sectionHeight, sectionWidth, sectionHeight);
      sectionColors.push(averageColor(data));
    }
  }

  return sectionColors;
};


var processAllEmoji = new Promise(function(resolve, reject) {
  var index = 0;
  var results = [];
  var emojiCount = window.emoji.length;
  var interval = window.setInterval(function() {
    if (index >= emojiCount) {
      window.clearInterval(interval);
      resolve(results);
    } else {
      var currentEmoji = window.emoji[index];
      var colors = sampleColorsForEmoji(currentEmoji);
      results.push({
        string: currentEmoji,
        colors: colors,
      });
      updateProgressBar(emojiProgressBar, index, emojiCount);
      index += 1;
    }
  }, INTERVAL_DURATION);
});

// var processImage = Promise.new(function(resolve, reject) {
//   var interval = window.setInterval(function() {
//     run(index);
//     index += 1;
//     if (index > emoji.length) {
//       window.clearInterval(interval);
//       resolve();
//     }
//   }, INTERVAL_DURATION);
// });

Promise.all([
  processAllEmoji,
  // processImage,
]).then(function(results) {
  console.log('sampling completed!', results);
});
