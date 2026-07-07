import { useAuth } from '../../context/AuthContext';

function CtaSection() {
  const { openAuthModal } = useAuth();

  return (
    <div className="cta-wrap wrap">
      <div className="cta reveal">
        <h2>Stop losing notes to a group chat.</h2>
        <p>Set up your profile and see what your branch has already shared.</p>
        <div className="hero-actions">
          <button type="button" className="btn btn-lime" onClick={() => openAuthModal('register')}>
            Create your account
          </button>
          <a href="#features" className="btn btn-ghost-light">
            Browse resources
          </a>
        </div>
      </div>
    </div>
  );
}

export default CtaSection;
