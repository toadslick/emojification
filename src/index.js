import IterativeTask from './iterative-task';
import buildImageSections from './image-sections';
import emojiList from './emoji-list';
import sampleCanvasSection from './sample-canvas-section';
import readImageFile from './read-image-file';

const emojiCanvas       = document.getElementById('emoji-canvas'      );
const imageCanvas       = document.getElementById('image-canvas'      );
const form              = document.getElementById('form'              );
const emojiSizeInput    = document.getElementById('input-emoji-size'  );
const sampleCountInput  = document.getElementById('input-sample-count');
const imageFileInput    = document.getElementById('input-image-file'  );

const emojiContext = emojiCanvas.getContext('2d');
const imageContext = imageCanvas.getContext('2d');

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

function run(emojiSize, subdivisions, file) {
  Promise.all([
    processEmoji(emojiList, emojiSize, subdivisions),
    processImage(file, emojiSize, subdivisions),
  ]).then(function([emojiSamples, imageSamples]) {
    return matchEmoji(emojiSamples, imageSamples);
  }).then(function(results) {
    console.log('RESULTS', results);
  });
};

function processEmoji(emojiArray, emojiSize, subdivisions) {
  emojiCanvas.setAttribute('height', emojiSize);
  emojiCanvas.setAttribute('width', emojiSize);
  emojiContext.font = emojiSize + 'px/1 system';
  emojiContext.textAlign = 'center';

  return new IterativeTask('process-emoji', emojiArray, function(emoji) {
    emojiContext.clearRect(0, 0, emojiSize, emojiSize);
    emojiContext.fillText(emoji, emojiSize / 2, emojiSize - (emojiSize * 0.05));
    const colors = sampleCanvasSection(emojiContext, 0, 0, emojiSize, subdivisions);
    return {
      string: emoji,
      colors
    };
  });
};

function processImage(file, emojiSize, subdivisions) {
  return readImageFile(file).then((image) => {
    const { width, height } = image;
    imageCanvas.width = width;
    imageCanvas.height = height;
    imageContext.drawImage(image, 0, 0, width, height);
    return new IterativeTask('process-image', buildImageSections(image, emojiSize), function({ x, y, size }) {
      const colors = sampleCanvasSection(imageContext, x, y, size, subdivisions);
      return {
        x,
        y,
        colors
      };
    });
  });
}

function matchEmoji(emojiSamples, imageSamples) {
  return new IterativeTask('match-emoji', imageSamples, function(section) {

    let result = {
      section: section,
      emoji: null,
    }
    let lowestDistance = Infinity;

    emojiSamples.forEach((emoji) => {
      let totalDistance = 0;
      emoji.colors.forEach((color, index) => {
        totalDistance += color.distance(section.colors[index]);
      });
      if (totalDistance < lowestDistance) {
        lowestDistance = totalDistance;
        result.emoji = emoji;
      }
    });

    return result;
  });
}
