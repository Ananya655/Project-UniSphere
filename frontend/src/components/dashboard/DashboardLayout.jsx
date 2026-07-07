import { useMemo, useState } from 'react';
import Logo from '../common/Logo';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  MessageSquare,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Settings,
  LogOut,
  User,
  Pencil,
} from 'lucide-react';

export const NAV_ITEMS = [
  { key: 'uploads', label: 'My uploads', icon: Upload },
  { key: 'browse', label: 'Browse resources', icon: LayoutGrid },
  { key: 'queries', label: 'Resource queries', icon: HelpCircle },
  { key: 'discussions', label: 'Discussions', icon: MessageSquare },
];

export const DASHBOARD_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; }
  .uni-scroll::-webkit-scrollbar { width: 6px; }
  .uni-scroll::-webkit-scrollbar-thumb { background: rgba(183,167,169,0.4); border-radius: 4px; }
  .uni-nav-item:hover { background: var(--dash-bg) !important; color: var(--dash-text) !important; }
  .uni-nav-item:hover .uni-nav-icon { color: var(--dash-accent) !important; }
  .uni-upload-btn:hover { background: var(--dash-accent-hover) !important; }
  .uni-account:hover { background: var(--dash-bg) !important; color: var(--dash-text) !important; }
  .uni-icon-btn:hover { background: var(--dash-bg) !important; }
  .uni-card-btn:hover { background: var(--dash-bg) !important; border-color: var(--dash-border) !important; }
  .uni-download-btn:hover { background: var(--dash-accent-hover) !important; }
  .dashboard-brand { display:flex; align-items:center; gap:10px; text-decoration:none; margin-bottom:4px; }
  .dashboard-brand .brand-logo { width:68px; height:68px; }
  .dashboard-brand .brand-text { color:var(--dash-text) !important; font-size:22px; font-weight:700; }
  @keyframes uni-spin { to { transform: rotate(360deg); } }
`;

export default function DashboardLayout({
  user,
  activeNav,
  onNavChange,
  onUpload,
  onLogout,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  children,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const displayUser = {
    name: user?.name || 'Student',
    college: user?.college || '',
    branch: user?.branch || '',
    initial: (user?.name?.trim()?.charAt(0) || 'U').toUpperCase(),
  };

  const menuItems = useMemo(
    () => [
      { label: 'View profile', icon: User, action: () => { setMenuOpen(false); navigate('/profile'); } },
      { label: 'Edit profile', icon: Pencil, action: () => { setMenuOpen(false); navigate('/profile?mode=edit'); } },
      { label: 'Log out', icon: LogOut, action: onLogout },
    ],
    [navigate, onLogout],
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--dash-bg)',
        color: 'var(--dash-text)',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
      }}
    >
      <style>{DASHBOARD_STYLES}</style>

      <aside
        style={{
          width: 280,
          flexShrink: 0,
          background: 'var(--dash-bg)',
          borderRight: '1px solid var(--dash-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 20px' }}>
          <Logo to="/dashboard" className="dashboard-brand" />
        </div>

        <div
          className="uni-account"
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '10px 10px',
            borderRadius: 10,
            cursor: 'pointer',
            marginBottom: 22,
            border: '1px solid var(--dash-border)',
            transition: 'background 0.15s ease',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #b7a7a9, #91766E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 15,
              color: '#ffffff',
            }}
          >
            {displayUser.initial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: 'var(--dash-text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayUser.name}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--dash-text-soft)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {displayUser.branch}
            </div>
          </div>
          <ChevronDown size={15} color="var(--dash-text-soft)" />

          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: 'var(--dash-card)',
                border: '1px solid var(--dash-border)',
                borderRadius: 10,
                overflow: 'hidden',
                zIndex: 10,
                boxShadow: '0 8px 24px rgba(183,167,169,0.18)',
              }}
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--dash-text)',
                      fontSize: 13.5,
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={15} color="var(--dash-text-soft)" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          className="uni-upload-btn"
          onClick={onUpload}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--dash-accent)',
            color: 'var(--dash-btn-text)',
            border: 'none',
            borderRadius: 9,
            padding: '12px 0',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
            marginBottom: 26,
            transition: 'background 0.15s ease',
          }}
        >
          <Plus size={16} strokeWidth={2.4} />
          Upload resource
        </button>

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            color: 'var(--dash-text-soft)',
            padding: '0 10px 10px',
          }}
        >
          Menu
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className="uni-nav-item"
                onClick={() => onNavChange(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '10px 11px',
                  borderRadius: 9,
                  border: 'none',
                  background: active ? 'var(--dash-accent)' : 'transparent',
                  color: active ? 'var(--dash-btn-text)' : 'var(--dash-text-soft)',
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease, color 0.15s ease',
                  position: 'relative',
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 18,
                      borderRadius: 3,
                      background: 'var(--dash-text)',
                    }}
                  />
                )}
                <Icon
                  className="uni-nav-icon"
                  size={17}
                  color={active ? 'var(--dash-btn-text)' : 'var(--dash-text-soft)'}
                  strokeWidth={2}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            paddingTop: 16,
            borderTop: '1px solid var(--dash-border)',
          }}
        >
          <button
            type="button"
            className="uni-nav-item"
            onClick={() => navigate('/settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 11px',
              borderRadius: 9,
              border: 'none',
              background: activeNav === 'settings' ? 'var(--dash-accent)' : 'transparent',
              color: activeNav === 'settings' ? 'var(--dash-btn-text)' : 'var(--dash-text-soft)',
              fontSize: 14,
              fontWeight: activeNav === 'settings' ? 600 : 500,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s ease, color 0.15s ease',
            }}
          >
            <Settings size={17} color={activeNav === 'settings' ? 'var(--dash-btn-text)' : 'var(--dash-text-soft)'} />
            Settings
          </button>
          <button
            type="button"
            className="uni-nav-item"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 11px',
              borderRadius: 9,
              border: 'none',
              background: 'transparent',
              color: 'var(--dash-text-soft)',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <LogOut size={17} color="var(--dash-text-soft)" />
            Log out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 36px',
            borderBottom: '1px solid var(--dash-border)',
          }}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSearchSubmit?.();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--dash-card)',
              border: '1px solid var(--dash-border)',
              borderRadius: 9,
              padding: '9px 14px',
              width: 360,
              maxWidth: '100%',
            }}
          >
            <Search size={16} color="var(--dash-text-soft)" />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search notes, PYQs, subjects..."
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--dash-text)',
                fontSize: 13.5,
                fontFamily: "'Inter', sans-serif",
                width: '100%',
              }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              type="button"
              className="uni-icon-btn"
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                border: '1px solid var(--dash-border)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              <Bell size={16} color="var(--dash-text-soft)" />
            </button>
          </div>
        </header>

        <div className="uni-scroll" style={{ flex: 1, overflowY: 'auto', padding: '40px 36px 60px' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>{children}</div>
        </div>
      </main>
    </div>
  );
}
