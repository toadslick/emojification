import ProgressBar from './progress-bar';
import IterativeTask from './iterative-task';
import emojiList from './emoji-list';
import sampleCanvasSection from './sample-canvas-section';

var EMOJI_SIZE = 50;
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

function processEmoji(emojiArray) {
  return new IterativeTask('process-emoji', emojiArray, function(emoji) {
    emojiContext.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
    emojiContext.fillText(emoji, EMOJI_SIZE / 2, EMOJI_SIZE - (EMOJI_SIZE * 0.05));
    return {
      string: emoji,
      colors: sampleCanvasSection(emojiContext, 0, 0, EMOJI_SIZE, SUBDIVISIONS),
    };
  });
};

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
  processEmoji(emojiList),
  // processImage,
]).then(function(results) {
  console.log('sampling completed!', arguments);
});
