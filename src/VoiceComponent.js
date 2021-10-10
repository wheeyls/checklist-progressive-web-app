import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

function ThemeToggleComponent() {
  const [light, setLight] = useState(
    window.document.body.classList.contains('light-theme')
  );

  function render() {
    if (light) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }

  function toggleLightMode() {
    setLight(!light);

    render();
  }

  return (
    <button
      className={classNames({
        btn: true
      })}
      onClick={toggleLightMode}
    >
      {light ? '☾' : '☼'}
    </button>
  );
}

export function VoiceComponent({ voice }) {
  const [paused, setPaused] = useState(voice.paused());
  const [delay, setDelay] = useState(voice.delay());

  useEffect(() => {
    const update = () => {
      setPaused(voice.paused());
      setDelay(voice.delay());
    };

    voice.on('changed', update);
    () => voice.off('changed', update);
  });

  function play() {
    setPaused(false);
    voice.play();
  }

  function pause() {
    setPaused(true);
    voice.pause();
  }

  function faster() {
    voice.faster();
  }

  function slower() {
    voice.slower();
  }

  return (
    <div className="voice">
      <div>
        {paused ? (
          <button className="btn btn--major btn--green" onClick={play}>
            ▶
          </button>
        ) : (
          <button className="btn btn--major" onClick={pause}>
            ■
          </button>
        )}
      </div>
      <div>
        <button className="btn btn--major" onClick={faster}>
          ▲
        </button>
        <button className="btn btn--major" onClick={slower}>
          ▼
        </button>
      </div>
      <ThemeToggleComponent />
    </div>
  );
}
