import { useCallback, useEffect, useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import {
  downloadResource,
  formatResourceMeta,
  searchResources,
  triggerFileDownload,
} from '@/lib/resources';

export default function BrowseResourcesPanel({ searchQuery }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const loadResources = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const list = await searchResources({ search: searchQuery });
      setResources(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load resources.');
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const handleDownload = async (resource) => {
    setDownloadingId(resource.id);

    try {
      const result = await downloadResource(resource.id);
      triggerFileDownload(result.file_url, result.title || resource.title);
      setResources((prev) =>
        prev.map((item) =>
          item.id === resource.id
            ? { ...item, downloads_count: result.downloads_count }
            : item,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Download failed. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#FF8F73',
          fontWeight: 500,
        }}
      >
        Browse resources
      </span>
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: 30,
          color: '#fff',
          marginTop: 10,
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}
      >
        {searchQuery.trim() ? `Results for "${searchQuery.trim()}"` : 'All resources'}
      </h1>
      <p style={{ fontSize: 14.5, color: '#8C8CA8', marginBottom: 32 }}>
        Search notes, PYQs, and reference material shared by students across UniSphere.
      </p>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8C8CA8', fontSize: 14 }}>
          <Loader2 size={18} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
          Loading resources…
        </div>
      ) : error ? (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: '#2A1A18',
            border: '1px solid #4A2820',
            color: '#FF8F73',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : resources.length === 0 ? (
        <div
          style={{
            border: '1.5px dashed #2A2A3D',
            borderRadius: 18,
            padding: '56px 32px',
            textAlign: 'center',
            background: '#16161F',
          }}
        >
          <FileText size={28} color="#6B6B8A" style={{ margin: '0 auto 16px' }} />
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 18,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            No resources found
          </h2>
          <p style={{ fontSize: 14, color: '#8C8CA8', margin: 0 }}>
            {searchQuery.trim()
              ? 'Try a different search term or browse all resources.'
              : 'No resources have been uploaded yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {resources.map((resource) => (
            <div
              key={resource.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: '#16161F',
                border: '1px solid #23233380',
                borderRadius: 13,
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: '#1C1C2B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={19} color="#A9BBFF" strokeWidth={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{resource.title}</div>
                <div style={{ fontSize: 12.5, color: '#8C8CA8', marginTop: 2 }}>
                  {formatResourceMeta(resource)}
                </div>
                <div style={{ fontSize: 12, color: '#6B6B8A', marginTop: 4 }}>
                  by {resource.uploader_name} · {resource.uploader_college}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6B6B8A',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {resource.downloads_count} downloads
                </div>
                <button
                  type="button"
                  className="uni-download-btn"
                  onClick={() => handleDownload(resource)}
                  disabled={downloadingId === resource.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#2D5FFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    cursor: downloadingId === resource.id ? 'not-allowed' : 'pointer',
                    opacity: downloadingId === resource.id ? 0.7 : 1,
                    transition: 'background 0.15s ease',
                  }}
                >
                  {downloadingId === resource.id ? (
                    <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
                  ) : (
                    <Download size={14} />
                  )}
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
