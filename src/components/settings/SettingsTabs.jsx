import React, { useState } from 'react';
import { Card, SettingRow, Toggle } from './SettingsShared';
import { SettingsIcons } from '../Icons';

export const ProfileSettings = ({ userData }) => {
  const getInitials = () => {
    if (userData?.name) return userData.name.charAt(0).toUpperCase();
    if (userData?.email) return userData.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <Card title="Profile Information">
      <div className="profile-upload-row">
        <div className="avatar-preview">{getInitials()}</div>
        <div className="upload-actions">
          <button className="btn-secondary btn-sm">Upload new photo</button>
          <button className="btn-ghost btn-sm text-red">Remove</button>
        </div>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label>Full name</label>
          <input type="text" className="settings-input" defaultValue={userData?.name || ''} />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea className="settings-textarea" defaultValue={userData?.profileData?.bio || ''} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Role</label>
            <select className="settings-select" defaultValue={userData?.role || 'founder'}>
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" className="settings-input" defaultValue={userData?.profileData?.country || ''} />
          </div>
        </div>
        <div className="form-group">
          <label>Website / LinkedIn</label>
          <input type="url" className="settings-input" defaultValue={userData?.profileData?.demoLink || ''} />
        </div>
        <div className="form-actions">
          <button className="btn-primary">Save changes</button>
        </div>
      </div>
    </Card>
  );
};

export const AccountSettings = ({ user }) => (
  <Card title="Account Details">
    <SettingRow title="Email address" desc={user?.email || 'No email set'}>
      <button className="btn-secondary btn-sm">Change email</button>
    </SettingRow>
    <div className="settings-divider"></div>
    <SettingRow title="Username" desc="Your public handle (Optional)">
      <input type="text" className="settings-input sm-input" defaultValue="" placeholder="@username" />
    </SettingRow>
    <div className="settings-divider"></div>
    <SettingRow title="Language" desc="Platform display language">
      <select className="settings-select sm-input">
        <option>English</option>
        <option>Hindi</option>
      </select>
    </SettingRow>
    <div className="settings-divider"></div>
    <SettingRow title="Timezone" desc="Used for meetings and timestamps">
      <select className="settings-select sm-input">
        <option>Asia/Kolkata (IST)</option>
        <option>America/New_York (EST)</option>
      </select>
    </SettingRow>
  </Card>
);

export const SecuritySettings = () => {
  const [twoFA, setTwoFA] = useState(false);
  const [alerts, setAlerts] = useState(true);

  return (
    <>
      <Card title="Security & Access">
        <SettingRow title="Password" desc="Change your password">
          <button className="btn-secondary btn-sm">Update password</button>
        </SettingRow>
        <div className="settings-divider"></div>
        <SettingRow title="Two-factor authentication (2FA)" desc="Add an extra layer of security to your account">
          <Toggle active={twoFA} onToggle={() => setTwoFA(!twoFA)} />
        </SettingRow>
        <div className="settings-divider"></div>
        <SettingRow title="Suspicious login alerts" desc="Get notified via email if we detect a login from a new device">
          <Toggle active={alerts} onToggle={() => setAlerts(!alerts)} />
        </SettingRow>
      </Card>

      <div style={{ height: 24 }}></div>

      <Card title="Active Sessions">
        <div className="session-item">
          <div className="session-icon"><SettingsIcons.Profile /></div>
          <div className="session-info">
            <p className="device-name">Web Browser - Chrome <span>(Current)</span></p>
            <p className="device-location">Active now</p>
          </div>
        </div>
        <div className="settings-divider"></div>
        <button className="btn-secondary btn-sm full-width mt-3">Logout from all devices</button>
      </Card>
    </>
  );
};

