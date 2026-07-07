import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  HelpCircle,
  Loader2,
  MessageSquare,
  Pencil,
  Settings as SettingsIcon,
  User,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { fetchDiscussions } from '@/lib/discussions';
import { fetchQueriesOnMyResources } from '@/lib/queries';
import { fetchMyResources } from '@/lib/resources';

const C = {
  bg: 'var(--dash-bg)',
  card: 'var(--dash-card)',
  border: 'var(--dash-border)',
  borderSubtle: 'rgba(183,167,169,0.25)',
  accent: 'var(--dash-accent)',
  accentHover: 'var(--dash-accent-hover)',
  accentBg: 'rgba(183,167,169,0.12)',
  text: 'var(--dash-text)',
  textSoft: 'var(--dash-text-soft)',
  textMuted: 'var(--dash-text-muted)',
  white: '#ffffff',
  danger: '#b25d52',
  dangerBg: '#fff0ef',
};

const SECTION_OPTIONS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'activity', label: 'Activity', icon: SettingsIcon },
  { key: 'account', label: 'Account', icon: Bell },
];

const ACTIVITY_TABS = [
  { key: 'uploads', label: 'Uploads', icon: FileText },
  { key: 'queries', label: 'Queries', icon: HelpCircle },
  { key: 'discussions', label: 'Discussions', icon: MessageSquare },
];

