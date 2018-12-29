import { rgba_to_lab } from 'color-diff/lib/convert';
import { ciede2000 } from 'color-diff/lib/diff';

const ALPHA_THRESHOLD = 100;
const CHANNELS = ['R', 'G', 'B', 'A'];

const privateRGBA = Symbol('rgba');
const privateLAB = Symbol('lab');
const privateCSS = Symbol('css');

function cssString(rgba) {
  let values = CHANNELS.map(function(prop) {
    return Math.round(rgba[prop]);
  });
  values[3] = Math.round((values[3] / 255) * 100) / 100;
  return 'rgba(' + values.join(',') + ')';
}

export default class Color {

  constructor(rgba) {
    this[privateRGBA] = rgba;
    this[privateLAB] = rgba_to_lab(rgba);
    this[privateCSS] = cssString(rgba);
  }

  get rgba() { return this[privateRGBA]; }
  get lab() { return this[privateLAB]; }
  get css() { return this[privateCSS]; }

  distance(color) {
    return ciede2000(this.lab, color.lab);
  }


  static averageFromImageData({ data }) {
    const averageRGBA = {};
    let includedPixelCount = 0;

    CHANNELS.forEach(function(prop) {
      averageRGBA[prop] = 0;
    });

    for (let i = 0; i < data.length; i += CHANNELS.length) {
      const pixelRGBA = {};
      CHANNELS.forEach(function(prop, propIndex) {
        const n = data[i + propIndex];
        pixelRGBA[prop] = n * n;
      });
      if (pixelRGBA.A > ALPHA_THRESHOLD) {
        includedPixelCount += 1;
        CHANNELS.forEach(function(prop) {
          averageRGBA[prop] += pixelRGBA[prop];
        });
      }
    }
    CHANNELS.forEach(function(prop) {
      averageRGBA[prop] = Math.sqrt(averageRGBA[prop] / includedPixelCount);
    });

    return new Color(averageRGBA);
  }
};
