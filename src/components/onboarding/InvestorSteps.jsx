import React from 'react';

export default function InvestorSteps({ step, data, onChange }) {
  return (
    <div className="onboarding-content fade-in">
      {step === 1 && (
        <>
          <h2 className="onboarding-title">Investor Profile</h2>
          <p className="onboarding-subtitle">How do you invest?</p>
          
          <div className="form-group avatar-upload">
            <div className="avatar-placeholder">
              {data.photoPreview ? (
                <img src={data.photoPreview} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span>+</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="file" 
                id="investor-photo-upload" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      onChange('photoPreview', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <button className="btn-secondary btn-small" onClick={() => document.getElementById('investor-photo-upload').click()}>
                Upload Photo
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Investment Bio</label>
            <textarea className="form-input" rows="2" placeholder="Angel investor focused on..."
              value={data.bio} onChange={(e) => onChange('bio', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn Profile URL</label>
            <input type="url" className="form-input" placeholder="https://linkedin.com/in/..."
              value={data.demoLink} onChange={(e) => onChange('demoLink', e.target.value)} />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="onboarding-title">Investment Thesis</h2>
          <p className="onboarding-subtitle">What are you looking for?</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Check Size Range</label>
              <select className="form-input" value={data.range} onChange={(e) => onChange('range', e.target.value)}>
                <option value="">Select range</option>
                <option value="1L-10L">₹1L - ₹10L</option>
                <option value="10L-50L">₹10L - ₹50L</option>
                <option value="50L-2Cr">₹50L - ₹2Cr</option>
                <option value="2Cr+">₹2Cr+</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Stage</label>
              <select className="form-input" value={data.stagePreference} onChange={(e) => onChange('stagePreference', e.target.value)}>
                <option value="">Select stage</option>
                <option value="pre-seed">Pre-seed / Idea</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="growth">Growth</option>
              </select>
            </div>
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Preferred Industries <span style={{color: '#888', fontWeight: '400'}}>(comma separated)</span></label>
            <input type="text" className="form-input" placeholder="AI, SaaS, FinTech..."
              value={data.preferredIndustries} onChange={(e) => onChange('preferredIndustries', e.target.value)} />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="onboarding-title">Experience & Focus</h2>
          <p className="onboarding-subtitle">Your track record.</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Country Focus</label>
              <input type="text" className="form-input" placeholder="India"
                value={data.country} onChange={(e) => onChange('country', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Region Tier</label>
              <select className="form-input" value={data.regionFocus} onChange={(e) => onChange('regionFocus', e.target.value)}>
                <option value="">Select focus</option>
                <option value="tier1">Tier 1 only</option>
                <option value="tier2-3">Tier 2/3 focus</option>
                <option value="pan">Pan-Country</option>
                <option value="global">Global</option>
              </select>
            </div>
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Notable Portfolio Companies &nbsp;<span style={{color: '#888', fontWeight: '400'}}>(Optional)</span></label>
            <input type="text" className="form-input" placeholder="Startup A, Startup B..."
              value={data.portfolio} onChange={(e) => onChange('portfolio', e.target.value)} />
          </div>
        </>
      )}
    </div>
  );
}
