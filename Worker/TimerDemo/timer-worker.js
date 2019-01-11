function TimerWorker() {
  const TIMER_WORKER_SOURCE = `
    var timerIds = {},
    timers = {};
    timers.setInterval = function(args) {
        timerIds[args.timerId] = setInterval(function(){
            postMessage(args)
        }, args.delay);
    };
    timers.clearInterval = function(args) {
        clearInterval(timerIds[args]);
    };
    timers.setTimeout = function(args) {
        timerIds[args.timerId] = setTimeout(function() { 
            postMessage(args); 
        }, args.delay);
    };
    timers.clearTimeout = function(args) {
        clearTimeout(timerIds[args]);
    };
    onmessage = function(e) {
        timers[e.data.type](e.data);
    };
  `;

  const blob = new Blob([TIMER_WORKER_SOURCE], {
    type: "application/javascript; charset=utf-8"
  });

  let timerId = 0;
  let callbacks = {};
  let timerWorker = new Worker(URL.createObjectURL(blob));

  timerWorker.onmessage = e => {
    if (callbacks[e.data.timerId]) {
      callbacks[e.data.timerId].callback.apply(
        null,
        callbacks[e.data.timerId].params
      );
    }
  };

  return {
    setTimer: (...args) => {
      const [type, callback, delay, ...others] = args;

      timerId++;
      timerWorker.postMessage({
        type,
        timerId,
        delay
      });
      callbacks[timerId] = { callback, params: others };

      return timerId;
    },
    clearTimer(type, timerId) {
      timerWorker.postMessage({
        type,
        timerId
      });
      callbacks[timerId] = null;
    },
    setInterval(...args) {
      return this.setTimer("setInterval", ...args);
    },
    setTimeout(...args) {
      return this.setTimer("setTimeout", ...args);
    },
    clearInterval(timerId) {
      this.clearTimer("clearInterval", timerId);
    },
    clearTimeout(timerId) {
      this.clearTimer("clearTimeout", timerId);
    }
  };
}

const Timer = TimerWorker();

// export default Timer;
window.Timer = Timer;
