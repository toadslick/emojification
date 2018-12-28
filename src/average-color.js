const ALPHA_THRESHOLD = 100;
const COLOR_PROPS = ['r', 'g', 'b', 'a'];

export default function averageColor(imageData) {
  const avgColor = {};
  const data = imageData.data;
  let pixelCount = 0;

  COLOR_PROPS.forEach(function(prop) {
    avgColor[prop] = 0;
  });

  for (var i = 0; i < data.length; i += COLOR_PROPS.length) {
    var pixelColor = {};
    COLOR_PROPS.forEach(function(prop, propIndex) {
      var n = data[i + propIndex];
      pixelColor[prop] = n * n;
    });
    if (pixelColor.a > ALPHA_THRESHOLD) {
      pixelCount += 1;
      COLOR_PROPS.forEach(function(prop) {
        avgColor[prop] += pixelColor[prop];
      });
    }
  }
  COLOR_PROPS.forEach(function(prop) {
    avgColor[prop] = Math.sqrt(avgColor[prop] / pixelCount);
  });

  return avgColor;
};
