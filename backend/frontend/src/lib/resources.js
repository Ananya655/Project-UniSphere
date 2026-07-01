import api from '@/lib/api';

export const RESOURCE_TYPE_LABELS = {
  notes: 'Notes',
  pyq: 'PYQ',
  reference: 'Reference',
  lab: 'Lab manual',
  assignment: 'Assignment',
};

export function formatResourceMeta(resource) {
  const type = RESOURCE_TYPE_LABELS[resource.type] || resource.type;
  const parts = [type, `Sem ${resource.semester}`, resource.branch];
  if (resource.subject_name) {
    parts.push(resource.subject_name);
  }
  return parts.join(' · ');
}

export async function fetchSubjects(branch, semester) {
  const { data } = await api.get('/api/subjects', {
    params: { branch, semester },
  });
  return data.subjects ?? [];
}

export async function createSubject({ name, branch, semester }) {
  const { data } = await api.post('/api/subjects', { name, branch, semester });
  return data.subject;
}

export async function uploadResource(formData) {
  const { data } = await api.post('/api/resources/upload', formData);
  return data;
}

export async function fetchMyResources() {
  const { data } = await api.get('/api/resources/mine');
  return data.resources ?? [];
}

export async function searchResources(filters = {}) {
  const params = {};
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.branch?.trim()) params.branch = filters.branch.trim();
  if (filters.semester) params.semester = filters.semester;
  if (filters.type) params.type = filters.type;

  const { data } = await api.get('/api/resources', { params });
  return data.resources ?? [];
}

export async function downloadResource(resourceId) {
  const { data } = await api.post(`/api/resources/${resourceId}/download`);
  return data;
}

export function triggerFileDownload(fileUrl, title) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.download = title ? `${title}.pdf` : 'resource.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
