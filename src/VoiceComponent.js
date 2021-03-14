import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

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
        <button
          className="btn"
          disabled={paused ? '' : 'disabled'}
          onClick={play}
        >
          Play
        </button>
        <button
          className="btn"
          disabled={paused ? 'disabled' : ''}
          onClick={pause}
        >
          Pause
        </button>
        <button className="btn" onClick={faster}>
          Faster
        </button>
        <button className="btn" onClick={slower}>
          Slower
        </button>
      </div>
    </div>
  );
}
