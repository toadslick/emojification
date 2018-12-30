import ProgressBar from './progress-bar';

class Task {
  // name
  // promise
  // interval
  // reject
  // cancel()

  constructor(name, items, task, delay) {
    this.name = name;

    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;

      const progressBar = new ProgressBar(name, 0, items.length);
      const results = [];
      let index = 0;

      this.interval = window.setInterval(() => {
        results.push(task(items[index]));
        index += 1;
        progressBar.update(index);
        if (index >= items.length) {
          window.clearInterval(this.interval);
          resolve(results);
        }
      }, delay || 0);
    });

    Task.all.push(this);
  }

  cancel() {
    window.clearInterval(this.interval);
    this.reject(`Task was cancelled: "${this.name}"`);
  }

  static cancelAll() {
    const { all } = Task;
    while (all.length > 0) {
      all.pop().cancel();
    }
    ProgressBar.clearAll();
  }
}

Task.all = [];

export default Task;
