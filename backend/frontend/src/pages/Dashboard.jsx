import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UploadResourceCard from '@/components/resources/UploadResourceCard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MyUploadsPanel from '@/components/dashboard/MyUploadsPanel';
import BrowseResourcesPanel from '@/components/dashboard/BrowseResourcesPanel';
import ResourceQueriesPanel from '@/components/dashboard/ResourceQueriesPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('uploads');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const [uploadsRefreshKey, setUploadsRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const handleUploadSuccess = (resource) => {
    setUploadSuccessMessage(`"${resource.title}" uploaded successfully.`);
    setUploadsRefreshKey((key) => key + 1);
    setActiveNav('uploads');
  };

  const openUpload = () => {
    setUploadOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleSearchSubmit = () => {
    setAppliedSearch(searchQuery);
    setActiveNav('browse');
  };

  const handleNavChange = (key) => {
    setActiveNav(key);
    if (key === 'browse' && searchQuery.trim() && appliedSearch !== searchQuery) {
      setAppliedSearch(searchQuery);
    }
  };

  return (
    <>
      <DashboardLayout
        user={user}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        onUpload={openUpload}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      >
        {activeNav === 'uploads' && (
          <MyUploadsPanel
            user={user}
            onUpload={openUpload}
            refreshKey={uploadsRefreshKey}
            successMessage={uploadSuccessMessage}
          />
        )}
        {activeNav === 'browse' && <BrowseResourcesPanel searchQuery={appliedSearch} />}
        {activeNav === 'queries' && <ResourceQueriesPanel />}
        {activeNav === 'discussions' && <DiscussionsPlaceholder />}
      </DashboardLayout>

      <UploadResourceCard
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
}

function DiscussionsPlaceholder() {
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
        Discussions
      </span>
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: 30,
          color: '#fff',
          marginTop: 10,
          marginBottom: 8,
        }}
      >
        Community discussions
      </h1>
      <div
        style={{
          border: '1.5px dashed #2A2A3D',
          borderRadius: 18,
          padding: '56px 32px',
          textAlign: 'center',
          background: '#16161F',
          marginTop: 24,
        }}
      >
        <MessageSquare size={28} color="#6B6B8A" style={{ margin: '0 auto 16px' }} />
        <p style={{ fontSize: 14, color: '#8C8CA8', margin: 0 }}>Discussion forum coming soon.</p>
      </div>
    </>
  );
}
