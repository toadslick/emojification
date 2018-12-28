import IterativeTask from './iterative-task';
import emojiList from './emoji-list';
import sampleCanvasSection from './sample-canvas-section';

const emojiCanvas       = document.getElementById('emoji-canvas'      );
const imageCanvas       = document.getElementById('image-canvas'      );
const form              = document.getElementById('form'              );
const emojiSizeInput    = document.getElementById('input-emoji-size'  );
const sampleCountInput  = document.getElementById('input-sample-count');
const imageFileInput    = document.getElementById('input-image-file'  );

const emojiContext = emojiCanvas.getContext('2d');
// const imageContext = imageCanvas.getContext('2d');
// imageContext.textAlign = 'center';

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const emojiSize = parseInt(emojiSizeInput.value);
  const subdivisions = parseInt(sampleCountInput.value);
  run(emojiSize, subdivisions);
});

function run(emojiSize, subdivisions) {
  emojiCanvas.setAttribute('height', emojiSize);
  emojiCanvas.setAttribute('width', emojiSize);
  emojiContext.font = emojiSize + 'px/1 system';
  emojiContext.textAlign = 'center';

  Promise.all([
    processEmoji(emojiList, emojiSize, subdivisions),
    // processImage,
  ]).then(function(results) {
    console.log('sampling completed!', arguments);
  });
};

function processEmoji(emojiArray, emojiSize, subdivisions) {
  return new IterativeTask('process-emoji', emojiArray, function(emoji) {
    emojiContext.clearRect(0, 0, emojiSize, emojiSize);
    emojiContext.fillText(emoji, emojiSize / 2, emojiSize - (emojiSize * 0.05));
    return {
      string: emoji,
      colors: sampleCanvasSection(emojiContext, 0, 0, emojiSize, subdivisions),
    };
  });
};






//
// var processImage = new Promise(function(resolve, reject) {
//   var x = 0;
//   var y = 0;
//   var totalSections = Math.ceil(image.width / emojiSize) * Math.ceil(image.height / emojiSize);
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
//       x += emojiSize;
//       if (x > image.width) {
//         x = 0;
//         y += emojiSize;
//       }
//     }
//   }, INTERVAL_DURATION);
// });
