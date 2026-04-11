import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/AuthContext';
import Loader from '../components/Loader';
import '../styles/auth.css';
import { BackIcon } from '../components/Icons';
import FounderSteps from '../components/onboarding/FounderSteps';
import InvestorSteps from '../components/onboarding/InvestorSteps';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, userData, loading } = useAuth();
  
  const [view, setView] = useState('role-selection');
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    bio: '', experience: '', startupName: '', tagline: '', industry: '', problem: '', solution: '',
    audience: '', revenueModel: '', stage: '', fundingRequired: '', equity: '', traction: '',
    teamSize: '', rolesMissing: '', marketSize: '', competitors: '', advantage: '',
    range: '', preferredIndustries: '', stagePreference: '', country: '', portfolio: '',
    photoPreview: null
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfProcessing, setPdfProcessing] = useState(false);
  const [pdfWatermarked, setPdfWatermarked] = useState(null);
  const [pdfDragOver, setPdfDragOver] = useState(false);
  const pitchDeckRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (userData?.onboardingComplete) {
        navigate('/dashboard');
      } else if (userData?.role) {
        setRole(userData.role);
        setView('onboarding');
      }
    }
  }, [user, userData, loading, navigate]);

  if (loading) return <Loader text="Loading PitchTank Setup..." />;

  const handleOnboardingChange = (field, value) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setOnboardingStep(prev => prev + 1);
  const prevStep = () => setOnboardingStep(prev => Math.max(prev - 1, 1));

  const applyWatermark = async (file) => {
    setPdfProcessing(true);
    setPdfWatermarked(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const watermarkText = onboardingData.startupName || user?.displayName || 'PitchTank';
      const fontSize = 150;

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const x = (width / 2) - (textWidth / 2) + 50;
        const y = (height / 2) - (fontSize / 2);
        page.drawText(watermarkText, {
          x, y,
          size: fontSize,
          font,
          color: rgb(0.6, 0.6, 0.6),
          rotate: degrees(45),
          opacity: 0.2,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const name = file.name.replace('.pdf', '') + '_watermarked.pdf';
      setPdfWatermarked({ url, name });
    } finally {
      setPdfProcessing(false);
    }
  };

  const handlePdfSelect = (file) => {
    if (!file || file.type !== 'application/pdf') return;
    setPdfFile(file);
    applyWatermark(file);
  };

  const handleRoleSelection = async () => {
    if (!role || !user) return;
    setSaving(true);
    setError('');
    try {
      await setDoc(doc(db, "users", user.uid), { role }, { merge: true });
      setView('onboarding');
    } catch (err) {
      console.error("Error saving role:", err);
      setError(err.message || "Failed to save role. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        role,
        onboardingComplete: true,
        profileData: onboardingData
      };
      await setDoc(doc(db, "users", user.uid), payload, { merge: true });
      navigate('/dashboard');
    } catch (err) {
      console.error("Error saving onboarding state:", err);
      setError(err.message || "Failed to finalize profile. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow blur-1"></div>
      <div className="auth-bg-glow blur-2"></div>
      <div className="auth-grid-bg"></div>
      
      <div className="auth-layout-wrapper" style={{ justifyContent: 'center' }}>
        <div className="auth-card" style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
          
          <div className="auth-top-nav">
            <div className="auth-logo" onClick={() => navigate('/')} role="button" aria-label="Back to home">
              <span className="logo-dot"></span>
              <span>PitchTank</span>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {view === 'role-selection' && (
            <>
              <div className="auth-header">
                <h1 className="auth-title">Choose your path</h1>
                <p className="auth-subtitle">Welcome! Before we start, tell us how you'll use PitchTank.</p>
              </div>
              <div className="role-group" style={{ marginTop: '2rem' }}>
                <div className="role-cards">
                  <button type="button" className={`role-card ${role === 'founder' ? 'active' : ''}`} onClick={() => setRole('founder')} disabled={saving}>
                    <div className="role-icon">F</div>
                    <div className="role-name">Founder</div>
                    <div className="role-desc">Submit startups</div>
                  </button>
                  <button type="button" className={`role-card ${role === 'investor' ? 'active' : ''}`} onClick={() => setRole('investor')} disabled={saving}>
                    <div className="role-icon">₹</div>
                    <div className="role-name">Investor</div>
                    <div className="role-desc">Fund startups</div>
                  </button>
                </div>
              </div>
              <button type="button" className="btn-primary" disabled={!role || saving} onClick={handleRoleSelection} style={{ marginTop: '2rem' }}>
                {saving ? 'Saving...' : 'Continue to Profile'}
              </button>
            </>
          )}

          {view === 'onboarding' && (
            <div className="onboarding-view">
              <div className="onboarding-header">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(onboardingStep / (role === 'founder' ? 4 : 3)) * 100}%` }}></div>
                </div>
              </div>

              {role === 'founder' && (
                <FounderSteps
                  step={onboardingStep}
                  data={onboardingData}
                  onChange={handleOnboardingChange}
                  pitchDeckRef={pitchDeckRef}
                  pdfDragOver={pdfDragOver}
                  pdfFile={pdfFile}
                  pdfProcessing={pdfProcessing}
                  pdfWatermarked={pdfWatermarked}
                  handlePdfSelect={handlePdfSelect}
                  setPdfDragOver={setPdfDragOver}
                />
              )}

              {role === 'investor' && (
                <InvestorSteps
                  step={onboardingStep}
                  data={onboardingData}
                  onChange={handleOnboardingChange}
                />
              )}

              <div className="onboarding-footer">
                {onboardingStep > 1 && (
                  <button type="button" className="btn-secondary" onClick={prevStep} disabled={saving}>
                    Back
                  </button>
                )}
                {onboardingStep < (role === 'founder' ? 4 : 3) ? (
                  <button type="button" className="btn-primary" onClick={nextStep} disabled={saving}>
                    Continue
                  </button>
                ) : (
                  <button type="button" className="btn-primary" onClick={completeOnboarding} disabled={saving}>
                    {saving ? 'Finalizing...' : 'Complete Setup'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
