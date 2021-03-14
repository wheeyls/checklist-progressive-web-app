import { pubsub } from './pubsub';

export function playbacker(currentSection) {
  let paused = true;
  let delay = 1000;
  let currentTimeout;
  const bus = pubsub();

  bus.on('cancel', () => {
    window.speechSynthesis.cancel();
    window.clearTimeout(currentTimeout);
  });

  function speak(phrase) {
    return new Promise(function (resolve, reject) {
      bus.on('cancel', reject);

      if (phrase == null || phrase == '') {
        return resolve();
      }

      let utterance = new SpeechSynthesisUtterance();
      utterance.text = phrase;

      utterance.onend = (event) => {
        utterance.onend = undefined;

        if (paused) {
          reject();
        } else {
          resolve();
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  function speakItem(item) {
    return speak(`${item.challenge}: ${item.response || ''}`);
  }

  function nextItem(count) {
    if (paused || !currentSection) {
      return;
    }

    bus.emit('cancel');

    const item = currentSection.nextItem();

    if (item) {
      speakItem(item)
        .then(() => {
          item.toggle(true);

          currentTimeout = window.setTimeout(() => nextItem(count), delay);
        })
        .catch(() => {
          item.toggle(false);
        });
    } else {
      me.pause();
    }
  }

  let count = 0;
  const me = pubsub({
    play() {
      me.pause();

      paused = false;
      me.emit('changed');
      nextItem(count += 1);
    },

    set(section) {
      if (section === currentSection) {
        return;
      }
      me.pause();

      currentSection = section;
    },

    paused() {
      return paused;
    },

    faster() {
      me.setDelay(Math.max(delay - 500, 0));
    },

    slower() {
      me.setDelay(Math.min(delay + 500, 15000));
    },

    delay() {
      return delay;
    },

    setDelay(value) {
      delay = value;

      if (!paused) {
        me.play();
      }
    },

    pause() {
      paused = true;
      me.emit('changed');
    }
  });

  return me;
}
