import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';
import { SettingsIcons, BackIcon } from '../components/Icons';
import SettingsTabs from '../components/settings/SettingsTabs';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const menu = [
    { id: 'profile', label: 'Profile', icon: <SettingsIcons.Profile /> },
    { id: 'account', label: 'Account', icon: <SettingsIcons.Account /> },
    { id: 'security', label: 'Security', icon: <SettingsIcons.Security /> },
    { id: 'identity', label: 'Identity Verification', icon: <SettingsIcons.Identity />, verified: false },
    { id: 'notifications', label: 'Notifications', icon: <SettingsIcons.Notifications /> },
    { id: 'startup', label: 'Startup Settings', icon: <SettingsIcons.Startup /> },
    { id: 'billing', label: 'Billing & Plans', icon: <SettingsIcons.Billing /> },
    { id: 'integrations', label: 'Integrations', icon: <SettingsIcons.Integrations /> },
    { id: 'danger', label: 'Danger Zone', icon: <SettingsIcons.Danger />, danger: true },
  ];

  return (
    <div className="settings-container">
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="sidebar-header">
            <button className="back-link" onClick={() => navigate('/dashboard')}>
              <BackIcon />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="sidebar-title">Settings</h1>
          </div>
          
          <nav className="settings-nav">
            {menu.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.danger ? 'danger' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.id === 'identity' && (
                  <span className={`status-badge ${item.verified ? 'verified' : 'unverified'}`}>
                    {item.verified ? 'Verified' : 'Unverified'}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-main">
          <SettingsTabs activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}
