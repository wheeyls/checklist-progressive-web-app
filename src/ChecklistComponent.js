import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

function ChecklistItemComponent({ item }) {
  function toggleCheck() {
    item.toggle();
  }

  return (
    <>
      <div
        className={classNames({
          item: true,
          'item--completed': item.completed
        })}
        onClick={toggleCheck}
      >
        <div className={classNames({ item__challenge: 'true' })}>
          <input
            type="checkbox"
            readOnly={true}
            checked={item.completed}
            className={classNames({ item__check: 'true' })}
          />
          {item.challenge}
        </div>
        <div className={classNames({ item__response: 'true' })}>
          {item.response}
        </div>
      </div>
    </>
  );
}

function ChecklistSectionComponent({ section, onChoose, chosen }) {
  return (
    <div className={classNames({ section: true, 'section--selected': chosen })}>
      <div className="section__header">
        <h2 onClick={() => onChoose(section)}>{section.title}</h2>
      </div>

      <div className="section__body">
        <button className="btn" onClick={() => section.reset()}>
          Reset
        </button>

        {section.items.map((i) => (
          <ChecklistItemComponent
            item={i}
            key={`${section.title}-${i.challenge}-${i.response}`}
          />
        ))}
      </div>
    </div>
  );
}

export function ChecklistComponent({ checklist, voice }) {
  const [sections, setSections] = useState(checklist.sections);
  const [chosenSection, setChosenSection] = useState(checklist.sections[0]);

  voice.set(chosenSection);

  function handleChosenSection(section) {
    setChosenSection(section);
  }

  useEffect(() => {
    const update = () => {
      setSections(checklist.sections.slice());
    };

    checklist.on('changed', update);
    return () => checklist.off('changed', update);
  });

  return (
    <div className='checklist'>
      <h1>{checklist.title}</h1>

      {checklist.sections.map((i) => (
        <ChecklistSectionComponent
          voice={voice}
          section={i}
          key={i.title}
          onChoose={handleChosenSection}
          chosen={chosenSection === i}
        />
      ))}
    </div>
  );
}
