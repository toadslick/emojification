import Color from './color';

export default function sampleCanvasSection(context2D, originX, originY, sectionSize, subdivisions) {
  const sampleSize = sectionSize / subdivisions;
  const results = [];

  for (let y = 0; y < subdivisions; y += 1) {
    for (let x = 0; x < subdivisions; x += 1) {
      results.push(
        Color.averageFromImageData(
          context2D.getImageData(
            originX + (x * sampleSize),
            originY + (y * sampleSize),
            sampleSize,
            sampleSize
      )));
    }
  }

  return results;
}
