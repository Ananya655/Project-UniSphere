import api from '@/lib/api';

export async function fetchDiscussions(category = '') {
  const { data } = await api.get('/api/discussions', {
    params: category ? { category } : {},
  });
  return data.discussions ?? [];
}

export async function createDiscussion(payload) {
  const { data } = await api.post('/api/discussions', payload);
  return data.discussion;
}

export async function fetchDiscussionById(discussionId) {
  const { data } = await api.get(`/api/discussions/${discussionId}`);
  return data.discussion;
}

export async function createComment(discussionId, body) {
  const { data } = await api.post(`/api/discussions/${discussionId}/comments`, { body });
  return data.comment;
}

export async function upvoteDiscussion(discussionId) {
  const { data } = await api.post(`/api/discussions/${discussionId}/upvote`);
  return data;
}
