import ProgressBar from './progress-bar';

export default class IterativeTask {
  constructor(name, items, task) {

    return new Promise(function(resolve, reject) {
      const progressBar = new ProgressBar(name, 0, items.length);
      const results = [];
      let index = 0;

      const interval = window.setInterval(function() {
        results.push(task(items[index]));
        index += 1;
        progressBar.update(index);
        if (index >= items.length) {
          window.clearInterval(interval);
          resolve(results);
        }
      }, 0);
    });
  }
}
