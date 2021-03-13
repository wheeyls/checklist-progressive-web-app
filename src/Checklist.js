export class ChecklistItem {
  constructor({ challenge, response = null }) {
    this.challenge = challenge;
    this.response = response;
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

export class ChecklistSection {
  constructor({ title, items = [] }) {
    this.title = title;
    this.items = items;
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
      checklist.sections.push(section);
    } else if (line.type === ITEM_CHALLENGE) {
      item = new ChecklistItem({ challenge: line.value });
      section.items.push(item);
    } else if (line.type === ITEM_RESPONSE) {
      item.response = line.value;
    }
  }

  return checklist;
}
