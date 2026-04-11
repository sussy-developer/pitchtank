import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ onPricingClick }) {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = location.pathname === '/';

  return (
    <nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar-inner">
        <Link to="/" className="logo" aria-label="PitchTank Home">
          <span className="logo-dot" aria-hidden="true"></span>
          <span>PitchTank</span>
        </Link>

        {isLanding && (
          <ul className="nav-links">
            <li><a href="#how-it-works" className="nav-link">How it works</a></li>
            <li><a href="#startups" className="nav-link">Startups</a></li>
            <li><a href="#investors" className="nav-link">Investors</a></li>
            <li>
              <button
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={onPricingClick}
              >
                Pricing
              </button>
            </li>
          </ul>
        )}

        <div className="nav-actions">
          <button className="btn-ghost" type="button" onClick={() => navigate('/auth?mode=login')}>Log in</button>
          <button className="btn-primary-nav" type="button" onClick={() => navigate('/auth')}>Sign up free</button>
        </div>

        <MobileMenuToggle />
      </div>
    </nav>
  );
}

function MobileMenuToggle() {
  return (
    <button
      className="mobile-menu-toggle"
      type="button"
      aria-label="Open menu"
    >
      <div className="hamburger" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
}
