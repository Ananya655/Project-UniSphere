import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileText, Loader2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createQuery, fetchQueriesByResource, fetchQueryById, postAnswer } from '@/lib/queries';
import {
  downloadResource,
  formatResourceMeta,
  searchResources,
  triggerFileDownload,
} from '@/lib/resources';

function ResourceCard({ resource, currentUser, downloadingId, onDownload }) {
  const [expanded, setExpanded] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [queryError, setQueryError] = useState('');
  const [queryTitle, setQueryTitle] = useState('');
  const [queryBody, setQueryBody] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [expandedQueryIds, setExpandedQueryIds] = useState([]);
  const [queryDetails, setQueryDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [submittingAnswers, setSubmittingAnswers] = useState({});
  const [answerErrors, setAnswerErrors] = useState({});

  const isOwner = Number(currentUser?.id) === Number(resource.uploaded_by);

  const loadQueries = useCallback(async () => {
    setLoadingQueries(true);
    setQueryError('');

    try {
      const list = await fetchQueriesByResource(resource.id);
      setQueries(list);
    } catch (err) {
      setQueryError(err.response?.data?.message || 'Unable to load discussions for this resource.');
      setQueries([]);
    } finally {
      setLoadingQueries(false);
    }
  }, [resource.id]);

  const handleToggleQueries = async () => {
    if (!expanded) {
      await loadQueries();
    }
    setExpanded((prev) => !prev);
  };

  const handleCreateQuery = async (event) => {
    event.preventDefault();
    const title = queryTitle.trim();
    const body = queryBody.trim();

    if (!title || !body) return;

    setSubmittingQuery(true);
    setQueryError('');

    try {
      const createdQuery = await createQuery(resource.id, { title, body });
      setQueries((prev) => [createdQuery, ...prev]);
      setQueryTitle('');
      setQueryBody('');
    } catch (err) {
      setQueryError(err.response?.data?.message || 'Unable to post your query.');
    } finally {
      setSubmittingQuery(false);
    }
  };

  const handleToggleAnswers = async (queryId) => {
    if (expandedQueryIds.includes(queryId)) {
      setExpandedQueryIds((prev) => prev.filter((item) => item !== queryId));
      return;
    }

    if (queryDetails[queryId]) {
      setExpandedQueryIds((prev) => [...prev, queryId]);
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [queryId]: true }));
    setAnswerErrors((prev) => ({ ...prev, [queryId]: '' }));

    try {
      const detail = await fetchQueryById(queryId);
      setQueryDetails((prev) => ({ ...prev, [queryId]: detail }));
      setExpandedQueryIds((prev) => [...prev, queryId]);
    } catch (err) {
      setAnswerErrors((prev) => ({ ...prev, [queryId]: err.response?.data?.message || 'Unable to load answers.' }));
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [queryId]: false }));
    }
  };

  const handleSubmitAnswer = async (event, queryId) => {
    event.preventDefault();
    const answerText = (answerDrafts[queryId] || '').trim();
    if (!answerText) return;

    setSubmittingAnswers((prev) => ({ ...prev, [queryId]: true }));
    setAnswerErrors((prev) => ({ ...prev, [queryId]: '' }));

    try {
      const answer = await postAnswer(queryId, answerText);
      setQueryDetails((prev) => {
        const current = prev[queryId];
        if (!current) return prev;
        return {
          ...prev,
          [queryId]: {
            ...current,
            answers: [...current.answers, answer],
            answer_count: (current.answer_count || 0) + 1,
          },
        };
      });
      setAnswerDrafts((prev) => ({ ...prev, [queryId]: '' }));
    } catch (err) {
      setAnswerErrors((prev) => ({ ...prev, [queryId]: err.response?.data?.message || 'Unable to post answer.' }));
    } finally {
      setSubmittingAnswers((prev) => ({ ...prev, [queryId]: false }));
    }
  };

  return (
    <div
      style={{
        background: 'var(--dash-card)',
        border: '1px solid var(--dash-border)',
        borderRadius: 13,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
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
          <div style={{ fontSize: 12.5, color: 'var(--dash-text-soft)', marginTop: 2 }}>{formatResourceMeta(resource)}</div>
          <div style={{ fontSize: 12, color: 'var(--dash-text-soft)', marginTop: 4 }}>
            by {resource.uploader_name} · {resource.uploader_college}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: 'var(--dash-text-soft)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {resource.downloads_count} downloads
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="uni-card-btn"
              onClick={handleToggleQueries}
              disabled={isOwner}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: '1px solid var(--dash-border)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--dash-accent)',
                fontFamily: "'Inter', sans-serif",
                cursor: isOwner ? 'not-allowed' : 'pointer',
                opacity: isOwner ? 0.7 : 1,
              }}
            >
              <MessageSquare size={14} />
              {isOwner ? 'Your resource' : expanded ? 'Hide queries' : 'Ask / view queries'}
            </button>
            <button
              type="button"
              className="uni-download-btn"
              onClick={() => onDownload(resource)}
              disabled={downloadingId === resource.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--dash-accent)',
                color: 'var(--dash-btn-text)',
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
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--dash-border)', background: 'var(--dash-details-bg)' }}>
          {!currentUser ? (
            <p style={{ fontSize: 13.5, color: 'var(--dash-text-soft)', margin: '14px 0 0' }}>
              Sign in to ask a query or respond to one.
            </p>
          ) : isOwner ? (
            <p style={{ fontSize: 13.5, color: 'var(--dash-text-soft)', margin: '14px 0 0' }}>
              This is your uploaded resource, so other students can view the discussion here.
            </p>
          ) : (
            <form onSubmit={handleCreateQuery} style={{ paddingTop: 16 }}>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 6 }}>
                Ask a question about this resource
              </label>
              <input
                value={queryTitle}
                onChange={(event) => setQueryTitle(event.target.value)}
                placeholder="Short title"
                style={{
                  width: '100%',
                  background: 'var(--dash-card)',
                  border: '1px solid var(--dash-border)',
                  borderRadius: 9,
                  padding: '10px 12px',
                  color: 'var(--dash-text)',
                  fontSize: 13.5,
                  marginBottom: 10,
                }}
              />
              <textarea
                value={queryBody}
                onChange={(event) => setQueryBody(event.target.value)}
                placeholder="Mention what you need help with…"
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--dash-card)',
                  border: '1px solid var(--dash-border)',
                  borderRadius: 9,
                  padding: '10px 12px',
                  color: 'var(--dash-text)',
                  fontSize: 13.5,
                  resize: 'vertical',
                  minHeight: 72,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={submittingQuery || !queryTitle.trim() || !queryBody.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--dash-accent)',
                    color: 'var(--dash-btn-text)',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: submittingQuery || !queryTitle.trim() || !queryBody.trim() ? 'not-allowed' : 'pointer',
                    opacity: submittingQuery || !queryTitle.trim() || !queryBody.trim() ? 0.6 : 1,
                  }}
                >
                  {submittingQuery ? <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} /> : <Send size={14} />}
                  Post query
                </button>
              </div>
            </form>
          )}

          {queryError && <p style={{ fontSize: 13, color: '#b25d52', marginTop: 12, marginBottom: 0 }}>{queryError}</p>}

          <div style={{ marginTop: 16 }}>
            {loadingQueries ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dash-text-soft)', fontSize: 13.5, padding: '8px 0' }}>
                <Loader2 size={15} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
                Loading queries…
              </div>
            ) : queries.length === 0 ? (
              <p style={{ fontSize: 13.5, color: 'var(--dash-text-soft)', margin: 0 }}>
                No questions yet. Be the first to ask something helpful.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {queries.map((query) => {
                  const detail = queryDetails[query.id];
                  const isExpanded = expandedQueryIds.includes(query.id);
                  const thisLoading = loadingDetails[query.id];
                  const answerDraft = answerDrafts[query.id] || '';
                  const answerError = answerErrors[query.id];
                  const answers = detail?.answers ?? [];

                  return (
                    <div key={query.id} style={{ background: 'var(--dash-bg)', border: '1px solid var(--dash-border)', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', marginBottom: 4 }}>{query.title}</div>
                          <p style={{ fontSize: 13.2, color: 'var(--dash-text)', margin: '0 0 8px', lineHeight: 1.5 }}>{query.body}</p>
                          <div style={{ fontSize: 11.8, color: 'var(--dash-text-soft)' }}>
                            {query.posted_by.name} · {query.posted_by.branch} · {new Date(query.created_at).toLocaleDateString('en-IN')}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleAnswers(query.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--dash-text-soft)', fontWeight: 600, cursor: 'pointer', fontSize: 12.5 }}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <span style={{ fontSize: 12.2, color: 'var(--dash-text-soft)' }}>
                          {(detail?.answer_count ?? 0)} answer{(detail?.answer_count ?? 0) !== 1 ? 's' : ''}
                        </span>
                        <span style={{ fontSize: 12.2, color: 'var(--dash-text-soft)' }}>
                          {query.is_resolved ? 'Resolved' : 'Open'}
                        </span>
                      </div>

                      {isExpanded && (
                        <div style={{ marginTop: 12 }}>
                          {thisLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--dash-text-soft)', fontSize: 13 }}>
                              <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
                              Loading responses…
                            </div>
                          ) : (
                            <>
                              {answers.length === 0 ? (
                                <p style={{ fontSize: 13, color: 'var(--dash-text-soft)', margin: '0 0 10px' }}>No responses yet.</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                                  {answers.map((answer) => (
                                    <div key={answer.id} style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: 8, padding: '10px 12px' }}>
                                      <div style={{ fontSize: 13, color: 'var(--dash-text)', marginBottom: 6 }}>{answer.body}</div>
                                      <div style={{ fontSize: 11.5, color: 'var(--dash-text-soft)' }}>
                                        {answer.posted_by.name} · {new Date(answer.created_at).toLocaleDateString('en-IN')}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {currentUser && !isOwner && (
                                <form onSubmit={(event) => handleSubmitAnswer(event, query.id)}>
                                  <textarea
                                    value={answerDraft}
                                    onChange={(event) => setAnswerDrafts((prev) => ({ ...prev, [query.id]: event.target.value }))}
                                    placeholder="Write your response…"
                                    rows={2}
                                    style={{
                                      width: '100%',
                                      background: 'var(--dash-card)',
                                      border: '1px solid var(--dash-border)',
                                      borderRadius: 9,
                                      padding: '10px 12px',
                                      color: 'var(--dash-text)',
                                      fontSize: 13.5,
                                      resize: 'vertical',
                                      minHeight: 54,
                                    }}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                    <button
                                      type="submit"
                                      disabled={submittingAnswers[query.id] || !answerDraft.trim()}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        background: 'var(--dash-accent)',
                                        color: 'var(--dash-btn-text)',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: '8px 12px',
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: submittingAnswers[query.id] || !answerDraft.trim() ? 'not-allowed' : 'pointer',
                                        opacity: submittingAnswers[query.id] || !answerDraft.trim() ? 0.6 : 1,
                                      }}
                                    >
                                      {submittingAnswers[query.id] ? <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} /> : <Send size={14} />}
                                      Reply
                                    </button>
                                  </div>
                                </form>
                              )}

                              {answerError && <p style={{ fontSize: 13, color: '#b25d52', marginTop: 8, marginBottom: 0 }}>{answerError}</p>}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrowseResourcesPanel({ searchQuery }) {
  const { user } = useAuth();
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

  const normalizedSearch = searchQuery?.trim() || '';
  const sortedResources = useMemo(() => {
    if (!resources.length) return [];

    const userBranch = (user?.branch || '').toLowerCase();

    return [...resources].sort((left, right) => {
      const leftIsMine = Number(left.uploaded_by) === Number(user?.id);
      const rightIsMine = Number(right.uploaded_by) === Number(user?.id);

      if (leftIsMine !== rightIsMine) {
        return leftIsMine ? -1 : 1;
      }

      const leftSameBranch = (left.branch || '').toLowerCase() === userBranch;
      const rightSameBranch = (right.branch || '').toLowerCase() === userBranch;

      if (leftSameBranch !== rightSameBranch) {
        return leftSameBranch ? -1 : 1;
      }

      return new Date(right.created_at) - new Date(left.created_at);
    });
  }, [resources, user?.branch, user?.id]);

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
        Browse resources
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
        {normalizedSearch ? `Results for "${normalizedSearch}"` : 'All resources'}
      </h1>
      <p style={{ fontSize: 14.5, color: 'var(--dash-text-soft)', marginBottom: 32 }}>
        Search notes, PYQs, and reference material shared by students across UniSphere.
      </p>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--dash-text-soft)', fontSize: 14 }}>
          <Loader2 size={18} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
          Loading resources…
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
      ) : sortedResources.length === 0 ? (
        <div
          style={{
            border: '1.5px dashed var(--dash-border)',
            borderRadius: 18,
            padding: '56px 32px',
            textAlign: 'center',
            background: 'var(--dash-card)',
          }}
        >
          <FileText size={28} color="var(--dash-text-soft)" style={{ margin: '0 auto 16px' }} />
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 18,
              color: 'var(--dash-text)',
              marginBottom: 8,
            }}
          >
            No resources found
          </h2>
          <p style={{ fontSize: 14, color: 'var(--dash-text-soft)', margin: 0 }}>
            {normalizedSearch
              ? 'Try a different search term or browse all resources.'
              : 'No resources have been uploaded yet.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sortedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              currentUser={user}
              downloadingId={downloadingId}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </>
  );
}
