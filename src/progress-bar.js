export default class ProgressBar {

  constructor(id, min, max) {
    this.min = min;
    this.max = max;
    this.node = document.getElementById(id);

    if (this.node === null) {
      this.node = document.createElement('div');
      this.node.setAttribute('id', id);
      this.container.append(this.node);
    }
  }

  update(value) {
    let percent = (value - this.min) / (this.max - this.min);
    percent = Math.max(0, Math.min(100, Math.ceil(percent * 100)));
    this.node.style.width = percent + '%';

    // All progress bars appear on top of each other.
    // This ensures that the longest bars are always below the shorter bars.
    this.node.style.zIndex = 100 - percent;
  }

  get container() {
    return document.getElementById('progress-bar-container');
  }
};
