import emojiList from './emoji-list';
import ProgressBar from './progress-bar';

var EMOJI_SIZE = 50;
var INTERVAL_DURATION = 0;
var ALPHA_THRESHOLD = 100;
var SUBDIVISIONS = 2;

var sampleSize = EMOJI_SIZE / SUBDIVISIONS;
var colorProps = ['r', 'g', 'b', 'a'];

var image = document.getElementById('sample-image');
var emojiCanvas = document.getElementById('emoji-canvas');
var imageCanvas = document.getElementById('image-canvas');

var emojiContext = emojiCanvas.getContext('2d');
var imageContext = imageCanvas.getContext('2d');

emojiCanvas.setAttribute('height', EMOJI_SIZE);
emojiCanvas.setAttribute('width', EMOJI_SIZE);
emojiContext.font = EMOJI_SIZE + 'px/1 system';
emojiContext.textAlign = 'center';

// imageCanvas.setAttribute('height', image.height);
// imageCanvas.setAttribute('width', image.width);
// imageContext.drawImage(image, 0, 0);

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

var sampleColorsForEmoji = function(emoji) {
  emojiContext.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
  emojiContext.fillText(emoji, EMOJI_SIZE / 2, EMOJI_SIZE - (EMOJI_SIZE * 0.05));
  return sampleColorsForSection(emojiContext, 0, 0);
};

var sampleColorsForSection = function(context, originX, originY) {
  var colors = [];
  for (var y = 0; y < SUBDIVISIONS; y += 1) {
    for (var x = 0; x < SUBDIVISIONS; x += 1) {
      var data = context.getImageData(
        originX + (x * sampleSize),
        originY + (y * sampleSize),
        sampleSize,
        sampleSize
      );

      colors.push(averageColor(data));
    }
  }
  return colors;
}

var processAllEmoji = new Promise(function(resolve, reject) {
  var progressBar = new ProgressBar('emoji-progress', 0, emojiList.length);
  var index = 0;
  var results = [];
  var interval = window.setInterval(function() {
    if (index >= emojiList.length) {
      window.clearInterval(interval);
      resolve(results);
    } else {
      var currentEmoji = emojiList[index];
      results.push({
        string: currentEmoji,
        colors: sampleColorsForEmoji(currentEmoji),
      });
      progressBar.update(index);
      index += 1;
    }
  }, INTERVAL_DURATION);
});
//
// var processImage = new Promise(function(resolve, reject) {
//   var x = 0;
//   var y = 0;
//   var totalSections = Math.ceil(image.width / EMOJI_SIZE) * Math.ceil(image.height / EMOJI_SIZE);
//   var results = [];
//   var interval = window.setInterval(function() {
//     if (y > image.height) {
//       window.clearInterval(interval);
//       resolve(results);
//     } else {
//       results.push({
//         x: x,
//         y: y,
//         colors: sampleColorsForSection(imageContext, x, y),
//       });
//       updateProgressBar(imageProgressBar, (x * y) + x, totalSections);
//       x += EMOJI_SIZE;
//       if (x > image.width) {
//         x = 0;
//         y += EMOJI_SIZE;
//       }
//     }
//   }, INTERVAL_DURATION);
// });

Promise.all([
  processAllEmoji,
  // processImage,
]).then(function(results) {
  console.log('sampling completed!', arguments);
});