const inputStyle = {
  width: '100%',
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: '12px 14px',
  color: C.text,
  fontSize: 14,
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('profile');
  const [activeActivityTab, setActiveActivityTab] = useState('uploads');
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState([]);
  const [queries, setQueries] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [editing, setEditing] = useState(Boolean(searchParams.get('mode') === 'edit'));
  const [form, setForm] = useState({
    name: '',
    college: '',
    branch: '',
    current_year: '',
    bio: '',
  });

  const loadSettingsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: profileData }, uploadsData, queriesData, discussionsData] = await Promise.all([
        api.get('/api/auth/profile'),
        fetchMyResources(),
        fetchQueriesOnMyResources(),
        fetchDiscussions(),
      ]);

      const nextProfile = profileData.user;
      setProfile(nextProfile);
      setUploads(uploadsData);
      setQueries(queriesData);
      setDiscussions(discussionsData.filter((item) => Number(item.posted_by?.id) === Number(nextProfile.id)));
      setForm({
        name: nextProfile.name || '',
        college: nextProfile.college || '',
        branch: nextProfile.branch || '',
        current_year: nextProfile.current_year || '',
        bio: nextProfile.bio || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your settings right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettingsData();
  }, []);

  useEffect(() => {
    setEditing(Boolean(searchParams.get('mode') === 'edit'));
  }, [searchParams]);

  const stats = useMemo(() => ({
    uploads: uploads.length,
    discussions: discussions.length,
    queries: queries.length,
  }), [uploads.length, discussions.length, queries.length]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/api/auth/profile', form);
      setProfile(data.user);
      setEditing(false);
      setSearchParams({});
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('This permanently deletes your account and everything you have uploaded. Continue?');
    if (!confirmed) return;

    try {
      await api.delete('/api/auth/account', { data: { password: window.prompt('Enter your password to confirm account deletion:') || '' } });
      logout();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete your account right now.');
    }
  };

  const renderProfileContent = () => {
    if (loading) {
      return (
        <div style={{ padding: '36px 0', textAlign: 'center', color: C.textMuted }}>
          <Loader2 size={24} className="spin" style={{ margin: '0 auto 10px', animation: 'spin 1s linear infinite' }} />
          <div>Loading your profile…</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, var(--dash-accent), var(--dash-accent-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>
                {(profile?.name || 'U').split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{profile?.name || 'Your name'}</div>
                <div style={{ fontSize: 13, color: C.textSoft, marginTop: 3 }}>{profile?.branch || 'Add your branch'} · {profile?.current_year ? `Year ${profile.current_year}` : 'Year not set'}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditing((prev) => !prev);
                if (searchParams.get('mode') === 'edit') {
                  setSearchParams({});
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: `1px solid ${C.border}`,
                background: C.white,
                color: C.text,
                borderRadius: 999,
                padding: '9px 14px',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Pencil size={15} />
              {editing ? 'Cancel edit' : 'Edit profile'}
            </button>
          </div>

          {!editing ? (
            <div style={{ marginTop: 18, display: 'grid', gap: 14, color: C.textSoft, fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Building2 size={16} color={C.accentHover} />
                <span>{profile?.college || 'Add your college'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <GraduationCap size={16} color={C.accentHover} />
                <span>{profile?.branch || 'Add your branch'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Calendar size={16} color={C.accentHover} />
                <span>{profile?.current_year ? `Current year: ${profile.current_year}` : 'Current year not set'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <User size={16} color={C.accentHover} />
                <span>{profile?.bio || 'Add a short bio to introduce yourself.'}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ marginTop: 18, display: 'grid', gap: 14 }}>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <label style={{ display: 'grid', gap: 8, fontSize: 13.5, fontWeight: 600, color: C.text }}>
                  <span>Full name</span>
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your full name"
                  />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13.5, fontWeight: 600, color: C.text }}>
                  <span>College</span>
                  <input
                    style={inputStyle}
                    value={form.college}
                    onChange={(event) => setForm((prev) => ({ ...prev, college: event.target.value }))}
                    placeholder="Your college"
                  />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13.5, fontWeight: 600, color: C.text }}>
                  <span>Branch</span>
                  <input
                    style={inputStyle}
                    value={form.branch}
                    onChange={(event) => setForm((prev) => ({ ...prev, branch: event.target.value }))}
                    placeholder="Your branch"
                  />
                </label>
                <label style={{ display: 'grid', gap: 8, fontSize: 13.5, fontWeight: 600, color: C.text }}>
                  <span>Current year</span>
                  <input
                    style={inputStyle}
                    value={form.current_year}
                    onChange={(event) => setForm((prev) => ({ ...prev, current_year: event.target.value }))}
                    placeholder="1, 2, 3 or 4"
                  />
                </label>
              </div>

              <label style={{ display: 'grid', gap: 8, fontSize: 13.5, fontWeight: 600, color: C.text }}>
                <span>Bio</span>
                <textarea
                  style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }}
                  value={form.bio}
                  onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                  placeholder="Tell other students a little about yourself"
                />
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', background: C.accent, color: C.white, borderRadius: 999, padding: '10px 16px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>
                  {saving ? <Loader2 size={15} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={15} />}
                  Save changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const renderActivityContent = () => {
    const items = activeActivityTab === 'uploads'
      ? uploads
      : activeActivityTab === 'queries'
        ? queries
        : discussions;

    if (!items.length) {
      return (
        <div style={{ background: C.card, border: `1px solid ${C.borderSubtle}`, borderRadius: 16, padding: 24, textAlign: 'center', color: C.textMuted }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Nothing to show here yet.</div>
          <div style={{ marginTop: 8, fontSize: 13 }}>Your {activeActivityTab} will appear here once you create or upload something.</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: C.card, border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>{item.title || item.subject_name || 'Untitled item'}</div>
              <div style={{ fontSize: 13, color: C.textSoft }}>
                {activeActivityTab === 'uploads' && (item.branch ? `${item.branch} · ${item.subject_name || 'resource'}` : 'Study resource')}
                {activeActivityTab === 'queries' && (item.resource_title ? `On ${item.resource_title}` : 'Raised by you')}
                {activeActivityTab === 'discussions' && (item.category ? `Category · ${item.category}` : 'Discussion started by you')}
              </div>
            </div>
            <button type="button" style={{ border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 999, padding: '8px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              View
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout
      user={user}
      activeNav="settings"
      onNavChange={() => navigate('/dashboard')}
      onUpload={() => navigate('/dashboard')}
      onLogout={() => { logout(); navigate('/', { replace: true }); }}
      onSearchSubmit={() => navigate('/dashboard')}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .settings-shell { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 24px; }
        .settings-nav { background: var(--dash-card); border: 1px solid var(--dash-border); border-radius: 16px; padding: 16px 12px; align-self: start; position: sticky; top: 24px; }
        .settings-nav button { width: 100%; border: none; background: transparent; color: var(--dash-text-soft); padding: 10px 12px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: left; }
        .settings-nav button.active { background: var(--dash-bg); color: var(--dash-text); }
        .settings-panel { background: var(--dash-card); border: 1px solid var(--dash-border); border-radius: 20px; padding: 24px 24px 28px; }
        @media (max-width: 900px) {
          .settings-shell { grid-template-columns: 1fr; }
          .settings-nav { position: static; }
          .settings-nav { display: flex; gap: 8px; overflow-x: auto; }
          .settings-nav button { white-space: nowrap; }
        }
      `}</style>

      <div style={{ padding: '24px 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.textSoft, marginBottom: 6 }}>
              <ArrowLeft size={15} />
              <span>Account settings</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: 0 }}>Settings</h1>
            <div style={{ marginTop: 6, fontSize: 14, color: C.textSoft }}>Update your profile, review what you have shared, and manage account actions.</div>
          </div>
        </div>

        {error ? (
          <div style={{ background: C.dangerBg, border: `1px solid rgba(178,93,82,0.22)`, color: C.danger, borderRadius: 12, padding: '10px 12px', marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="settings-shell">
          <aside className="settings-nav">
            {SECTION_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = activeSection === option.key;
              return (
                <button key={option.key} type="button" className={active ? 'active' : ''} onClick={() => setActiveSection(option.key)}>
                  <Icon size={16} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </aside>

          <section className="settings-panel">
            {activeSection === 'profile' ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>My profile</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, color: C.textSoft }}>This is what other students see next to the materials and discussions you share.</div>
                </div>
                {renderProfileContent()}
              </>
            ) : null}

            {activeSection === 'activity' ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Your activity</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, color: C.textSoft }}>Browse your uploads, queries and discussions in one place.</div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
                  {ACTIVITY_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeActivityTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveActivityTab(tab.key)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          border: active ? 'none' : `1px solid ${C.border}`,
                          background: active ? C.accent : C.white,
                          color: active ? C.white : C.text,
                          borderRadius: 999,
                          padding: '9px 13px',
                          fontSize: 13.5,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Icon size={15} />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16, color: C.textSoft, fontSize: 13 }}>
                  <span><strong style={{ color: C.text }}>{stats.uploads}</strong> uploads</span>
                  <span><strong style={{ color: C.text }}>{stats.queries}</strong> queries</span>
                  <span><strong style={{ color: C.text }}>{stats.discussions}</strong> discussions</span>
                </div>

                {renderActivityContent()}
              </>
            ) : null}

            {activeSection === 'account' ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Account</div>
                  <div style={{ marginTop: 6, fontSize: 13.5, color: C.textSoft }}>Keep your account secure and decide what you want to do next.</div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 16, background: C.bg }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Email notifications</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: C.textSoft }}>You will be notified when someone answers your query.</div>
                  </div>

                  <div style={{ border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 16, background: C.bg }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Appearance</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: C.textSoft }}>Switch between light and dark themes whenever you like.</div>
                  </div>

                  <div style={{ border: `1px solid ${C.borderSubtle}`, borderRadius: 14, padding: 16, background: C.bg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.danger }}>Log out of all devices</div>
                        <div style={{ marginTop: 6, fontSize: 13, color: C.textSoft }}>Ends every active session, including this one.</div>
                      </div>
                      <button type="button" style={{ border: `1px solid ${C.border}`, background: C.white, color: C.text, borderRadius: 999, padding: '9px 13px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                        Log out everywhere
                      </button>
                    </div>
                  </div>

                  <div style={{ border: `1px solid rgba(178,93,82,0.22)`, borderRadius: 14, padding: 16, background: C.dangerBg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.danger }}>Delete account</div>
                        <div style={{ marginTop: 6, fontSize: 13, color: C.textSoft }}>This permanently removes your profile and everything you have uploaded.</div>
                      </div>
                      <button type="button" onClick={handleDeleteAccount} style={{ border: `1px solid rgba(178,93,82,0.28)`, background: C.white, color: C.danger, borderRadius: 999, padding: '9px 13px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                        Delete account
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
