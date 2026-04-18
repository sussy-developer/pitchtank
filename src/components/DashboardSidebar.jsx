import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';

function getInitials(name) {
  if (!name) return 'PT';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'PT';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9"></rect>
      <rect x="14" y="3" width="7" height="5"></rect>
      <rect x="14" y="12" width="7" height="9"></rect>
      <rect x="3" y="16" width="7" height="5"></rect>
    </svg>
  ),
  Submit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Projects: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Message: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Funding: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )
};

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  
  // Use React Router to determine active state
  const pathname = window.location.pathname;
  const getActiveTab = () => {
    // Founder
    if (pathname.includes('/dashboard/submit')) return 'submit';
    if (pathname.includes('/dashboard/projects')) return 'projects';
    if (pathname.includes('/dashboard/messages')) return 'messages';
    if (pathname.includes('/dashboard/funding')) return 'funding';
    if (pathname.includes('/dashboard/feedback')) return 'feedback';
    // Investor
    if (pathname.includes('/investor/marketplace')) return 'marketplace';
    if (pathname.includes('/investor/investments')) return 'investments';
    if (pathname.includes('/investor/messages')) return 'inv-messages';
    if (pathname.includes('/investor/watchlist')) return 'watchlist';
    if (pathname.includes('/investor/analytics')) return 'analytics';
    // General
    if (pathname.includes('/settings')) return 'settings';
    return pathname.includes('/investor') ? 'inv-dashboard' : 'dashboard';
  };
  const activeTab = getActiveTab();

  const displayName = userData?.name || user?.displayName || 'PitchTank User';
  const roleDisplay = userData?.role === 'investor' ? 'Investor' : 'Founder';
  const role = userData?.role || 'founder';
  const initials = getInitials(displayName);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  // Additional icons for Investor
  const InvIcons = {
    Marketplace: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Investments: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    Watchlist: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
    Analytics: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  };

  const founderMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Icons.Dashboard />, path: '/dashboard' },
    { id: 'submit', label: 'Submit startup', icon: <Icons.Submit />, path: '/dashboard/submit' },
    { id: 'projects', label: 'My projects', icon: <Icons.Projects />, badge: 2, path: '/dashboard/projects' },
    { id: 'messages', label: 'Messages', icon: <Icons.Message />, badge: 3, path: '/dashboard/messages' },
    { id: 'funding', label: 'Funding status', icon: <Icons.Funding />, path: '/dashboard/funding' },
    { id: 'settings', label: 'Settings', icon: <Icons.Settings />, path: '/settings' },
  ];

  const investorMenuItems = [
    { id: 'inv-dashboard', label: 'Dashboard', icon: <Icons.Dashboard />, path: '/investor' },
    { id: 'marketplace', label: 'Marketplace', icon: <InvIcons.Marketplace />, path: '/investor/marketplace' },
    { id: 'investments', label: 'My investments', icon: <InvIcons.Investments />, badge: 5, path: '/investor/investments' },
    { id: 'inv-messages', label: 'Messages', icon: <Icons.Message />, badge: 2, path: '/investor/messages' },
    { id: 'watchlist', label: 'Watchlist', icon: <InvIcons.Watchlist />, badge: 8, path: '/investor/watchlist' },
    { id: 'analytics', label: 'Analytics', icon: <InvIcons.Analytics />, path: '/investor/analytics' },
    { id: 'settings', label: 'Settings', icon: <Icons.Settings />, path: '/settings' },
  ];

  const menuItems = role === 'investor' ? investorMenuItems : founderMenuItems;

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="logo-dot"></span>
        <span className="logo-text">PitchTank</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleClick(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="avatar">{initials}</div>
          <div className="user-details">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{roleDisplay}</span>
          </div>
          <button 
            className="logout-btn-sidebar" 
            title="Log out"
            onClick={handleLogout}
          >
            <Icons.Logout />
          </button>
        </div>
      </div>
    </aside>
  );
}
