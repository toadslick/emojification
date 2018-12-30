import Task from './task';
import buildImageSections from './image-sections';
import emojiList from './emoji-list';
import sampleCanvasSection from './sample-canvas-section';
import readImageFile from './read-image-file';
import registerEvents from './register-events';

const emojiCanvas       = document.getElementById('emoji-canvas');
const imageCanvas       = document.getElementById('image-canvas');
const form              = document.getElementById('form');
const emojiSizeInput    = document.getElementById('input-emoji-size');
const sampleCountInput  = document.getElementById('input-sample-count');
const imageFileInput    = document.getElementById('input-image-file');
const outputContainer   = document.getElementById('output-container');
const cancelButton      = document.getElementById('cancel-button');

const emojiContext = emojiCanvas.getContext('2d');
const imageContext = imageCanvas.getContext('2d');

registerEvents([
  { element: form             , event: 'submit' , handler: formSubmitted            , propagate: false },
  { element: cancelButton     , event: 'click'  , handler: cancel                   , propagate: false },
  { element: emojiSizeInput   , event: 'change' , handler: updateEmojiSizeIndicator , propagate: true  },
  { element: sampleCountInput , event: 'change' , handler: updateSampleIndicator    , propagate: true  },
  { element: imageFileInput   , event: 'change' , handler: updateFileIndicator      , propagate: true  },
]);

function formSubmitted() {
  const emojiSize = parseInt(emojiSizeInput.value);
  const subdivisions = parseInt(sampleCountInput.value);
  const file = imageFileInput.files[0];
  if (file) {
    run(emojiSize, subdivisions, file);
  } else {
    console.log('Error: no file was provided.');
  }
};

function cancel() {
  Task.cancelAll();
};

function updateEmojiSizeIndicator(element) {
  console.log('TODO: display emoji size');
};

function updateSampleIndicator(element) {
  console.log('TODO: display sample size');
};

function updateFileIndicator(element) {
  console.log('TODO: display sample size');
};

function run(emojiSize, subdivisions, file) {
  cancel();
  outputContainer.innerHTML = '';

  Promise.all([
    processEmoji(emojiList, emojiSize, subdivisions),
    processImage(file, emojiSize, subdivisions),
  ])
  .then(matchEmoji)
  .catch(err => console.log(err));
};

function processEmoji(emojiArray, emojiSize, subdivisions) {
  emojiCanvas.setAttribute('height', emojiSize);
  emojiCanvas.setAttribute('width', emojiSize);
  emojiContext.font = emojiSize + 'px/1 "Apple Color Emoji"';
  emojiContext.textAlign = 'center';

  return new Task('process-emoji', emojiArray, function(emoji) {
    emojiContext.clearRect(0, 0, emojiSize, emojiSize);
    emojiContext.fillText(emoji, emojiSize / 2, emojiSize - (emojiSize * 0.05));
    const colors = sampleCanvasSection(emojiContext, 0, 0, emojiSize, subdivisions);
    return {
      string: emoji,
      colors
    };
  }).promise;
};

function processImage(file, emojiSize, subdivisions) {
  return readImageFile(file).then((image) => {
    const { width, height } = image;
    imageCanvas.width = width;
    imageCanvas.height = height;
    imageContext.drawImage(image, 0, 0, width, height);

    return new Task('process-image', buildImageSections(image, emojiSize), function({ x, y, size }) {
      const colors = sampleCanvasSection(imageContext, x, y, size, subdivisions);
      const cacheKey = colors.map(c => c.css).join('');
      return {
        x,
        y,
        colors,
        cacheKey,
      };
    }).promise;
  });
}

function matchEmoji([emojiSamples, imageSamples]) {
  let cache = {};

  return new Task('match-emoji', imageSamples, function(section) {
    let bestFitEmoji = null;
    let lowestDistance = Infinity;

    if (cache[section.cacheKey]) {
      bestFitEmoji = cache[section.cacheKey];
    } else {
      emojiSamples.forEach((emoji) => {
        let totalDistance = 0;
        emoji.colors.forEach((color, index) => {
          totalDistance += color.distance(section.colors[index]);
        });
        if (totalDistance < lowestDistance) {
          lowestDistance = totalDistance;
          bestFitEmoji = emoji;
        }
      });
      cache[section.cacheKey] = bestFitEmoji;
    }

    if (section.x == 0 && section.y != 0) {
      outputContainer.append(document.createElement('br'));
    }
    const span = document.createElement('span');
    span.append(document.createTextNode(bestFitEmoji.string));
    outputContainer.append(span);
  }).promise;
}
