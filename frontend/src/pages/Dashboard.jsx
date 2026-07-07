import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UploadResourceCard from '@/components/resources/UploadResourceCard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MyUploadsPanel from '@/components/dashboard/MyUploadsPanel';
import BrowseResourcesPanel from '@/components/dashboard/BrowseResourcesPanel';
import ResourceQueriesPanel from '@/components/dashboard/ResourceQueriesPanel';
import DiscussionsPanel from '@/components/dashboard/DiscussionsPanel';

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
        {activeNav === 'discussions' && <DiscussionsPanel />}
      </DashboardLayout>

      <UploadResourceCard
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </>
  );
}

