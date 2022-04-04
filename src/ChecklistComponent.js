import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

function ChecklistItemComponent({ item, current }) {
  const [response, setResponse] = useState(
    (item.timer && item.timer.current()) || item.response
  );
  const myRef = useRef(null);

  const executeScroll = () =>
    myRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });

  if (current) {
    window.setTimeout(executeScroll, 100);
  }

  function toggleCheck() {
    item.toggle();
  }

  if (item.timer) {
    useEffect(() => {
      item.timer.onTick(setResponse);

      return () => item.timer.off('tick', setResponse);
    });
  }

  return (
    <>
      <div
        ref={myRef}
        className={classNames({
          item: true,
          'item--completed': item.completed,
          'item--current': current
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
        <div className={classNames({ item__response: 'true' })}>{response}</div>
      </div>
    </>
  );
}

function ChecklistSectionComponent({
  section,
  onChoose,
  nextSection,
  prevSection,
  chosen
}) {
  const nextItem = section.nextItem();

  return (
    <div className={classNames({ section: true, 'section--selected': chosen })}>
      <div className="section__header">
        <div></div>
        <div>
          <button className="btn" onClick={() => section.reset()}>
            Reset
          </button>
          <button className="btn" onClick={() => prevSection()}>
            Back
          </button>
          <button className="btn" onClick={() => nextSection()}>
            Next
          </button>
        </div>
      </div>

      <div className="section__body">
        <h2 onClick={() => onChoose(section)}>{section.title}</h2>

        {section.items.map((i) => (
          <ChecklistItemComponent
            item={i}
            current={i === nextItem}
            key={`${section.title}-${i.challenge}-${i.response}`}
          />
        ))}
      </div>
    </div>
  );
}

function ChecklistMenu({ checklist, checklists, onChoose }) {
  const [expanded, setExpanded] = useState(false);

  function handleChoose(event, value) {
    event.preventDefault();
    onChoose(value);
    setExpanded(false);
  }

  function toggleExpand(event) {
    event.preventDefault();
    setExpanded(!expanded);
  }

  return (
    <nav
      className={classNames({
        menu: true,
        'menu--expanded': expanded,
        'menu--dropdown': true
      })}
    >
      <div
        className={classNames({
          menu__toggle: true,
          'menu__toggle--dropdown': true,
          'menu__toggle--dropdown--expanded': expanded
        })}
        onClick={toggleExpand}
      >
        <strong>{checklist.title}</strong>
      </div>
      <ul>
        {checklists.map((list) => (
          <li
            className={classNames({
              menu__item: true,
              'menu__item--selected': list === checklist
            })}
          >
            <a href="#" onClick={(e) => handleChoose(e, list)}>
              {list.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ChecklistMenuComponent({
  chosenSection,
  sections,
  onChoose,
  onBack,
  checklists,
  checklist
}) {
  const [expanded, setExpanded] = useState(false);

  function toggleExpand() {
    setExpanded(!expanded);
  }

  function handleChoose(section) {
    onChoose(section);
    setExpanded(false);
  }

  return (
    <nav className={classNames({ menu: true, 'menu--expanded': expanded })}>
      <div className="menu__head">
        <a onClick={onBack}>Back</a>
        <div>
          <button
            className={classNames({
              btn: true,
              menu__toggle: true,
              'menu__toggle--expanded': expanded
            })}
            onClick={toggleExpand}
          ></button>
        </div>
      </div>
      <ul>
        {sections.map((section) => (
          <li
            className={classNames({
              menu__item: true,
              'menu__item--selected': section === chosenSection
            })}
          >
            <a href="#" onClick={() => handleChoose(section)}>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ModeSelector({ checklists, onChoose }) {
  function handleChoose(event, value) {
    event.preventDefault();
    onChoose(value);
  }

  return (
    <>
      <ul className="mode-selector">
        {checklists.map((list) => (
          <li
            className="mode-selector__item"
            onClick={(e) => handleChoose(e, list)}
          >
            {list.title}
          </li>
        ))}
      </ul>
    </>
  );
}

export function CurrentMode({ checklist, voice, clearChecklist }) {
  const [sections, setSections] = useState(checklist.sections);
  const [chosenSection, setChosenSection] = useState(checklist.sections[0]);

  voice.set(chosenSection);

  useEffect(() => {
    const update = () => {
      setSections(checklist.sections.slice());
    };

    checklist.on('changed', update);
    return () => checklist.off('changed', update);
  });

  function handleChosenSection(section) {
    setChosenSection(section || checklist.sections[0]);
  }

  return (
    <div className="checklist">
      <ChecklistMenuComponent
        chosenSection={chosenSection}
        sections={sections}
        onChoose={handleChosenSection}
        checklist={checklist}
        onBack={clearChecklist}
      />
      {sections.map((i, idx) => (
        <ChecklistSectionComponent
          voice={voice}
          section={i}
          key={i.title}
          prevSection={() => handleChosenSection(sections[idx - 1])}
          nextSection={() => handleChosenSection(sections[idx + 1])}
          onChoose={handleChosenSection}
          chosen={chosenSection === i}
        />
      ))}
    </div>
  );
}

export function ChecklistComponent({ checklist, voice, checklists }) {
  const [currentChecklist, setCurrentChecklist] = useState(null);

  function clearChecklist() {
    setCurrentChecklist(null);
  }

  if (currentChecklist) {
    return (
      <CurrentMode
        checklist={currentChecklist}
        voice={voice}
        clearChecklist={clearChecklist}
      />
    );
  } else {
    return (
      <ModeSelector checklists={checklists} onChoose={setCurrentChecklist} />
    );
  }
}
