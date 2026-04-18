import React from 'react';

export const Toggle = ({ active, onToggle }) => (
  <button className={`setting-toggle ${active ? 'active' : ''}`} onClick={onToggle}>
    <div className="toggle-slider"></div>
  </button>
);

export const SettingRow = ({ title, desc, children }) => (
  <div className="setting-row">
    <div className="setting-info">
      <h4>{title}</h4>
      {desc && <p>{desc}</p>}
    </div>
    <div className="setting-action">{children}</div>
  </div>
);

export const Card = ({ title, children, danger = false }) => (
  <div className={`settings-card ${danger ? 'danger-card' : ''}`}>
    <div className="settings-card-header">
      <h3>{title}</h3>
    </div>
    <div className="settings-card-body">
      {children}
    </div>
  </div>
);
