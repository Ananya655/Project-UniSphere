import api from '@/lib/api';

export async function fetchQueriesOnMyResources() {
  const { data } = await api.get('/api/questions/mine');
  return data.queries ?? [];
}

export async function fetchQueryById(queryId) {
  const { data } = await api.get(`/api/questions/${queryId}`);
  return data.query;
}

export async function postAnswer(queryId, body) {
  const { data } = await api.post(`/api/questions/${queryId}/answers`, { body });
  return data.answer;
}

export async function resolveQuery(queryId) {
  const { data } = await api.patch(`/api/questions/${queryId}/resolve`);
  return data;
}
