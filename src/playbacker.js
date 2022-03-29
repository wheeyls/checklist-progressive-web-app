import { pubsub } from './pubsub';

class SpeechInstance {
  constructor({ phrase }) {
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.text = phrase;
    pubsub(this);
  }

  speak() {
    this.utterance.onend = (event) => {
      this.utterance.onend = undefined;

      this.emit('spoken');
      this.off();
    };

    window.speechSynthesis.speak(this.utterance);

    return this;
  }

  cancel() {
    this.utterance.onend = undefined;
    window.speechSynthesis.cancel();
    this.emit('canceled');
    this.off();

    return this;
  }
}

export function playbacker(currentSection) {
  let paused = true;
  let delay = 1000;
  let currentTimeout;
  let speechInstance;

  function speak(phrase) {
    speechInstance = new SpeechInstance({
      phrase
    });

    return speechInstance.speak();
  }

  function nextItem(count) {
    if (paused || !currentSection) {
      return;
    }

    if (speechInstance) {
      speechInstance.cancel();
    }

    const item = currentSection.nextItem();

    if (item) {
      speak(`${item.challenge}: ${item.response || ''}`);

      speechInstance.on('spoken', () => {
        item.toggle(true);

        currentTimeout = window.setTimeout(() => nextItem(count), delay);
      });

      speechInstance.on('canceled', () => {
        item.toggle(false);
      });
    } else {
      me.pause();
      speak('Checklist Complete');
    }
  }

  let count = 0;
  const me = pubsub({
    play() {
      me.pause();

      paused = false;
      me.emit('changed');
      nextItem((count += 1));
    },

    set(section) {
      if (section === currentSection) {
        return;
      }
      me.pause();

      currentSection = section;
    },

    next() {
      const item = currentSection.nextItem();

      if (item) {
        item.toggle(true);
      }
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

      me.emit('changed');
    },

    pause() {
      speechInstance && speechInstance.cancel();

      paused = true;
      me.emit('changed');
    }
  });

  return me;
}
