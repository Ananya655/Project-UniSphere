import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  MessageSquare,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
  FileText,
  Search,
  Bell,
  Plus,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * UniSphere Dashboard
 * Post-login/register landing page.
 * Darker variant of the UniSphere design system (ink-navy surface,
 * indigo + coral accents, Fraunces/Inter/JetBrains Mono type stack).
 */

const NAV_ITEMS = [
  { key: "uploads", label: "My uploads", icon: Upload },
  { key: "browse", label: "Browse resources", icon: LayoutGrid },
  { key: "queries", label: "Resource queries", icon: HelpCircle },
  { key: "discussions", label: "Discussions", icon: MessageSquare },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("uploads");

  const displayUser = {
    name: user?.name || "Student",
    college: user?.college || "",
    branch: user?.branch || "",
    initial: (user?.name?.trim()?.charAt(0) || "U").toUpperCase(),
  };

  const hasUploads = false;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#13131F",
        color: "#EDEDF4",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .uni-scroll::-webkit-scrollbar { width: 6px; }
        .uni-scroll::-webkit-scrollbar-thumb { background: #2A2A3D; border-radius: 4px; }
        .uni-nav-item:hover { background: #1C1C2B !important; color: #FFFFFF !important; }
        .uni-nav-item:hover .uni-nav-icon { color: #FFFFFF !important; }
        .uni-upload-btn:hover { background: #E54F2E !important; }
        .uni-account:hover { background: #1C1C2B !important; }
        .uni-icon-btn:hover { background: #1C1C2B !important; }
      `}</style>

      {/* ======================== SIDEBAR ======================== */}
      <aside
        style={{
          width: 264,
          flexShrink: 0,
          borderRight: "1px solid #23233380",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 28px" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#2D5FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M4 6.5L12 3l8 3.5-8 3.5-8-3.5z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M7 10v5.5C7 17 9.2 18.5 12 18.5s5-1.5 5-3V10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 7.5V13" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-0.01em",
              color: "#fff",
            }}
          >
            UniSphere
          </span>
        </div>

        {/* Account block — top-left corner per spec */}
        <div
          className="uni-account"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "10px 10px",
            borderRadius: 10,
            cursor: "pointer",
            marginBottom: 22,
            border: "1px solid #23233380",
            transition: "background 0.15s ease",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2D5FFF, #1E3FCC)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 15,
              color: "#fff",
            }}
          >
            {displayUser.initial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayUser.name}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: "#8C8CA8",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayUser.branch}
            </div>
          </div>
          <ChevronDown size={15} color="#6B6B8A" />
        </div>

        {/* Upload CTA */}
        <button
          className="uni-upload-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "#FF6B4A",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "12px 0",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            marginBottom: 26,
            transition: "background 0.15s ease",
          }}
        >
          <Plus size={16} strokeWidth={2.4} />
          Upload resource
        </button>

        {/* Nav */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "#5A5A78",
            padding: "0 10px 10px",
          }}
        >
          Menu
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                className="uni-nav-item"
                onClick={() => setActiveNav(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "10px 11px",
                  borderRadius: 9,
                  border: "none",
                  background: active ? "#1C1C2B" : "transparent",
                  color: active ? "#fff" : "#A3A3BD",
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease, color 0.15s ease",
                  position: "relative",
                }}
              >
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: -16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 18,
                      borderRadius: 3,
                      background: "#2D5FFF",
                    }}
                  />
                )}
                <Icon
                  className="uni-nav-icon"
                  size={17}
                  color={active ? "#A9BBFF" : "#6B6B8A"}
                  strokeWidth={2}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom: settings/logout */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 2, paddingTop: 16, borderTop: "1px solid #23233380" }}>
          <button
            className="uni-nav-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "10px 11px",
              borderRadius: 9,
              border: "none",
              background: "transparent",
              color: "#A3A3BD",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Settings size={17} color="#6B6B8A" />
            Settings
          </button>
          <button
            className="uni-nav-item"
            type="button"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "10px 11px",
              borderRadius: 9,
              border: "none",
              background: "transparent",
              color: "#A3A3BD",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <LogOut size={17} color="#6B6B8A" />
            Log out
          </button>
        </div>
      </aside>

      {/* ======================== MAIN ======================== */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 36px",
            borderBottom: "1px solid #23233380",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#1A1A28",
              border: "1px solid #2A2A3D",
              borderRadius: 9,
              padding: "9px 14px",
              width: 360,
              maxWidth: "100%",
            }}
          >
            <Search size={16} color="#6B6B8A" />
            <input
              placeholder="Search notes, PYQs, subjects..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#EDEDF4",
                fontSize: 13.5,
                fontFamily: "'Inter', sans-serif",
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              className="uni-icon-btn"
              style={{
                width: 38,
                height: 38,
                borderRadius: 9,
                border: "1px solid #2A2A3D",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              <Bell size={16} color="#A3A3BD" />
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="uni-scroll" style={{ flex: 1, overflowY: "auto", padding: "40px 36px 60px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#FF8F73",
                fontWeight: 500,
              }}
            >
              My uploads
            </span>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: 30,
                color: "#fff",
                marginTop: 10,
                marginBottom: 8,
                letterSpacing: "-0.01em",
              }}
            >
              Welcome back, {displayUser.name.split(" ")[0]}
            </h1>
            <p style={{ fontSize: 14.5, color: "#8C8CA8", marginBottom: 40 }}>
              Everything you&apos;ve shared with {displayUser.college} lives here.
            </p>

            {hasUploads ? (
              <UploadsList />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ======================== EMPTY STATE ======================== */
function EmptyState() {
  return (
    <div
      style={{
        border: "1.5px dashed #2A2A3D",
        borderRadius: 18,
        padding: "72px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background: "#16161F",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: "#1C1C2B",
          border: "1px solid #2A2A3D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <FileText size={26} color="#A9BBFF" strokeWidth={1.6} />
      </div>
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: 20,
          color: "#fff",
          marginBottom: 8,
        }}
      >
        No uploads yet
      </h2>
      <p style={{ fontSize: 14, color: "#8C8CA8", maxWidth: 360, marginBottom: 28 }}>
        Share your first set of notes or a question paper — it'll show up here, searchable by every student on your campus.
      </p>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#FF6B4A",
          color: "#fff",
          border: "none",
          borderRadius: 9,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
        }}
      >
        <Upload size={16} strokeWidth={2.2} />
        Upload your first resource
      </button>
    </div>
  );
}

/* ======================== POPULATED STATE (preview) ======================== */
function UploadsList() {
  const items = [
    { title: "DBMS Unit 3 — Normalization", meta: "Notes · Sem 5 · CSE", downloads: 142 },
    { title: "Operating Systems End-Sem 2024", meta: "PYQ · Sem 5 · CSE", downloads: 89 },
    { title: "Computer Networks Reference", meta: "Reference · Sem 6 · CSE", downloads: 34 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#16161F",
            border: "1px solid #23233380",
            borderRadius: 13,
            padding: "16px 20px",
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "#1C1C2B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FileText size={19} color="#A9BBFF" strokeWidth={1.6} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: "#fff" }}>{item.title}</div>
            <div style={{ fontSize: 12.5, color: "#8C8CA8", marginTop: 2 }}>{item.meta}</div>
          </div>
          <div style={{ fontSize: 12.5, color: "#6B6B8A", fontFamily: "'JetBrains Mono', monospace" }}>
            {item.downloads} downloads
          </div>
        </div>
      ))}
    </div>
  );
}



