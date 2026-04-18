import React from 'react';

export default function FounderSteps({ step, data, onChange, pitchDeckRef, pdfDragOver, pdfFile, pdfProcessing, pdfWatermarked, handlePdfSelect, setPdfDragOver }) {
  return (
    <div className="onboarding-content fade-in">
      {step === 1 && (
        <>
          <h2 className="onboarding-title">Let's build your profile</h2>
          <p className="onboarding-subtitle">Tell investors about yourself.</p>
          
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
                id="founder-photo-upload" 
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
              <button className="btn-secondary btn-small" onClick={() => document.getElementById('founder-photo-upload').click()}>
                Upload Photo
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short bio (1-2 lines)</label>
            <div className="form-input-wrap">
              <textarea 
                className="form-input" 
                placeholder="Passionate builder..."
                rows="2"
                value={data.bio}
                onChange={(e) => onChange('bio', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Experience level</label>
            <select 
              className="form-input"
              value={data.experience}
              onChange={(e) => onChange('experience', e.target.value)}
            >
              <option value="">Select experience</option>
              <option value="first-time">First-time founder</option>
              <option value="serial">Serial founder</option>
              <option value="industry-vet">Industry veteran</option>
            </select>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="onboarding-title">Startup Details</h2>
          <p className="onboarding-subtitle">What are you building?</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Startup Name</label>
              <input type="text" className="form-input" placeholder="Acme Corp" 
                value={data.startupName} onChange={(e) => onChange('startupName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input type="text" className="form-input" placeholder="FinTech"
                value={data.industry} onChange={(e) => onChange('industry', e.target.value)} />
            </div>
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Tagline</label>
            <input type="text" className="form-input" placeholder="The easiest way to..." 
              value={data.tagline} onChange={(e) => onChange('tagline', e.target.value)} />
          </div>

          <div className="form-group smart-question">
            <label className="form-label">What problem are you solving?</label>
            <textarea className="form-input" rows="2" placeholder="Startups struggle with..."
              value={data.problem} onChange={(e) => onChange('problem', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stage</label>
              <select className="form-input" value={data.stage} onChange={(e) => onChange('stage', e.target.value)}>
                <option value="">Select stage</option>
                <option value="idea">Idea</option>
                <option value="mvp">MVP</option>
                <option value="early-rev">Early Revenue</option>
                <option value="scaling">Scaling</option>
              </select>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="onboarding-title">Funding & Team</h2>
          <p className="onboarding-subtitle">What do you need to grow?</p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Funding Required</label>
              <input type="text" className="form-input" placeholder="₹50L"
                value={data.fundingRequired} onChange={(e) => onChange('fundingRequired', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Team Size</label>
              <input type="text" className="form-input" placeholder="Solo or 2-5"
                value={data.teamSize} onChange={(e) => onChange('teamSize', e.target.value)} />
            </div>
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Current Traction</label>
            <input type="text" className="form-input" placeholder="e.g. 1000 beta users, ₹5L MRR"
              value={data.traction} onChange={(e) => onChange('traction', e.target.value)} />
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Key Roles Missing</label>
            <input type="text" className="form-input" placeholder="e.g. Technical Co-founder, Head of Sales"
              value={data.rolesMissing} onChange={(e) => onChange('rolesMissing', e.target.value)} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <h2 className="onboarding-title">Media & Pitch</h2>
          <p className="onboarding-subtitle">Show, don't just tell.</p>

          <div className="form-group">
            <div
              className={`upload-box${pdfDragOver ? ' upload-box--over' : ''}${pdfFile ? ' upload-box--selected' : ''}`}
              onClick={() => pitchDeckRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setPdfDragOver(true); }}
              onDragLeave={() => setPdfDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setPdfDragOver(false);
                handlePdfSelect(e.dataTransfer.files[0]);
              }}
            >
              <input
                ref={pitchDeckRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={(e) => handlePdfSelect(e.target.files[0])}
              />
              <div className="upload-icon">📄</div>
              {pdfProcessing ? (
                <>
                  <p className="upload-main-text">Applying smart watermark...</p>
                  <p className="upload-sub-text">Securing your pitch deck</p>
                </>
              ) : pdfFile ? (
                <>
                  <p className="upload-main-text">{pdfFile.name}</p>
                  <p className="upload-sub-text">Click to choose a different file</p>
                </>
              ) : (
                <>
                  <p className="upload-main-text">Upload Pitch Deck (PDF)</p>
                  <p className="upload-sub-text">Drag and drop or click to browse</p>
                </>
              )}
            </div>

            {pdfWatermarked && (
              <div className="pdf-preview mt-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <p className="success-text" style={{ margin: 0 }}>✓ Watermark applied</p>
                  <a href={pdfWatermarked.url} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    Preview Deck
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Unfair Advantage</label>
            <textarea className="form-input" rows="2" placeholder="Why will you win?"
              value={data.advantage} onChange={(e) => onChange('advantage', e.target.value)} />
          </div>

          <div className="form-group smart-question">
            <label className="form-label">Demo Video Link &nbsp;<span style={{color: '#888', fontWeight: '400'}}>(Optional)</span></label>
            <input type="url" className="form-input" placeholder="YouTube, Loom, etc."
              value={data.demoLink} onChange={(e) => onChange('demoLink', e.target.value)} />
          </div>
        </>
      )}
    </div>
  );
}
