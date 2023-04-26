class ResumableInterval {
  constructor(intervalTime, callback) {
    this.interval = null;
    this.intervalTime = intervalTime;
    this.callback = callback;
  }

  start() {
    this.interval = setInterval(() => {
      this.callback();
    }, this.intervalTime);
  }

  pause() {
    clearInterval(this.interval);
  }

  resume() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.callback();
    }, this.intervalTime);
  }
}

export default ResumableInterval;
