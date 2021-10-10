import { pubsub } from './pubsub';

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

class Timer {
  constructor(timeInMS) {
    this.timeInMS = timeInMS;
    this.timerId = null;

    pubsub(this);
    window.setInterval(() => {
      if (this.running) {
        this.emit('tick', [this.current()]);
      }
    }, 1000);
  }

  onComplete(fn) {
    this.on('complete', fn);
  }

  onTick(fn) {
    this.on('tick', fn);
  }

  current() {
    if (!this.running) {
      return '00:00';
    }

    return millisToMinutesAndSeconds(this.end.getTime() - new Date().getTime());
  }

  start() {
    this.stop();
    this.end = new Date(new Date().getTime() + this.timeInMS);

    this.timerId = window.setTimeout(() => {
      this.emit('complete');
      this.stop();
    }, this.timeInMS);

    this.running = true;
  }

  stop() {
    window.clearTimeout(this.timerId);
    this.running = false;
  }
}

export class ChecklistItem {
  constructor({ challenge, response = null, completed = false }) {
    this.challenge = challenge;
    this.response = response;
    this.completed = completed;

    pubsub(this);
  }

  toggle(value) {
    if (value === undefined) {
      this.completed = !this.completed;
    } else {
      this.completed = value;
    }

    this.emit('item:changed', [this]);
  }

  setResponse(value) {
    this.response = value;
  }

  toMarkdown() {
    if (this.response) {
      return `- ${this.challenge}
  - ${this.response}`;
    } else {
      return `- ${this.challenge}`;
    }
  }
}

export class ChecklistTimerItem extends ChecklistItem {
  constructor({ challenge, response = null, completed = false }) {
    super({ challenge, response, completed });

    this.challenge = "Set timer"

    this.on('item:changed', (item) => {
      if (item.completed) {
        this.timer.start();
      } else {
        this.timer.stop();
      }
    });
  }

  setResponse(value) {
    this.response = value;
    this.minutes = parseInt(value, 10);
    this.timer = new Timer(this.minutes * 60 * 1000);
  }

  toMarkdown() {
    return `- !Timer
  - ${this.response}`;
  }
}

export class ChecklistSection {
  constructor({ title, items = [] }) {
    this.title = title;
    this.items = items;
    pubsub(this);
  }

  add(item) {
    item.on('item:changed', (item) => {
      this.emit('item:changed', [item]);
    });

    this.items.push(item);
  }

  reset() {
    this.items.forEach((i) => i.toggle(false));
  }

  nextItem() {
    return this.items.find((i) => !i.completed);
  }

  toMarkdown() {
    const itemMarkdown = this.items.map((i) => i.toMarkdown());

    return `## ${this.title}

${itemMarkdown.join('\n')}`;
  }
}

export class Checklist {
  constructor({ title, sections = [] }) {
    this.title = title;
    this.sections = sections;
    pubsub(this);
  }

  add(section) {
    section.on('item:changed', (item) => {
      this.emit('item:changed', [item]);
      this.emit('changed', [this]);
    });

    this.sections.push(section);
  }

  toMarkdown() {
    const sectionMarkdown = this.sections.map((i) => i.toMarkdown());
    return `# ${this.title}

${sectionMarkdown.join('\n\n')}`;
  }

  static fromMarkdown(md) {
    return parseMarkdown(md);
  }
}

const CHECKLIST_TITLE = 0;
const SECTION_TITLE = 1;
const ITEM_CHALLENGE = 2;
const ITEM_RESPONSE = 3;
const TIMER_ITEM_CHALLENGE = 4;

function buildIterator(array) {
  const list = array.slice();

  return {
    next: () => {
      let item, currentMatch;
      const line = list.shift();

      if (!line) {
        return;
      }

      if ((currentMatch = line.match(/^# (.*)$/))) {
        item = { type: CHECKLIST_TITLE, value: currentMatch[1] };
      } else if ((currentMatch = line.match(/^## (.*)$/))) {
        item = { type: SECTION_TITLE, value: currentMatch[1] };
      } else if ((currentMatch = line.match(/^- !Timer$/))) {
        item = { type: TIMER_ITEM_CHALLENGE, value: currentMatch[1] };
      } else if ((currentMatch = line.match(/^- (.*)$/))) {
        item = { type: ITEM_CHALLENGE, value: currentMatch[1] };
      } else if ((currentMatch = line.match(/^  - (.*)$/))) {
        item = { type: ITEM_RESPONSE, value: currentMatch[1] };
      }

      return item;
    },

    done: () => {
      list.length < 1;
    }
  };
}

function parseMarkdown(md) {
  const lines = buildIterator(md.split('\n').filter((i) => i));

  let checklist = null;
  let section = null;
  let item = null;
  let currentMatch = null;
  let line = null;

  while ((line = lines.next())) {
    if (line.type === CHECKLIST_TITLE) {
      checklist = new Checklist({ title: line.value });
    } else if (line.type === SECTION_TITLE) {
      section = new ChecklistSection({ title: line.value });
      checklist.add(section);
    } else if (line.type === TIMER_ITEM_CHALLENGE) {
      item = new ChecklistTimerItem({ challenge: line.value });
      section.add(item);
    } else if (line.type === ITEM_CHALLENGE) {
      item = new ChecklistItem({ challenge: line.value });
      section.add(item);
    } else if (line.type === ITEM_RESPONSE) {
      item.setResponse(line.value);
    }
  }

  return checklist;
}
