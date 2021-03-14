import { pubsub } from './pubsub';

export function playbacker(currentSection) {
  let paused = true;
  let delay = 1000;

  function speak(phrase) {
    return new Promise(function (resolve, reject) {
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

  function nextItem() {
    if (paused || !currentSection) {
      return;
    }

    const item = currentSection.nextItem();

    if (item) {
      speakItem(item)
        .then(() => {
          item.toggle(true);

          window.setTimeout(() => nextItem(), delay);
        })
        .catch((ended) => {
          item.toggle(false);
        });
    } else {
      me.pause();
    }
  }

  const me = pubsub({
    play() {
      me.pause();

      paused = false;
      me.emit('changed');
      nextItem();
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
      delay = Math.max(delay - 500, 0);
      me.emit('changed');
    },

    slower() {
      delay = Math.min(delay + 500, 15000);
      me.emit('changed');
    },

    delay() {
      return delay;
    },

    setDelay(value) {
      delay = value;
      me.emit('changed');
    },

    pause() {
      paused = true;
      me.emit('changed');
      window.speechSynthesis.cancel();
    }
  });

  return me;
}
