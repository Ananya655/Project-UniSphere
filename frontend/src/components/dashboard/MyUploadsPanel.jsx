import { useCallback, useEffect, useState } from 'react';
import { FileText, Loader2, Plus, Upload } from 'lucide-react';
import { fetchMyResources, formatResourceMeta } from '@/lib/resources';

export default function MyUploadsPanel({ user, onUpload, refreshKey, successMessage }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const list = await fetchMyResources();
      setResources(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your uploads.');
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources, refreshKey]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--dash-accent)',
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
          color: 'var(--dash-text)',
          marginTop: 10,
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}
      >
        Welcome back, {firstName}
      </h1>
      <p style={{ fontSize: 14.5, color: 'var(--dash-text-soft)', marginBottom: 32 }}>
        Everything you&apos;ve shared with {user?.college || 'your campus'} lives here.
      </p>

      {successMessage && (
        <div
          style={{
            marginBottom: 24,
            padding: '12px 16px',
            borderRadius: 10,
            background: 'var(--dash-accent-bg)',
            border: '1px solid var(--dash-border)',
            color: 'var(--dash-accent)',
            fontSize: 14,
          }}
        >
          {successMessage}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--dash-text-soft)', fontSize: 14 }}>
          <Loader2 size={18} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
          Loading your uploads…
        </div>
      ) : error ? (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: '#faeae8',
            border: '1px solid rgba(145,118,110,0.22)',
            color: '#b25d52',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : resources.length === 0 ? (
        <EmptyState onUpload={onUpload} />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 13.5, color: 'var(--dash-text-soft)' }}>
              {resources.length} resource{resources.length !== 1 ? 's' : ''} uploaded
            </span>
            <button
              type="button"
              onClick={onUpload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                background: 'transparent',
                color: 'var(--dash-accent)',
                border: '1px solid var(--dash-border)',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
              }}
            >
              <Plus size={14} strokeWidth={2.4} />
              Upload more
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {resources.map((resource) => (
              <div
                key={resource.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'var(--dash-card)',
                  border: '1px solid var(--dash-border)',
                  borderRadius: 13,
                  padding: '16px 20px',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'var(--dash-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={19} color="var(--dash-accent)" strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--dash-text)' }}>{resource.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--dash-text-soft)', marginTop: 2 }}>
                    {formatResourceMeta(resource)}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: 'var(--dash-text-soft)',
                    fontFamily: "'JetBrains Mono', monospace",
                    flexShrink: 0,
                  }}
                >
                  {resource.downloads_count} downloads
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function EmptyState({ onUpload }) {
  return (
    <div
      style={{
        border: '1.5px dashed var(--dash-border)',
        borderRadius: 18,
        padding: '72px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'var(--dash-card)',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: 'var(--dash-bg)',
          border: '1px solid var(--dash-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <FileText size={26} color="var(--dash-accent)" strokeWidth={1.6} />
      </div>
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: 20,
          color: 'var(--dash-text)',
          marginBottom: 8,
        }}
      >
        No uploads yet
      </h2>
      <p style={{ fontSize: 14, color: 'var(--dash-text-soft)', maxWidth: 360, marginBottom: 28 }}>
        Share your first set of notes or a question paper — it&apos;ll show up here, searchable by every
        student on your campus.
      </p>
      <button
        type="button"
        onClick={onUpload}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--dash-accent)',
          color: 'var(--dash-btn-text)',
          border: 'none',
          borderRadius: 9,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
        }}
      >
        <Upload size={16} strokeWidth={2.2} />
        Upload your first resource
      </button>
    </div>
  );
}
