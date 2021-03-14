import React from 'react';
import ReactDOM from 'react-dom';
import { Checklist } from './Checklist';
import { ChecklistComponent } from './ChecklistComponent';
import { cessnaChecklist } from './cessnaChecklist';
import { playbacker } from './playbacker';
import { VoiceComponent } from './VoiceComponent';
import './app.scss';

const checklist = Checklist.fromMarkdown(cessnaChecklist);

function arrayToGenerator(array) {
  return array[Symbol.iterator]();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/assets/serviceWorker.js')
      .then((res) => console.log('service worker registered'))
      .catch((err) => console.log('service worker not registered', err));
  });
}

const voice = playbacker(checklist.sections[0]);

function App() {
  return (
    <>
      <VoiceComponent voice={voice} />
      <ChecklistComponent checklist={checklist} voice={voice} />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('container'));
