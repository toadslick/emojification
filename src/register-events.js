export default function registerEvents(objects) {
  objects.forEach(function({ element, event, handler, propagate }) {
    element.addEventListener(event, function(e) {
      if (!propagate) { e.preventDefault(); }
      handler(element, e);
    });
  });
};
