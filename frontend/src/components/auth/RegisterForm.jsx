import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import './RegisterForm.css';

const YEAR_OPTIONS = [
  { value: '1', label: '1st year' },
  { value: '2', label: '2nd year' },
  { value: '3', label: '3rd year' },
  { value: '4', label: '4th year' },
];

function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    current_year: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        college: form.college.trim(),
        branch: form.branch.trim(),
        current_year: form.current_year,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        'Unable to register. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form-field">
        <Label htmlFor="register-name">Full name</Label>
        <Input
          id="register-name"
          autoComplete="name"
          placeholder="Aarav Kulkarni"
          value={form.name}
          onChange={updateField('name')}
          required
        />
      </div>

      <div className="auth-form-field">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={form.email}
          onChange={updateField('email')}
          required
        />
      </div>

      <div className="auth-form-field">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={updateField('password')}
          minLength={8}
          required
        />
      </div>

      <div className="auth-form-row">
        <div className="auth-form-college">
          <Label htmlFor="register-college">College</Label>
          <Input
            id="register-college"
            placeholder="VJTI Mumbai"
            value={form.college}
            onChange={updateField('college')}
            required
          />
        </div>
        <div className="auth-form-branch">
          <Label htmlFor="register-branch">Branch</Label>
          <Input
            id="register-branch"
            placeholder="Computer Engineering"
            value={form.branch}
            onChange={updateField('branch')}
            required
          />
        </div>
      </div>

      <div className="auth-form-field">
        <Label htmlFor="register-year">Current year</Label>
        <select
          id="register-year"
          className="auth-select"
          value={form.current_year}
          onChange={updateField('current_year')}
          required
        >
          <option value="" disabled>
            Select year
          </option>
          {YEAR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="auth-form-error">{error}</p>}

      <Button type="submit" className="subbtn" size="full" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="auth-form-switch">
        Already have an account?{' '}
        <button type="button" className="auth-form-link" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
