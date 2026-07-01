import { useCallback, useEffect, useRef, useState } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createSubject, fetchSubjects, uploadResource } from '@/lib/resources';

const OTHER_SUBJECT_VALUE = 'other';

const RESOURCE_TYPES = [
  { value: 'notes', label: 'Notes' },
  { value: 'pyq', label: 'Previous year paper (PYQ)' },
  { value: 'reference', label: 'Reference material' },
  { value: 'lab', label: 'Lab manual' },
  { value: 'assignment', label: 'Assignment' },
];

const SEMESTER_OPTIONS = Array.from({ length: 8 }, (_, index) => ({
  value: String(index + 1),
  label: `Semester ${index + 1}`,
}));

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const fieldStyle = {
  width: '100%',
  background: '#13131F',
  border: '1px solid #2A2A3D',
  borderRadius: 9,
  padding: '10px 12px',
  color: '#EDEDF4',
  fontSize: 13.5,
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 600,
  color: '#A3A3BD',
  marginBottom: 6,
};

export default function UploadResourceCard({ open, onClose, onSuccess }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    college: user?.college || '',
    branch: user?.branch || '',
    semester: '',
    subjectId: '',
    customSubjectName: '',
    type: '',
    year: user?.current_year || '',
  });
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const resetForm = useCallback(() => {
    setForm({
      title: '',
      description: '',
      college: user?.college || '',
      branch: user?.branch || '',
      semester: '',
      subjectId: '',
      customSubjectName: '',
      type: '',
      year: user?.current_year || '',
    });
    setFile(null);
    setSubjects([]);
    setError('');
    setDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [user]);

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open, resetForm]);

  useEffect(() => {
    if (!open || !form.branch.trim() || !form.semester) {
      setSubjects([]);
      return;
    }

    let active = true;

    async function loadSubjects() {
      setLoadingSubjects(true);
      setError('');

      try {
        const list = await fetchSubjects(form.branch.trim(), form.semester);
        if (active) {
          setSubjects(list);
          setForm((prev) => ({
            ...prev,
            subjectId: prev.subjectId === OTHER_SUBJECT_VALUE ? OTHER_SUBJECT_VALUE : '',
          }));
        }
      } catch (err) {
        if (active) {
          setSubjects([]);
          setError(
            err.response?.data?.message || 'Unable to load subjects. Check branch and semester.',
          );
        }
      } finally {
        if (active) {
          setLoadingSubjects(false);
        }
      }
    }

    loadSubjects();

    return () => {
      active = false;
    };
  }, [open, form.branch, form.semester]);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setError('');
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must not exceed 10 MB.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    handleFileSelect(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.branch.trim()) {
      setError('Branch is required.');
      return;
    }
    if (!form.semester) {
      setError('Semester is required.');
      return;
    }
    if (!form.subjectId) {
      setError('Please select a subject.');
      return;
    }
    if (form.subjectId === OTHER_SUBJECT_VALUE && !form.customSubjectName.trim()) {
      setError('Please enter the subject name.');
      return;
    }
    if (!form.type) {
      setError('Resource type is required.');
      return;
    }
    if (!form.year) {
      setError('Year is required.');
      return;
    }
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    setSubmitting(true);

    try {
      let subjectId = form.subjectId;

      if (subjectId === OTHER_SUBJECT_VALUE) {
        const subject = await createSubject({
          name: form.customSubjectName.trim(),
          branch: form.branch.trim(),
          semester: form.semester,
        });
        subjectId = String(subject.id);
      }

      const formData = new FormData();
      formData.append('title', form.title.trim());
      if (form.description.trim()) {
        formData.append('description', form.description.trim());
      }
      formData.append('subject_id', subjectId);
      formData.append('branch', form.branch.trim());
      formData.append('semester', form.semester);
      formData.append('year', form.year);
      formData.append('type', form.type);
      formData.append('file', file);

      const result = await uploadResource(formData);
      onSuccess?.(result.resource);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          'Upload failed. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(10, 10, 18, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-resource-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: '#16161F',
          border: '1px solid #2A2A3D',
          borderRadius: 18,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
        }}
        className="uni-scroll"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '24px 24px 0',
            position: 'sticky',
            top: 0,
            background: '#16161F',
            zIndex: 1,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#FF8F73',
                fontWeight: 500,
              }}
            >
              New upload
            </span>
            <h2
              id="upload-resource-title"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: 22,
                color: '#fff',
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Upload a resource
            </h2>
            <p style={{ fontSize: 13.5, color: '#8C8CA8', margin: 0 }}>
              Share notes, PYQs, or reference material with your campus.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: '1px solid #2A2A3D',
              background: 'transparent',
              color: '#A3A3BD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="upload-title" style={labelStyle}>
                Title <span style={{ color: '#FF6B4A' }}>*</span>
              </label>
              <input
                id="upload-title"
                value={form.title}
                onChange={updateField('title')}
                placeholder="DBMS Unit 3 — Normalization"
                style={fieldStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="upload-description" style={labelStyle}>
                Description <span style={{ color: '#6B6B8A', fontWeight: 500 }}>(optional)</span>
              </label>
              <textarea
                id="upload-description"
                value={form.description}
                onChange={updateField('description')}
                placeholder="Brief summary of what's inside..."
                rows={3}
                style={{ ...fieldStyle, resize: 'vertical', minHeight: 80 }}
              />
            </div>

            <div>
              <label htmlFor="upload-college" style={labelStyle}>
                College
              </label>
              <input
                id="upload-college"
                value={form.college}
                readOnly
                style={{ ...fieldStyle, color: '#8C8CA8', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label htmlFor="upload-branch" style={labelStyle}>
                  Branch <span style={{ color: '#FF6B4A' }}>*</span>
                </label>
                <input
                  id="upload-branch"
                  value={form.branch}
                  onChange={updateField('branch')}
                  placeholder="Computer Engineering"
                  style={fieldStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="upload-semester" style={labelStyle}>
                  Semester <span style={{ color: '#FF6B4A' }}>*</span>
                </label>
                <select
                  id="upload-semester"
                  value={form.semester}
                  onChange={updateField('semester')}
                  style={fieldStyle}
                  required
                >
                  <option value="" disabled>
                    Select semester
                  </option>
                  {SEMESTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="upload-subject" style={labelStyle}>
                Subject <span style={{ color: '#FF6B4A' }}>*</span>
              </label>
              <select
                id="upload-subject"
                value={form.subjectId}
                onChange={updateField('subjectId')}
                style={fieldStyle}
                required
                disabled={!form.branch.trim() || !form.semester || loadingSubjects}
              >
                <option value="" disabled>
                  {loadingSubjects
                    ? 'Loading subjects…'
                    : !form.branch.trim() || !form.semester
                      ? 'Select branch and semester first'
                      : 'Select subject'}
                </option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={String(subject.id)}>
                    {subject.name}
                  </option>
                ))}
                <option value={OTHER_SUBJECT_VALUE}>Other (add new subject)</option>
              </select>
            </div>

            {form.subjectId === OTHER_SUBJECT_VALUE && (
              <div>
                <label htmlFor="upload-custom-subject" style={labelStyle}>
                  Subject name <span style={{ color: '#FF6B4A' }}>*</span>
                </label>
                <input
                  id="upload-custom-subject"
                  value={form.customSubjectName}
                  onChange={updateField('customSubjectName')}
                  placeholder="Advanced Database Systems"
                  style={fieldStyle}
                  required
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label htmlFor="upload-type" style={labelStyle}>
                  Resource type <span style={{ color: '#FF6B4A' }}>*</span>
                </label>
                <select
                  id="upload-type"
                  value={form.type}
                  onChange={updateField('type')}
                  style={fieldStyle}
                  required
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {RESOURCE_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="upload-year" style={labelStyle}>
                  Year <span style={{ color: '#FF6B4A' }}>*</span>
                </label>
                <select
                  id="upload-year"
                  value={form.year}
                  onChange={updateField('year')}
                  style={fieldStyle}
                  required
                >
                  <option value="" disabled>
                    Select year
                  </option>
                  <option value="1">1st year</option>
                  <option value="2">2nd year</option>
                  <option value="3">3rd year</option>
                  <option value="4">4th year</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                PDF file <span style={{ color: '#FF6B4A' }}>*</span>
              </label>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `1.5px dashed ${dragOver ? '#2D5FFF' : '#2A2A3D'}`,
                  borderRadius: 12,
                  padding: '28px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: dragOver ? '#1C1C2B' : '#13131F',
                  transition: 'border-color 0.15s ease, background 0.15s ease',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => handleFileSelect(event.target.files?.[0])}
                  style={{ display: 'none' }}
                />
                {file ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <FileText size={22} color="#A9BBFF" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{file.name}</div>
                      <div style={{ fontSize: 12, color: '#8C8CA8', marginTop: 2 }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB · PDF
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={24} color="#6B6B8A" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#EDEDF4' }}>
                      Drop your PDF here or click to browse
                    </div>
                    <div style={{ fontSize: 12.5, color: '#8C8CA8', marginTop: 4 }}>
                      PDF only · Max 10 MB
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 13,
                color: '#FF8F73',
                background: '#2A1A18',
                border: '1px solid #4A2820',
                borderRadius: 8,
                padding: '10px 12px',
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 9,
                border: '1px solid #2A2A3D',
                background: 'transparent',
                color: '#A3A3BD',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 0',
                borderRadius: 9,
                border: 'none',
                background: submitting ? '#C44F35' : '#FF6B4A',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={16}
                    style={{ animation: 'uni-spin 0.8s linear infinite' }}
                  />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload size={16} strokeWidth={2.2} />
                  Upload resource
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