export const IdentityVerification = ({ userData }) => {
  const [step, setStep] = useState(0);
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');

  const formatAadhaar = (val) => {
    return val.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || val;
  };

  const handleAadhaarChange = (e) => {
    const numeric = e.target.value.replace(/\D/g, '').substring(0, 12);
    setAadhaar(formatAadhaar(numeric));
  };

  const verifyOTP = () => {
    setStep(3);
  };

  return (
    <Card title="Identity Verification">
      {step === 0 && (
        <div className="id-verification-start">
          <div className="status-banner pending">
            <span className="banner-icon">⏳</span>
            <div className="banner-text">
              <h4>Not verified</h4>
              <p>Verify your identity using Aadhaar to unlock the marketplace and investor messaging.</p>
            </div>
          </div>
          <div className="consent-box">
            <input type="checkbox" id="consent" className="settings-checkbox" />
            <label htmlFor="consent">I agree to share my Aadhaar details for verification via DigiLocker. <a href="#">Why is this required?</a></label>
          </div>
          <button className="btn-primary" onClick={() => setStep(1)}>Start Verification</button>
        </div>
      )}
      {step === 1 && (
        <div className="id-verification-step">
          <h4 className="step-heading">Enter your 12-digit Aadhaar Number</h4>
          <p className="step-desc">An OTP will be sent to your Aadhaar-linked mobile number.</p>
          <input 
            type="text" 
            className="settings-input aadhaar-input" 
            placeholder="XXXX XXXX XXXX" 
            value={aadhaar}
            onChange={handleAadhaarChange}
          />
          <p className="privacy-notice">
            <SettingsIcons.Security /> Your Aadhaar data is encrypted and used only for verification. We do not store full Aadhaar numbers.
          </p>
          <div className="step-actions">
            <button className="btn-ghost" onClick={() => setStep(0)}>Cancel</button>
            <button className="btn-primary" disabled={aadhaar.replace(/\s/g, '').length !== 12} onClick={() => setStep(2)}>Send OTP</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="id-verification-step">
          <h4 className="step-heading">Enter OTP</h4>
          <p className="step-desc">Enter the 6-digit OTP sent to your Aadhaar-linked phone number.</p>
          <div className="otp-input-group mt-3">
            <input 
              type="text" 
              className="settings-input otp-large" 
              placeholder="000 000" 
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div className="step-actions mt-4">
            <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary" disabled={otp.length !== 6} onClick={verifyOTP}>Confirm & Verify</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="id-verification-success">
          <div className="success-icon-large">
            <SettingsIcons.Identity />
          </div>
          <h3 className="success-title">Your identity is verified!</h3>
          <div className="verified-details-card">
            <div className="vd-row"><span>Name:</span> <strong>{userData?.name || 'User'}</strong></div>
            <div className="vd-row"><span>Aadhaar:</span> <strong>XXXX XXXX {aadhaar.slice(-4)}</strong></div>
          </div>
          <div className="status-banner success mt-4">
            <span className="banner-icon">✅</span>
            <div className="banner-text">
              <h4>Verified Badge Activated</h4>
              <p>Your profile now displays the trusted badge to all users.</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export const NotificationSettings = () => {
  const [notifs, setNotifs] = useState({ investor: true, funding: true, msgs: true, ai: false, push: true, inapp: true });
  const toggle = (k) => setNotifs({ ...notifs, [k]: !notifs[k] });

  return (
    <Card title="Notification Preferences">
      <h4 className="setting-group-title">Email Notifications</h4>
      <SettingRow title="Investor interest" desc="When an investor adds you to their watchlist"><Toggle active={notifs.investor} onToggle={() => toggle('investor')} /></SettingRow>
      <div className="settings-divider"></div>
      <SettingRow title="Funding offers" desc="When an investor sends a formal offer"><Toggle active={notifs.funding} onToggle={() => toggle('funding')} /></SettingRow>
      <div className="settings-divider"></div>
      <SettingRow title="Messages" desc="When you receive a direct message"><Toggle active={notifs.msgs} onToggle={() => toggle('msgs')} /></SettingRow>
      <div className="settings-divider"></div>
      <SettingRow title="AI updates" desc="Weekly insights on market trends"><Toggle active={notifs.ai} onToggle={() => toggle('ai')} /></SettingRow>
      <h4 className="setting-group-title mt-6">Push & App</h4>
      <SettingRow title="Push Notifications" desc="Real-time alerts to your devices"><Toggle active={notifs.push} onToggle={() => toggle('push')} /></SettingRow>
      <div className="settings-divider"></div>
      <SettingRow title="In-App Notifications" desc="Show badges and popups in the dashboard"><Toggle active={notifs.inapp} onToggle={() => toggle('inapp')} /></SettingRow>
    </Card>
  );
};

export const StartupSettings = ({ userData }) => (
  <Card title="Startup Settings">
    <SettingRow title="Visibility" desc="Who can see your PitchTank profile?">
      <select className="settings-select sm-input">
        <option>Public</option>
        <option>Private</option>
        <option>Invite-only</option>
      </select>
    </SettingRow>
    <div className="settings-divider"></div>
    <SettingRow title="Funding Goal" desc="Update your target raise amount">
      <div className="currency-input-wrap">
        <span className="currency-symbol">₹</span>
        <input type="text" className="settings-input sm-input" defaultValue={userData?.profileData?.fundingRequired || ''} />
      </div>
    </SettingRow>
    <div className="settings-divider"></div>
    <SettingRow title="Pitch Deck" desc="Upload or update your PDF pitch deck">
      <button className="btn-secondary btn-sm">Upload File</button>
    </SettingRow>
    <div className="settings-divider"></div>
    <div className="mt-4">
      <button className="btn-primary w-full">Save Startup Settings</button>
    </div>
  </Card>
);

export const BillingSettings = () => {
  const [showPricing, setShowPricing] = useState(false);

  return (
    <>
      <Card title="Billing & Subscription">
        <div className="plan-card">
          <div className="plan-info">
            <h4>Free Tier</h4>
            <p>Basic access to PitchTank features.</p>
          </div>
          <button 
            className="btn-primary" 
            style={{ fontWeight: 'bold' }}
            onClick={() => setShowPricing(true)}
          >
            Upgrade Plan
          </button>
        </div>
      </Card>

      {showPricing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999
        }} onClick={() => setShowPricing(false)}>
          <div style={{
            background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px', width: '100%', maxWidth: '700px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Upgrade Your PitchTank</h2>
              <button onClick={() => setShowPricing(false)} style={{ background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            
            <div style={{ padding: '32px', display: 'flex', gap: '24px' }}>
              {/* Pro Tier */}
              <div style={{ flex: 1, padding: '24px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: 0, color: '#4b5563', fontSize: '16px' }}>Pro Tier</h3>
                <div style={{ fontSize: '32px', fontWeight: 700, margin: '16px 0', color: '#111827' }}>$49<span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 'normal' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#374151' }}>
                  <li>✓ Unlimited AI Pitch Scoring</li>
                  <li>✓ Direct Investor Inbox Access</li>
                  <li>✓ Priority Deal-Flow Listing</li>
                </ul>
                <button className="btn-secondary w-full" style={{ background: 'rgba(0,0,0,0.05)', color: '#111827' }}>Choose Pro</button>
              </div>

              {/* Elite Tier */}
              <div style={{ flex: 1, padding: '3px', background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', borderRadius: '14px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, right: 24, background: '#3B82F6', color: '#ffffff', padding: '4px 12px', fontSize: '12px', borderRadius: '20px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>Shark Favorite</div>
                <div style={{ padding: '21px', background: '#f9fafb', borderRadius: '11px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: 0, color: '#3B82F6', fontSize: '16px' }}>Elite Tier</h3>
                  <div style={{ fontSize: '32px', fontWeight: 700, margin: '16px 0', color: '#111827' }}>$199<span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 'normal' }}>/mo</span></div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#374151' }}>
                    <li>✓ Weekly Pitch Coaching</li>
                    <li>✓ Guaranteed VC Introductions</li>
                    <li>✓ Syndicated Term Sheet Access</li>
                    <li>✓ Custom Board Advisory</li>
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <button className="btn-primary w-full" style={{ background: '#3B82F6', border: 'none', color: '#ffffff' }}>Choose Elite</button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export const Integrations = () => (
  <Card title="Connected Apps">
    <div className="integration-item">
      <div className="int-logo google">G</div>
      <div className="int-info">
        <h4>Google Drive</h4>
        <p>Easily attach decks from Google Drive.</p>
      </div>
      <button className="btn-secondary btn-sm">Connected</button>
    </div>
    <div className="integration-item">
      <div className="int-logo linkedin">in</div>
      <div className="int-info">
        <h4>LinkedIn</h4>
        <p>Sync your work history and network.</p>
      </div>
      <button className="btn-primary btn-sm">Connect</button>
    </div>
    <div className="integration-item">
      <div className="int-logo x">X</div>
      <div className="int-info">
        <h4>X (Twitter)</h4>
        <p>Share your startup progress and network.</p>
      </div>
      <button className="btn-primary btn-sm">Connect</button>
    </div>
  </Card>
);

export const DangerZone = () => (
  <Card title="Danger Zone" danger={true}>
    <SettingRow title="Deactivate account" desc="Temporarily hide your profile. You can reactivate anytime.">
      <button className="btn-secondary btn-sm text-red">Deactivate</button>
    </SettingRow>
    <div className="settings-divider danger"></div>
    <SettingRow title="Delete account" desc="Permanently erase your account, startup data, and history.">
      <button className="btn-danger btn-sm">Delete Account</button>
    </SettingRow>
  </Card>
);
