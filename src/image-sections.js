export default function imageSections(image, size) {
  const { width, height } = image;
  const results = [];

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      results.push({ x, y, size });
    }
  }

  return results;
}
