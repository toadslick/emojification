const ALPHA_THRESHOLD = 100;
const CHANNELS = ['r', 'g', 'b', 'a'];

export default class Color {
  constructor(r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 0;
  }

  static averageFromImageData({ data }) {
    const averageColor = new Color();
    let includedPixelCount = 0;

    for (let i = 0; i < data.length; i += CHANNELS.length) {
      const pixelColor = {};
      CHANNELS.forEach(function(prop, propIndex) {
        const n = data[i + propIndex];
        pixelColor[prop] = n * n;
      });
      if (pixelColor.a > ALPHA_THRESHOLD) {
        includedPixelCount += 1;
        CHANNELS.forEach(function(prop) {
          averageColor[prop] += pixelColor[prop];
        });
      }
    }
    CHANNELS.forEach(function(prop) {
      averageColor[prop] = Math.sqrt(averageColor[prop] / includedPixelCount);
    });

    return averageColor;
  }

  get cssString() {
    let values = CHANNELS.map(function(prop) {
      return Math.floor(this[prop]);
    });
    values[3] = values[3] / 255;
    return 'rgba(' + values.join(',') + ')';
  };
};
