import { Checklist, ChecklistSection, ChecklistItem } from '../src/Checklist';

let subject = null;
const simpleExample = `# Checklist Title

## Section one

- Item 1
  - Check
- Item 2

## Section two

- Item 3`;

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
  });

  describe('toMarkdown', () => {
    beforeEach(() => {
      subject = new Checklist({ title: 'Sample' });
      subject.sections.push(new ChecklistSection({ title: 'Section 1' }));
      subject.sections.push(new ChecklistSection({ title: 'Section 2' }));

      subject.sections[0].items.push(
        new ChecklistItem({ challenge: 'challenge', response: 'response' })
      );

      subject.sections[0].items.push(
        new ChecklistItem({ challenge: 'challenge 2' })
      );

      subject.sections[1].items.push(
        new ChecklistItem({ challenge: 'challenge' })
      );
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
