import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchQueriesOnMyResources,
  fetchQueryById,
  postAnswer,
  resolveQuery,
} from '@/lib/queries';
import { RESOURCE_TYPE_LABELS } from '@/lib/resources';

const INITIAL_ANSWERS_SHOWN = 2;

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
  textSoft:     'var(--dash-text-soft)',    // #4a3a37
  textMuted:    'var(--dash-text-muted)',   // #75625f
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

function QueryCard({ query, currentUserId, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState('');

  const loadDetail = useCallback(async () => {
    setLoadingDetail(true);
    setError('');

    try {
      const data = await fetchQueryById(query.id);
      setDetail(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load answers.');
    } finally {
      setLoadingDetail(false);
    }
  }, [query.id]);

  useEffect(() => {
    if (expanded && !detail) {
      loadDetail();
    }
  }, [expanded, detail, loadDetail]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
    setShowAllAnswers(false);
    setError('');
  };

  const handleSubmitAnswer = async (event) => {
    event.preventDefault();
    if (!answerText.trim()) return;

    setSubmittingAnswer(true);
    setError('');

    try {
      const answer = await postAnswer(query.id, answerText.trim());
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              answers: [...prev.answers, answer],
              answer_count: prev.answer_count + 1,
            }
          : prev,
      );
      setAnswerText('');
      onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post answer.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    setError('');

    try {
      await resolveQuery(query.id);
      setDetail((prev) => (prev ? { ...prev, is_resolved: true } : prev));
      onUpdate?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to resolve query.');
    } finally {
      setResolving(false);
    }
  };

  const answers = detail?.answers ?? [];
  const visibleAnswers = showAllAnswers ? answers : answers.slice(0, INITIAL_ANSWERS_SHOWN);
  const hiddenCount = answers.length - INITIAL_ANSWERS_SHOWN;
  const canResolve =
    Number(currentUserId) === Number(query.posted_by.id) &&
    !detail?.is_resolved &&
    !query.is_resolved;
  const isResolved = detail?.is_resolved ?? query.is_resolved;

  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11.5,
                color: C.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 6,
              }}
            >
              {query.resource.title} · {RESOURCE_TYPE_LABELS[query.resource.type] || query.resource.type} · Sem{' '}
              {query.resource.semester}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>{query.title}</div>
            <p style={{ fontSize: 13.5, color: C.textSoft, margin: '0 0 10px', lineHeight: 1.5 }}>{query.body}</p>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              Asked by {query.posted_by.name} · {query.posted_by.branch} · {formatDate(query.created_at)}
            </div>
          </div>
          {isResolved && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11.5,
                fontWeight: 600,
                color: C.accentHover,
                background: C.accentBg,
                border: `1px solid ${C.borderSubtle}`,
                borderRadius: 20,
                padding: '4px 10px',
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={13} />
              Resolved
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
            paddingTop: 14,
            borderTop: `1px solid ${C.borderSubtle}`,
          }}
        >
          <span style={{ fontSize: 12.5, color: C.textSoft }}>
            {detail?.answer_count ?? query.answer_count} answer{(detail?.answer_count ?? query.answer_count) !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            className="uni-card-btn"
            onClick={handleToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '7px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: C.text,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Hide answers
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                View answers
              </>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            padding: '0 20px 20px',
            borderTop: `1px solid ${C.borderSubtle}`,
            background: C.bg,
          }}
        >
          {loadingDetail ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '20px 0',
                color: C.textSoft,
                fontSize: 13.5,
              }}
            >
              <Loader2 size={16} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
              Loading answers…
            </div>
          ) : (
            <>
              {answers.length === 0 ? (
                <p style={{ fontSize: 13.5, color: C.textSoft, padding: '16px 0 8px', margin: 0 }}>
                  No answers yet. Be the first to help.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16 }}>
                  {visibleAnswers.map((answer) => (
                    <div
                      key={answer.id}
                      style={{
                        background: C.card,
                        border: `1px solid ${C.border}`,
                        borderRadius: 10,
                        padding: '12px 14px',
                      }}
                    >
                      <p style={{ fontSize: 13.5, color: C.text, margin: '0 0 8px', lineHeight: 1.5 }}>
                        {answer.body}
                      </p>
                      <div style={{ fontSize: 11.5, color: C.textMuted }}>
                        {answer.posted_by.name} · {answer.posted_by.branch} · {formatDate(answer.created_at)}
                      </div>
                    </div>
                  ))}

                  {!showAllAnswers && hiddenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllAnswers(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: C.accentHover,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '4px 0',
                        textAlign: 'left',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Show {hiddenCount} more answer{hiddenCount !== 1 ? 's' : ''}
                    </button>
                  )}
                </div>
              )}

              {!isResolved && (
                <form onSubmit={handleSubmitAnswer} style={{ marginTop: 16 }}>
                  <label
                    htmlFor={`answer-${query.id}`}
                    style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 6 }}
                  >
                    Write an answer
                  </label>
                  <textarea
                    id={`answer-${query.id}`}
                    value={answerText}
                    onChange={(event) => setAnswerText(event.target.value)}
                    placeholder="Share your explanation or point to the relevant section…"
                    rows={3}
                    style={{
                      width: '100%',
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      padding: '10px 12px',
                      color: C.text,
                      fontSize: 13.5,
                      fontFamily: "'Inter', sans-serif",
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: 72,
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    {canResolve ? (
                      <button
                        type="button"
                        onClick={handleResolve}
                        disabled={resolving}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'transparent',
                          border: `1px solid ${C.border}`,
                          color: C.accentHover,
                          borderRadius: 8,
                          padding: '8px 14px',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: resolving ? 'not-allowed' : 'pointer',
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {resolving ? (
                          <Loader2 size={14} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        Mark as resolved
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="submit"
                      disabled={submittingAnswer || !answerText.trim()}
                      style={{
                        background: C.accent,
                        color: C.white,
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: submittingAnswer || !answerText.trim() ? 'not-allowed' : 'pointer',
                        opacity: submittingAnswer || !answerText.trim() ? 0.6 : 1,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {submittingAnswer ? 'Posting…' : 'Post answer'}
                    </button>
                  </div>
                </form>
              )}

              {error && (
                <p style={{ fontSize: 13, color: C.errorText, marginTop: 12, marginBottom: 0 }}>{error}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResourceQueriesPanel() {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQueries = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const list = await fetchQueriesOnMyResources();
      setQueries(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load queries.');
      setQueries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  return (
    <>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: C.textMuted,
          fontWeight: 500,
        }}
      >
        Resource queries
      </span>
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: 30,
          color: C.text,
          marginTop: 10,
          marginBottom: 8,
          letterSpacing: '-0.01em',
        }}
      >
        Questions on your resources
      </h1>
      <p style={{ fontSize: 14.5, color: C.textSoft, marginBottom: 32 }}>
        Students can ask doubts on resources you&apos;ve uploaded. Answer them here or mark resolved when
        satisfied.
      </p>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: C.textSoft, fontSize: 14 }}>
          <Loader2 size={18} style={{ animation: 'uni-spin 0.8s linear infinite' }} />
          Loading queries…
        </div>
      ) : error ? (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: C.errorBg,
            border: `1px solid ${C.errorBorder}`,
            color: C.errorText,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : queries.length === 0 ? (
        <div
          style={{
            border: `1.5px dashed ${C.border}`,
            borderRadius: 18,
            padding: '72px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: C.card,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: C.accentBg,
              border: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <HelpCircle size={26} color={C.text} strokeWidth={1.6} />
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 20,
              color: C.text,
              marginBottom: 8,
            }}
          >
            No queries yet
          </h2>
          <p style={{ fontSize: 14, color: C.textSoft, maxWidth: 400, margin: 0 }}>
            When students ask questions about your uploaded notes or PYQs, they&apos;ll appear here for you
            to answer.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <MessageSquare size={15} color={C.textMuted} />
            <span style={{ fontSize: 13.5, color: C.textSoft }}>
              {queries.length} quer{queries.length !== 1 ? 'ies' : 'y'} on your resources
            </span>
          </div>
          {queries.map((query) => (
            <QueryCard
              key={query.id}
              query={query}
              currentUserId={user?.id}
              onUpdate={loadQueries}
            />
          ))}
        </div>
      )}
    </>
  );
}
