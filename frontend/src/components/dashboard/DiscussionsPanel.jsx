import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, MessageSquare, Send, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  createComment,
  createDiscussion,
  fetchDiscussionById,
  fetchDiscussions,
  upvoteDiscussion,
} from '@/lib/discussions';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'exam-prep', label: 'Exam prep' },
  { value: 'subject', label: 'Subject' },
  { value: 'internship', label: 'Internship' },
  { value: 'placement', label: 'Placement' },
  { value: 'other', label: 'Other' },
];

const INITIAL_POSTS_SHOWN = 4;

// ── Colour tokens ──────────────────────────────────────────────────────────
const C = {
  bg:           'var(--dash-bg)',          // #F6ECE3
  card:         'var(--dash-card)',         // #FFFFFF
  cardAlt:      '#fdfbf9',
  border:       'var(--dash-border)',       // #b7a7a9
  borderSubtle: 'rgba(183,167,169,0.25)',
  borderDash:   'rgba(183,167,169,0.35)',
  accent:       'var(--dash-accent)',       // #b7a7a9
  accentHover:  'var(--dash-accent-hover)',// #91766E
  accentBg:     'rgba(183,167,169,0.10)',
  text:         'var(--dash-text)',         // #000000
  textSoft:     'var(--dash-text-soft)',    // #b7a7a9
  textMuted:    'var(--dash-text-muted)',
  white:        '#ffffff',
  errorBg:      '#fff0ef',
  errorBorder:  'rgba(178,93,82,0.3)',
  errorText:    '#b25d52',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function DiscussionCard({ discussion, currentUserId, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [error, setError] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoadingDetail(true);
    setError('');
    try {
      const data = await fetchDiscussionById(discussion.id);
      setDetail(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load discussion details.');
    } finally {
      setLoadingDetail(false);
    }
  }, [discussion.id]);

  const toggleExpanded = async () => {
    if (!expanded && !detail) await loadDetail();
    setExpanded((prev) => !prev);
    setShowAllComments(false);
    setError('');
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    setError('');
    try {
      const comment = await createComment(discussion.id, commentText.trim());
      setDetail((prev) =>
        prev ? { ...prev, comments: [...prev.comments, comment], comment_count: prev.comment_count + 1 } : prev,
      );
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpvote = async () => {
    setUpvoting(true);
    setError('');
    try {
      const response = await upvoteDiscussion(discussion.id);
      setDetail((prev) => (prev ? { ...prev, upvotes: response.upvotes } : prev));
      onRefresh?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to upvote this discussion.');
    } finally {
      setUpvoting(false);
    }
  };

  const comments = detail?.comments ?? [];
  const visibleComments = showAllComments ? comments : comments.slice(0, 3);
  const hiddenCommentCount = comments.length - 3;
  const isOwner = Number(currentUserId) === Number(discussion.posted_by?.id);

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
              {discussion.category} · posted by {discussion.posted_by?.name}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>{discussion.title}</div>
            <p style={{ fontSize: 13.5, color: C.textSoft, margin: '0 0 10px', lineHeight: 1.5 }}>{discussion.body}</p>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              {discussion.posted_by?.branch} · {discussion.posted_by?.college} · {formatDate(discussion.created_at)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleUpvote}
            disabled={upvoting || isOwner}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: C.accentBg,
              border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '8px 12px',
              fontSize: 13, fontWeight: 600,
              color: C.text,
              cursor: upvoting || isOwner ? 'not-allowed' : 'pointer',
              opacity: upvoting || isOwner ? 0.6 : 1,
              flexShrink: 0,
            }}
          >
            <ThumbsUp size={14} />
            {detail?.upvotes ?? discussion.upvotes}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.borderSubtle}` }}>
          <span style={{ fontSize: 12.5, color: C.textSoft }}>
            {(detail?.comment_count ?? discussion.comment_count ?? 0)} comment{(detail?.comment_count ?? discussion.comment_count ?? 0) !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={toggleExpanded}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '7px 12px',
              fontSize: 13, fontWeight: 600,
              color: C.text, cursor: 'pointer',
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide discussion' : 'Expand discussion'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.borderSubtle}`, background: C.bg }}>
          {loadingDetail ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.textSoft, fontSize: 13.5, padding: '16px 0' }}>
              <Loader2 size={15} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
              Loading discussion…
            </div>
          ) : (
            <>
              {comments.length === 0 ? (
                <p style={{ fontSize: 13.5, color: C.textSoft, margin: '16px 0 10px' }}>No replies yet. Start the conversation.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  {visibleComments.map((comment) => (
                    <div key={comment.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ fontSize: 13.2, color: C.text, marginBottom: 6 }}>{comment.body}</div>
                      <div style={{ fontSize: 11.5, color: C.textMuted }}>
                        {comment.posted_by.name} · {comment.posted_by.branch} · {formatDate(comment.created_at)}
                      </div>
                    </div>
                  ))}
                  {!showAllComments && hiddenCommentCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllComments(true)}
                      style={{ background: 'transparent', border: 'none', color: C.accentHover, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', padding: 0 }}
                    >
                      Show {hiddenCommentCount} more comment{hiddenCommentCount !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              )}

              {currentUserId && (
                <form onSubmit={handleCommentSubmit} style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 6 }}>
                    Join the discussion
                  </label>
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Share your perspective or answer the question…"
                    rows={3}
                    style={{
                      width: '100%',
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 9, padding: '10px 12px',
                      color: C.text, fontSize: 13.5,
                      resize: 'vertical', minHeight: 72,
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: C.accent,
                        color: C.white, border: 'none',
                        borderRadius: 8, padding: '8px 14px',
                        fontSize: 13, fontWeight: 600,
                        cursor: submittingComment || !commentText.trim() ? 'not-allowed' : 'pointer',
                        opacity: submittingComment || !commentText.trim() ? 0.6 : 1,
                      }}
                    >
                      {submittingComment ? <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} /> : <Send size={14} />}
                      Reply
                    </button>
                  </div>
                </form>
              )}

              {error && <p style={{ fontSize: 13, color: C.errorText, marginTop: 12, marginBottom: 0 }}>{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiscussionsPanel() {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_POSTS_SHOWN);

  const loadDiscussions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchDiscussions(selectedCategory);
      setDiscussions(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load discussions.');
      setDiscussions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    setVisibleCount(INITIAL_POSTS_SHOWN);
    loadDiscussions();
  }, [loadDiscussions]);

  const sortedDiscussions = useMemo(() => {
    if (!discussions.length) return [];
    return [...discussions].sort((left, right) => {
      const leftIsMine = Number(left.posted_by?.id) === Number(user?.id);
      const rightIsMine = Number(right.posted_by?.id) === Number(user?.id);
      if (leftIsMine !== rightIsMine) return leftIsMine ? -1 : 1;
      const upvoteDiff = Number(right.upvotes || 0) - Number(left.upvotes || 0);
      if (upvoteDiff !== 0) return upvoteDiff;
      return new Date(right.created_at) - new Date(left.created_at);
    });
  }, [discussions, user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim() || !selectedCategory) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await createDiscussion({ title: title.trim(), body: body.trim(), category: selectedCategory });
      setDiscussions((prev) => [created, ...prev]);
      setTitle('');
      setBody('');
      setSelectedCategory('');
      setCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create discussion.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 9,
    padding: '10px 12px',
    color: C.text,
    fontSize: 13.5,
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.textMuted, fontWeight: 500 }}>
        Community discussions
      </span>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 30, color: C.text, marginTop: 10, marginBottom: 8, letterSpacing: '-0.01em' }}>
        Ask anything. Learn together.
      </h1>
      <p style={{ fontSize: 14.5, color: C.textSoft, marginBottom: 24 }}>
        Start a discussion, respond to others, and sort posts by your own activity, recency, and upvotes.
      </p>

      {/* New discussion form */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 13, padding: '18px 20px', marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 10 }}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What do you want to ask or discuss?"
              style={inputStyle}
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share a little context so others can join in…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}
              >
                <option value="">Select a category</option>
                {CATEGORY_OPTIONS.filter((item) => item.value).map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !body.trim() || !selectedCategory}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: C.accent, color: C.white,
                  border: 'none', borderRadius: 8, padding: '8px 14px',
                  fontSize: 13, fontWeight: 600,
                  cursor: submitting || !title.trim() || !body.trim() || !selectedCategory ? 'not-allowed' : 'pointer',
                  opacity: submitting || !title.trim() || !body.trim() || !selectedCategory ? 0.6 : 1,
                }}
              >
                {submitting ? <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} /> : <Send size={14} />}
                Start discussion
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={15} color={C.textMuted} />
          <span style={{ fontSize: 13.5, color: C.textSoft }}>{discussions.length} discussion{discussions.length !== 1 ? 's' : ''}</span>
        </div>
        <select
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value;
            setCategory(nextCategory);
            setSelectedCategory(nextCategory);
          }}
          style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 9, padding: '8px 10px',
            color: C.text, fontSize: 13.5,
            outline: 'none', cursor: 'pointer',
          }}
        >
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ padding: '12px 14px', borderRadius: 10, background: C.errorBg, border: `1px solid ${C.errorBorder}`, color: C.errorText, fontSize: 13.5, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.textSoft, fontSize: 14 }}>
          <Loader2 size={18} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
          Loading discussions…
        </div>
      ) : sortedDiscussions.length === 0 ? (
        <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 18, padding: '56px 32px', textAlign: 'center', background: C.card }}>
          <MessageSquare size={28} color={C.textSoft} style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: C.text, marginBottom: 8 }}>No discussions yet</h2>
          <p style={{ fontSize: 14, color: C.textSoft, margin: 0 }}>Be the first to start a discussion in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sortedDiscussions.slice(0, visibleCount).map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} currentUserId={user?.id} onRefresh={loadDiscussions} />
          ))}
          {sortedDiscussions.length > visibleCount && (
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + INITIAL_POSTS_SHOWN)}
              style={{
                background: 'transparent',
                border: `1px solid ${C.border}`,
                color: C.text, padding: '10px 12px',
                borderRadius: 8, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Show more discussions
            </button>
          )}
        </div>
      )}
    </>
  );
}
