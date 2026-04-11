import React from 'react';
import '../styles/loader.css';

export default function Loader({ text = "Loading PitchTank..." }) {
  return (
    <div className="fullscreen-loader-container">
      <div className="loader-glow-bg"></div>
      <div className="loader-orbit">
        <div className="loader-core">PT</div>
        <div className="loader-ring"></div>
      </div>
      <div className="loader-text">{text}</div>
    </div>
  );
}
