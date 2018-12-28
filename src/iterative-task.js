export default class IterativeTask {
  constructor(task) {

    return new Promise(function (resolve, reject) {

      const completionCallback = function(interval, result) {
        console.log('finish', arguments)
        window.clearInterval(interval);
        resolve(result);
      }

      const interval = window.setInterval(function() {
        task(completionCallback.bind(this, interval));
      }, 0);
    });
  }
}
