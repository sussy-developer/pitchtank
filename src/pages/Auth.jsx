import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/AuthContext';
import '../styles/auth.css';
import { GoogleIcon, LinkedInIcon, EyeIcon } from '../components/Icons';

// User-friendly error messages
function getErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'This email is already registered. Try signing in instead.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential': return 'Invalid email or password. Please try again.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests': return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed': return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user': return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked': return 'Sign-in popup was blocked by your browser. Please allow popups.';
    case 'auth/operation-not-allowed': return 'Google sign-in is not enabled in the Firebase console.';
    case 'auth/unauthorized-domain': return 'This domain is not authorized for Firebase auth. Please check Firebase console.';
    default: return code || 'Something went wrong. Please try again.';
  }
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user, userData, loading } = useAuth();
  // Prevent double-navigation when we already redirected from the form handler
  const didNavigate = useRef(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (didNavigate.current) return;
    if (!loading && user) {
      if (userData) {
        if (userData.onboardingComplete) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      } else {
        // New user — Firestore doc may not be written yet; send to onboarding
        navigate('/onboarding');
      }
    }
  }, [user, userData, loading, navigate]);

  const handleGoogleAuth = async () => {
    setLoadingLocal(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result?.user) {
        throw new Error("No user object returned from Firebase");
      }

      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

      // Fire-and-forget: don't block auth flow on Firestore write
      setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        createdAt: new Date().toISOString(),
        onboardingComplete: false
      }, { merge: true }).catch(err => console.warn("[DEBUG] Firestore write skipped:", err.message));

      // Trigger registration webhook if brand new user
      if (isNewUser) {
        (async () => {
          try {
            await fetch("https://ventures01.app.n8n.cloud/webhook-test/registration", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uid: result.user.uid,
                email: result.user.email,
                name: result.user.displayName,
                authMethod: "google"
              })
            });
          } catch (err) {
            console.warn("[DEBUG] Webhook trigger failed:", err);
          }
        })();
      }

    } catch (err) {
      console.error("[DEBUG] Google auth error caught:", err);
      setError(getErrorMessage(err.code || err.message));
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!isLogin && !role) {
      setError('Please select your role — Founder or Investor.');
      return;
    }
    setLoadingLocal(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Save role + basic profile to Firestore immediately
        setDoc(doc(db, "users", result.user.uid), {
          email,
          name,
          role,
          createdAt: new Date().toISOString(),
          onboardingComplete: false
        }, { merge: true }).catch(err => console.warn("Firestore write skipped:", err.message));

        // Trigger registration webhook for new email signup
        fetch("https://ventures01.app.n8n.cloud/webhook-test/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: result.user.uid,
            email,
            name,
            role,
            authMethod: "email"
          })
        }).catch(err => console.warn("Webhook trigger failed:", err));

        // Navigate immediately with role in state so Onboarding
        // knows the role before Firestore data loads
        didNavigate.current = true;
        navigate('/onboarding', { state: { role } });
        return;
      }
    } catch (err) {
      console.error("Email auth error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoadingLocal(false);
    }
  };

  // Clear error and role when switching between login/signup
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setRole('');
  };

  if (loading) return null;

  return (
    <div className="auth-page">
      <div className="auth-bg-glow blur-1"></div>
      <div className="auth-bg-glow blur-2"></div>
      <div className="auth-grid-bg"></div>

      <div className="auth-layout-wrapper">
        <div className="auth-visual-side">
          <div className="visual-badge">PITCHTANK PRO</div>
          <h1 className="visual-headline">Build, pitch, and<br />scale with <span className="text-gradient">AI intelligence.</span></h1>
          <p className="visual-description">
            Join thousands of founders who have used PitchTank to refine their decks and secure funding matches.
          </p>

          <div className="visual-stats-grid">
            <div className="v-stat">
              <span className="v-num">₹18Cr+</span>
              <span className="v-label">Funding matched</span>
            </div>
            <div className="v-stat">
              <span className="v-num">2.4k+</span>
              <span className="v-label">Startups verified</span>
            </div>
          </div>

          <div className="success-ticker">
            <div className="ticker-label">LATEST MATCH</div>
            <div className="ticker-item">
              <div className="ticker-avatar">AS</div>
              <div className="ticker-info">
                <strong>Acme AI</strong>
                <span>matched with Sequoia India</span>
              </div>
            </div>
          </div>

          <div className="float-card card-1">💡</div>
          <div className="float-card card-2">📈</div>
          <div className="float-card card-3">🚀</div>
        </div>

        <div className="auth-card">
          <div className="auth-top-nav">
            <button className="btn-back" onClick={() => navigate('/')} type="button">
              ← Back
            </button>
            <div className="auth-logo" onClick={() => navigate('/')} role="button" tabIndex={0} aria-label="Go to home">
              <span className="logo-dot"></span>
              <span>PitchTank</span>
            </div>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">{isLogin ? 'Welcome back' : 'Create account'}</h1>
            <p className="auth-subtitle">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="auth-toggle-link"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          <div className="social-buttons">
            <button className="btn-social" onClick={handleGoogleAuth} disabled={loadingLocal} type="button">
              <span className="social-icon"><GoogleIcon /></span>
              Continue with Google
            </button>
            <button className="btn-social" disabled={loadingLocal} type="button">
              <span className="social-icon"><LinkedInIcon /></span>
              Continue with LinkedIn
            </button>
          </div>

          <div className="auth-divider">
            <span>or email</span>
          </div>

          <form className="auth-form" onSubmit={handleEmailAuth}>
            {!isLogin && (
              <>
                {/* Role Selection */}
                <div className="form-group">
                  <label className="form-label">I am a...</label>
                  <div className="role-cards">
                    <button
                      type="button"
                      className={`role-card${role === 'founder' ? ' active' : ''}`}
                      onClick={() => { setRole('founder'); setError(''); }}
                    >
                      <div className="role-icon">🚀</div>
                      <div className="role-name">Founder</div>
                      <div className="role-desc">Submit &amp; pitch startups</div>
                    </button>
                    <button
                      type="button"
                      className={`role-card${role === 'investor' ? ' active' : ''}`}
                      onClick={() => { setRole('investor'); setError(''); }}
                    >
                      <div className="role-icon">💼</div>
                      <div className="role-name">Investor</div>
                      <div className="role-desc">Discover &amp; fund startups</div>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div className="form-input-wrap">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon closed={!showPassword} />
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="form-utils">
                <button type="button" className="forgot-link">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loadingLocal}
            >
              {loadingLocal ? 'Processing...' : (isLogin ? 'Log in' : 'Get started')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
