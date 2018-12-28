export default function readImage(file) {
  return new Promise(function(resolve, reject) {
    var reader  = new FileReader();
    var image = new Image();

    image.onload = function() {
      resolve(image);
    };

    reader.onloadend = function() {
      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
};
