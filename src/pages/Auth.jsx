import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/auth.css';
import { useAuth } from '../hooks/AuthContext';
import { GoogleIcon, LinkedInIcon, BackIcon, EyeIcon } from '../components/Icons';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, googleSignIn, linkedInSignIn } = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'signup';
  const [view, setView] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const checkUserNavigation = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const defaultName = user.displayName || signupName || '';
        await setDoc(userRef, {
          uid: user.uid,
          name: defaultName,
          email: user.email,
          photoURL: user.photoURL || '',
          role: null,
          onboardingComplete: false,
          createdAt: new Date().toISOString()
        }, { merge: true });
        navigate('/onboarding');
      } else {
        const userData = userSnap.data();
        if (!userData.onboardingComplete) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error("Error navigating user flow", err);
      setError(err.message || "An unexpected error occurred finalizing login. Please check your connection.");
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await googleSignIn();
      await checkUserNavigation(result.user);
    } catch (err) {
      console.error("Google Auth error", err);
      setError("Failed to sign in with Google.");
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await linkedInSignIn();
      await checkUserNavigation(result.user);
    } catch (err) {
      console.error("LinkedIn Auth error", err);
      setError("Failed to sign in with LinkedIn.");
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !loginPassword) return;
    setLoading(true);
    setError('');
    try {
      const userCredential = await login(email, loginPassword);
      await checkUserNavigation(userCredential.user);
    } catch (err) {
      console.error("Login error", err);
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    if (signupPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (signupPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signup(signupEmail, signupPassword);
      await checkUserNavigation(userCredential.user);
    } catch (err) {
      console.error("Signup error", err);
      setError(err.message || "Failed to create account.");
      setLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === 'signup' ? 'login' : 'signup');
    setError('');
    setPasswordError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow blur-1"></div>
      <div className="auth-bg-glow blur-2"></div>
      <div className="auth-grid-bg"></div>
      
      <div className="auth-layout-wrapper">
        <div className="auth-card">
          <div className="auth-top-nav">
            <div className="auth-logo" onClick={() => navigate('/')}>
              <span className="logo-dot"></span>
              <span>PitchTank</span>
            </div>
            <button className="back-btn" onClick={() => navigate('/')}>
              <BackIcon />
              <span>Back</span>
            </button>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">
              {view === 'signup' ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="auth-subtitle">
              {view === 'signup' 
                ? 'Join the community of founders and investors.' 
                : 'Log in to manage your startups and investments.'}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="social-auth-grid">
            <button className="social-btn" onClick={handleGoogleAuth} disabled={loading}>
              <div className="social-icon">
                <GoogleIcon />
              </div>
              <span>Google</span>
            </button>
            <button className="social-btn" onClick={handleLinkedInAuth} disabled={loading}>
              <div className="social-icon">
                <LinkedInIcon />
              </div>
              <span>LinkedIn</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {view === 'signup' ? (
            <form className="auth-form" onSubmit={handleSignup}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe" 
                  required 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@example.com" 
                  required 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="••••••••" 
                    required 
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                  />
                  <button 
                    type="button" 
                    className="input-icon" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon closed={showPassword} />
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                />
              </div>
              {passwordError && <p className="error-text small">{passwordError}</p>}
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="john@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="label-row">
                  <label className="form-label">Password</label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <div className="form-input-wrap">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="••••••••" 
                    required 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="input-icon" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon closed={showPassword} />
                  </button>
                </div>
              </div>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              {view === 'signup' ? 'Already have an account?' : "Don't have an account?"}
              <button className="auth-toggle-btn" onClick={toggleView}>
                {view === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        <div className="auth-testimonials">
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "PitchTank helped me secure our seed round in just 3 weeks. The platform is incredibly intuitive for both founders and investors."
            </p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">A</div>
              <div>
                <p className="testimonial-name">Alex Rivera</p>
                <p className="testimonial-role">CEO at TechFlow</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "As an angel investor, I've seen hundreds of platforms. PitchTank's AI filtering and watermark protection are game changers."
            </p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">S</div>
              <div>
                <p className="testimonial-name">Sarah Chen</p>
                <p className="testimonial-role">Partner at VisionVentures</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
