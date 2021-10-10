import { Checklist, ChecklistSection, ChecklistItem, ChecklistTimerItem } from '../src/Checklist';

let subject = null;
const simpleExample = `# Checklist Title

## Section one

- Item 1
  - Check
- Item 2

## Section two

- Item 3
- !Timer
  - 15`;

describe('Checklist', () => {
  it('can be initialized with nothing', () => {
    subject = new Checklist({ title: 'Example Checklist' });
    expect(subject.sections).toEqual([]);
  });

  describe('fromMarkdown', () => {
    beforeEach(() => {
      subject = Checklist.fromMarkdown(simpleExample);
    });

    it('returns a Checklist', () => {
      expect(subject).toBeInstanceOf(Checklist);
    });

    it('Checklist has a title', () => {
      expect(subject.title).toEqual('Checklist Title');
    });

    it('Checklist has sections', () => {
      expect(subject.sections[0].title).toEqual('Section one');
    });

    it('Checklist has more than one section', () => {
      expect(subject.sections[1].title).toEqual('Section two');
    });

    it('Sections have items', () => {
      expect(subject.sections[0].items[0].challenge).toEqual('Item 1');
    });

    it('Items have responses', () => {
      expect(subject.sections[0].items[0].response).toEqual('Check');
    });

    it('!Timer items are Timer classes', () => {
      expect(subject.sections[1].items[1]).toBeInstanceOf(ChecklistTimerItem);
    });

    describe('when an item changes', () => {
      it('emits an item:changed event', (done) => {
        subject.on('item:changed', (item) => {
          expect(item.completed).toEqual(true);
          done();
        });

        subject.sections[0].items[0].toggle();
      });

      it('emits a changed event', (done) => {
        subject.on('changed', (checklist) => {
          expect(checklist).toEqual(subject);
          done();
        });

        subject.sections[0].items[0].toggle();
      });
    });
  });

  describe('toMarkdown', () => {
    beforeEach(() => {
      subject = new Checklist({ title: 'Sample' });
      subject.add(new ChecklistSection({ title: 'Section 1' }));
      subject.add(new ChecklistSection({ title: 'Section 2' }));

      subject.sections[0].add(
        new ChecklistItem({ challenge: 'challenge', response: 'response' })
      );

      subject.sections[0].add(new ChecklistItem({ challenge: 'challenge 2' }));

      subject.sections[1].add(new ChecklistItem({ challenge: 'challenge' }));
    });

    it('spits outs correctly formatted markdown', () => {
      expect(subject.toMarkdown()).toEqual(`# Sample

## Section 1

- challenge
  - response
- challenge 2

## Section 2

- challenge`);
    });
  });
});
