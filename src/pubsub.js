// Bare bones, fast publish subscribe. Will return an object that lets you drive
// the events; you can also pass in an object that will be augmented with the functions
// directly.

// EXAMPLE
// var my_events = pubsub();
//
// fn = function(value) { alert(value); }
// my_events.on("echo", fn);
// my_events.on("echo", fn);
//
// my_events.emit("echo", ["hello!"]); // hello! hello!
// my_events.off("echo", fn);
// my_events.emit("echo", ["hello!"]); // ...

export function pubsub(subject = {}) {
  let functions = {};

  function postProcess(fn) {
    if (fn._pubsubAfterEmit && typeof fn._pubsubAfterEmit === 'function') {
      fn._pubsubAfterEmit();
    }
  }

  subject.on = function(topic, callback) {
    if (!callback || typeof callback !== 'function') {
      return;
    }

    if (!functions[topic]) {
      functions[topic] = [];
    }
    functions[topic].push(callback);

    return subject;
  };

  subject.once = function(topic, callback) {
    callback._pubsubAfterEmit = () => {
      subject.off(topic, callback);
    };

    return subject.on(topic, callback);
  };

  subject.emit = function(topic, args) {
    if (!functions[topic]) {
      return;
    }

    for (let fn of functions[topic].slice(0)) {
      fn.apply(subject, args || []);
      postProcess(fn);
    }

    return subject;
  };

  subject.off = function(topic, func) {
    if (!topic) {
      functions = {};
    } else if (!func) {
      functions[topic] = [];
    } else if (functions[topic]) {
      for (let i = 0; i < functions[topic].length; i++) {
        const fn = functions[topic][i];
        if (fn === func) {
          functions[topic].splice(i, 1);
        }
      }
    }

    return subject;
  };

  return subject;
}
