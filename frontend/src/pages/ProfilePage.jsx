import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  FileText,
  MessageSquare,
  HelpCircle,
  Loader2,
  GraduationCap,
  Building2,
  Calendar,
  User,
  Info,
  CheckCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { fetchMyResources } from '@/lib/resources';
import { fetchQueriesOnMyResources } from '@/lib/queries';
import { fetchDiscussions } from '@/lib/discussions';

const TAB_OPTIONS = [
  { key: 'uploads', label: 'My Uploads', icon: FileText },
  { key: 'discussions', label: 'Discussions Started', icon: MessageSquare },
  { key: 'queries', label: 'Doubts & Queries', icon: HelpCircle },
];

const C = {
  bg:           'var(--dash-bg)',          // #F6ECE3
  card:         'var(--dash-card)',         // #FFFFFF
  border:       'var(--dash-border)',       // #b7a7a9
  borderSubtle: 'rgba(183,167,169,0.25)',
  accent:       'var(--dash-accent)',       // #b7a7a9
  accentHover:  'var(--dash-accent-hover)',// #91766E
  accentBg:     'rgba(183,167,169,0.12)',
  text:         'var(--dash-text)',         // #000000
  textSoft:     'var(--dash-text-soft)',    // #4a3a37
  textMuted:    'var(--dash-text-muted)',   // #75625f
  white:        '#ffffff',
  errorBg:      '#fff0ef',
  errorBorder:  'rgba(178,93,82,0.3)',
  errorText:    '#b25d52',
};

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('uploads');
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploads, setUploads] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [queries, setQueries] = useState([]);
  const [editing, setEditing] = useState(Boolean(searchParams.get('mode') === 'edit'));

  const loadProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: profileData }, uploadsData, queriesData, discussionsData] = await Promise.all([
        api.get('/api/auth/profile'),
        fetchMyResources(),
        fetchQueriesOnMyResources(),
        fetchDiscussions(),
      ]);
      setProfile(profileData.user);
      setUploads(uploadsData);
      setQueries(queriesData);
      setDiscussions(discussionsData.filter((item) => Number(item.posted_by?.id) === Number(profileData.user.id)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    setEditing(Boolean(searchParams.get('mode') === 'edit'));
  }, [searchParams]);

  const handleSave = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/api/auth/profile', payload);
      setProfile(data.user);
      setEditing(false);
      setSearchParams({});
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => ({
    uploads: uploads.length,
    discussions: discussions.length,
    queries: queries.length,
  }), [uploads.length, discussions.length, queries.length]);

  // Form State
  const [form, setForm] = useState({
    name: '',
    college: '',
    branch: '',
    current_year: '',
    bio: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        college: profile.college || '',
        branch: profile.branch || '',
        current_year: profile.current_year || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const renderTabContent = () => {
    if (activeTab === 'uploads') {
      if (!uploads.length) {
        return (
          <div style={{ padding: '32px 0', textAlign: 'center', color: C.textMuted }}>
            <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: 14 }}>You have not uploaded any study resources yet.</p>
          </div>
        );
      }
      return (
        <div style={{ display: 'grid', gap: 12 }}>
          {uploads.map((item) => (
            <div
              key={item.id}
              style={{
                background: C.card,
                border: `1px solid ${C.borderSubtle}`,
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={18} color={C.accentHover} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.textSoft }}>
                  {item.branch} · Semester {item.semester} · {item.type}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'discussions') {
      if (!discussions.length) {
        return (
          <div style={{ padding: '32px 0', textAlign: 'center', color: C.textMuted }}>
            <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: 14 }}>You have not started any forum discussions yet.</p>
          </div>
        );
      }
      return (
        <div style={{ display: 'grid', gap: 12 }}>
          {discussions.map((item) => (
            <div
              key={item.id}
              style={{
                background: C.card,
                border: `1px solid ${C.borderSubtle}`,
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={18} color={C.accentHover} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: C.textSoft }}>
                  Category: {item.category} · {item.upvotes} Upvotes
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!queries.length) {
      return (
        <div style={{ padding: '32px 0', textAlign: 'center', color: C.textMuted }}>
          <HelpCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: 14 }}>You have not raised any questions or queries yet.</p>
        </div>
      );
    }
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {queries.map((item) => (
          <div
            key={item.id}
            style={{
              background: C.card,
              border: `1px solid ${C.borderSubtle}`,
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HelpCircle size={18} color={C.accentHover} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: C.textSoft }}>
                On resource: {item.resource?.title || 'Study Material'} · {item.resource?.branch || ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const displayName = profile?.name || user?.name || 'Student';
  const displayBranch = profile?.branch || user?.branch || 'Branch not specified';
  const displayCollege = profile?.college || user?.college || 'College not specified';
  const displayYear = profile?.current_year || user?.current_year || '';
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <DashboardLayout
      user={profile || user}
      activeNav=""
      onNavChange={() => navigate('/dashboard')}
      onUpload={() => navigate('/dashboard')}
      onLogout={() => { logout(); navigate('/', { replace: true }); }}
      searchQuery=""
      onSearchChange={() => {}}
      onSearchSubmit={() => navigate('/dashboard')}
    >
      {/* Back button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'transparent',
            border: `1px solid ${C.border}`,
            color: C.text,
            borderRadius: 9,
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 600,
            fontSize: 13.5,
            fontFamily: "'Inter', sans-serif",
            transition: 'background 0.15s ease',
          }}
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textSoft, fontSize: 14, padding: '40px 0' }}>
          <Loader2 size={20} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
          Loading profile details…
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px 28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    background: C.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: C.white,
                    fontSize: 32,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </div>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>
                    {displayName}
                  </h1>
                  <p style={{ fontSize: 14, color: C.textSoft, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <GraduationCap size={15} color={C.textMuted} />
                    {displayBranch} {displayYear && `· Year ${displayYear}`}
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setSearchParams({ mode: 'edit' })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: C.accent,
                    color: C.white,
                    border: 'none',
                    borderRadius: 9,
                    padding: '10px 18px',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'background 0.2s ease',
                  }}
                >
                  <Edit3 size={15} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {editing ? (
            /* Redesigned Premium Edit Profile Settings */
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: `1px solid ${C.borderSubtle}`, paddingBottom: 16 }}>
                <User size={20} color={C.textMuted} />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>Profile Settings</h2>
              </div>

              {error && (
                <div style={{ padding: '12px 14px', borderRadius: 10, background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorText, fontSize: 13.5, marginBottom: 20 }}>
                  {error}
                </div>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSave(form);
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textSoft, marginBottom: 8 }}>
                      Full Name
                    </label>
                    <input
                      value={form.name}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="e.g. Aarav Kulkarni"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textSoft, marginBottom: 8 }}>
                      College
                    </label>
                    <input
                      value={form.college}
                      onChange={(event) => setForm((prev) => ({ ...prev, college: event.target.value }))}
                      placeholder="e.g. VJTI Mumbai"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textSoft, marginBottom: 8 }}>
                      Branch
                    </label>
                    <input
                      value={form.branch}
                      onChange={(event) => setForm((prev) => ({ ...prev, branch: event.target.value }))}
                      placeholder="e.g. Computer Engineering"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textSoft, marginBottom: 8 }}>
                      Current Year
                    </label>
                    <select
                      value={form.current_year}
                      onChange={(event) => setForm((prev) => ({ ...prev, current_year: event.target.value }))}
                      required
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textSoft, marginBottom: 8 }}>
                    Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                    placeholder="Tell us about your academic interests, subjects you enjoy, etc."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
                  />
                </div>

                <div style={{ display: 'flex', justifySelf: 'flex-end', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams({});
                      setEditing(false);
                    }}
                    style={{
                      background: 'transparent',
                      color: C.text,
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      padding: '10px 20px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      background: C.accent,
                      color: C.white,
                      border: 'none',
                      borderRadius: 9,
                      padding: '10px 24px',
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1,
                      fontSize: 14,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {saving ? 'Saving Changes…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Premium Profile Layout Grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, alignItems: 'start' }}>
              {/* Left Column: About & Quick Stats Info Cards */}
              <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Stats Overview */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textMuted, margin: '0 0 16px' }}>
                    Quick Stats
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Study Resources Shared', value: stats.uploads, icon: FileText },
                      { label: 'Discussions Opened', value: stats.discussions, icon: MessageSquare },
                      { label: 'Queries Raised', value: stats.queries, icon: HelpCircle },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: C.bg,
                          padding: '12px 16px',
                          borderRadius: 12,
                          border: `1px solid ${C.borderSubtle}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <item.icon size={16} color={C.textSoft} />
                          <span style={{ fontSize: 13.5, color: C.textSoft }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Profile Info */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textMuted, margin: '0 0 16px' }}>
                    About Me
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { label: 'College / Institute', value: displayCollege, icon: Building2 },
                      { label: 'Academic Branch', value: displayBranch, icon: GraduationCap },
                      { label: 'Current Semester Year', value: displayYear ? `${displayYear} Year` : 'Not Specified', icon: Calendar },
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <item.icon size={15} color={C.textSoft} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11.5, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{item.value}</div>
                        </div>
                      </div>
                    ))}

                    <div style={{ borderTop: `1px solid ${C.borderSubtle}`, paddingTop: 16, marginTop: 4 }}>
                      <div style={{ fontSize: 11.5, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Info size={13} />
                        Bio
                      </div>
                      <p style={{ fontSize: 13.5, color: C.textSoft, lineHeight: 1.6, margin: 0, fontStyle: profile?.bio ? 'normal' : 'italic' }}>
                        {profile?.bio || 'This student hasn\'t written a bio yet.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Timeline tabs and actual activity list */}
              <div style={{ gridColumn: 'span 8', background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Activity Stream</h2>
                    <p style={{ fontSize: 13, color: C.textSoft, margin: 0 }}>Track items you shared or discussed across campus</p>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${C.borderSubtle}`, paddingBottom: 16, marginBottom: 20, overflowX: 'auto' }}>
                  {TAB_OPTIONS.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setActiveTab(item.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          background: active ? C.accent : 'transparent',
                          border: `1px solid ${active ? C.accent : C.border}`,
                          color: active ? C.white : C.text,
                          borderRadius: 999,
                          padding: '10px 18px',
                          fontWeight: 600,
                          fontSize: 13.5,
                          cursor: 'pointer',
                          fontFamily: "'Inter', sans-serif",
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Icon size={14} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div style={{ padding: '10px 12px', borderRadius: 10, background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorText, marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                {renderTabContent()}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
