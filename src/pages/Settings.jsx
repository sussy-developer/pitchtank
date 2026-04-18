import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import '../styles/settings.css';
import {
  ProfileSettings,
  AccountSettings,
  SecuritySettings,
  IdentityVerification,
  NotificationSettings,
  StartupSettings,
  BillingSettings,
  Integrations,
  DangerZone
} from '../components/settings/SettingsTabs';
import { SettingsIcons } from '../components/Icons';

export default function Settings() {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileSettings userData={userData} user={user} />;
      case 'account': return <AccountSettings user={user} />;
      case 'security': return <SecuritySettings />;
      case 'identity': return <IdentityVerification userData={userData} />;
      case 'notifications': return <NotificationSettings />;
      case 'startup': return <StartupSettings userData={userData} />;
      case 'billing': return <BillingSettings />;
      case 'integrations': return <Integrations />;
      case 'danger': return <DangerZone />;
      default: return <ProfileSettings userData={userData} />;
    }
  };

  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <div className="settings-sidebar-header">
          <button className="back-to-dash" onClick={() => navigate(-1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <h2>Settings</h2>
        </div>

        <nav className="settings-nav">
          {menu.map(item => (
            <button
              key={item.id}
              className={`settings-nav-item ${activeTab === item.id ? 'active' : ''} ${item.danger ? 'danger-link' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.verified && <span className="verified-dot"></span>}
            </button>
          ))}
        </nav>
        
        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <button className="settings-nav-item danger-link" onClick={logout} style={{ color: '#ef4444' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign out
          </button>
        </div>
      </aside>

      <main className="settings-main">
        <div className="settings-content-container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
