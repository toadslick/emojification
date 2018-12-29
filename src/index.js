import IterativeTask from './iterative-task';
import buildImageSections from './image-sections';
import emojiList from './emoji-list';
import sampleCanvasSection from './sample-canvas-section';
import readImageFile from './read-image-file';

const emojiCanvas       = document.getElementById('emoji-canvas');
const imageCanvas       = document.getElementById('image-canvas');
const form              = document.getElementById('form');
const emojiSizeInput    = document.getElementById('input-emoji-size');
const sampleCountInput  = document.getElementById('input-sample-count');
const imageFileInput    = document.getElementById('input-image-file');
const outputContainer   = document.getElementById('output-container');
const progressContainer = document.getElementById('progress-bar-container');
const cancelButton      = document.getElementById('cancel-button');

const emojiContext = emojiCanvas.getContext('2d');
const imageContext = imageCanvas.getContext('2d');

const tasks = [];

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const emojiSize = parseInt(emojiSizeInput.value);
  const subdivisions = parseInt(sampleCountInput.value);
  const file = imageFileInput.files[0];
  if (file) {
    run(emojiSize, subdivisions, file);
  } else {
    console.log('Error: no file was provided.');
  }
});

cancelButton.addEventListener('click', function(e) {
  e.preventDefault();
  cancel();
});

function run(emojiSize, subdivisions, file) {
  cancel();
  outputContainer.innerHTML = '';
  progressContainer.innerHTML = '';

  Promise.all([
    processEmoji(emojiList, emojiSize, subdivisions),
    processImage(file, emojiSize, subdivisions),
  ])
  .then(matchEmoji)
  .catch(err => console.log(err));
};

function cancel() {
  while (tasks.length > 0) {
    tasks.pop().cancel();
  }
}

function processEmoji(emojiArray, emojiSize, subdivisions) {
  emojiCanvas.setAttribute('height', emojiSize);
  emojiCanvas.setAttribute('width', emojiSize);
  emojiContext.font = emojiSize + 'px/1 "Apple Color Emoji"';
  emojiContext.textAlign = 'center';

  const task = new IterativeTask('process-emoji', emojiArray, function(emoji) {
    emojiContext.clearRect(0, 0, emojiSize, emojiSize);
    emojiContext.fillText(emoji, emojiSize / 2, emojiSize - (emojiSize * 0.05));
    const colors = sampleCanvasSection(emojiContext, 0, 0, emojiSize, subdivisions);
    return {
      string: emoji,
      colors
    };
  });

  tasks.push(task);
  return task.promise;
};

function processImage(file, emojiSize, subdivisions) {
  return readImageFile(file).then((image) => {
    const { width, height } = image;
    imageCanvas.width = width;
    imageCanvas.height = height;
    imageContext.drawImage(image, 0, 0, width, height);

    const task = new IterativeTask('process-image', buildImageSections(image, emojiSize), function({ x, y, size }) {
      const colors = sampleCanvasSection(imageContext, x, y, size, subdivisions);
      const cacheKey = colors.map(c => c.css).join('');
      return {
        x,
        y,
        colors,
        cacheKey,
      };
    });

    tasks.push(task);
    return task.promise;
  });
}

function matchEmoji([emojiSamples, imageSamples]) {
  let cache = {};

  const task = new IterativeTask('match-emoji', imageSamples, function(section) {
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
  });

  tasks.push(task);
  return task.promise;
}
