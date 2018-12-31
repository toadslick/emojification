import Task from './task';
import FormManager from './form-manager';
import buildImageSections from './image-sections';
import emojiList from './emoji-list';
import sampleCanvasSection from './sample-canvas-section';

const outputContainer = document.getElementById('output-container');
const emojiCanvas = document.getElementById('emoji-canvas');
const imageCanvas = document.getElementById('image-canvas');
const emojiContext = emojiCanvas.getContext('2d');
const imageContext = imageCanvas.getContext('2d');

new FormManager(start, stop);

function start(emojiSize, subdivisions, image) {
  stop();
  outputContainer.innerHTML = '';

  Promise.all([
    processEmoji(emojiList, emojiSize, subdivisions),
    processImage(image, emojiSize, subdivisions),
  ])
  .then(matchEmoji)
  .catch(err => console.log(err));
};

function stop() {
  Task.cancelAll();
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

function processImage(image, emojiSize, subdivisions) {
  const { width, height } = image;
  imageCanvas.width = width;
  imageCanvas.height = height;
  imageContext.drawImage(image, 0, 0, width, height);

  return new Task('process-image', buildImageSections(image, emojiSize), function({ x, y, size }) {
    const colors = sampleCanvasSection(imageContext, x, y, size, subdivisions);
    // Improve performance by caching the returned emoji for a given combination of color samples.
    // This helps when an image contains large areas of solid color.
    const cacheKey = colors.map(c => c.css).join('');
    return {
      x,
      y,
      colors,
      cacheKey,
    };
  }).promise;
};

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
};
