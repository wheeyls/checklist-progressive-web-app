import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

function ChecklistItemComponent({ item, current }) {
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
        <div className={classNames({ item__response: 'true' })}>
          {item.response}
        </div>
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
        <h2 onClick={() => onChoose(section)}>{section.title}</h2>
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

function ThemeToggleComponent() {
  const [light, setLight] = useState(
    window.document.body.classList.contains('light-theme')
  );

  function toggleLightMode() {
    if (light) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }

    setLight(!light);
  }

  return (
    <button
      className={classNames({
        btn: true
      })}
      onClick={toggleLightMode}
    >
      {light ? '☾' : '☀'}
    </button>
  );
}

function ChecklistMenu({ checklist, checklists, onChoose }) {
  const [expanded, setExpanded] = useState(true);

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
  onChangeChecklist,
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
        <ChecklistMenu checklist={checklist} checklists={checklists} onChoose={onChangeChecklist} />
        <div>
          <ThemeToggleComponent />
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

export function ChecklistComponent({ checklist, voice, checklists }) {
  const [currentChecklist, setCurrentChecklist] = useState(checklist);
  const [sections, setSections] = useState(currentChecklist.sections);
  const [chosenSection, setChosenSection] = useState(
    currentChecklist.sections[0]
  );

  voice.set(chosenSection);

  function handleChosenSection(section) {
    setChosenSection(section || currentChecklist.sections[0]);
  }

  function handleChosenChecklist(checklist) {
    setCurrentChecklist(checklist);
    setSections(checklist.sections);
    setChosenSection(checklist.sections[0]);
  }

  useEffect(() => {
    const update = () => {
      setSections(currentChecklist.sections.slice());
    };

    currentChecklist.on('changed', update);
    return () => currentChecklist.off('changed', update);
  });

  return (
    <div className="checklist">
      <ChecklistMenuComponent
        chosenSection={chosenSection}
        sections={currentChecklist.sections}
        onChoose={handleChosenSection}
        onChangeChecklist={handleChosenChecklist}
        checklist={currentChecklist}
        checklists={checklists}
      />
      {currentChecklist.sections.map((i, idx) => (
        <ChecklistSectionComponent
          voice={voice}
          section={i}
          key={i.title}
          prevSection={() =>
            handleChosenSection(currentChecklist.sections[idx - 1])
          }
          nextSection={() =>
            handleChosenSection(currentChecklist.sections[idx + 1])
          }
          onChoose={handleChosenSection}
          chosen={chosenSection === i}
        />
      ))}
    </div>
  );
}
