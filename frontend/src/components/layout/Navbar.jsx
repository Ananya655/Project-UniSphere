import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { openAuthModal } = useAuth();

  return (
    <nav className="nav" id="nav">
      <div className="nav-inner">
        <Logo />

        <div className="nav-links">
          <a href="#features">Resources</a>
          <a href="#how">How it works</a>
          <a href="#stack">Built with</a>
        </div>

        <div className="nav-cta">
          <button type="button" className="btn btn-ghost-dark btn-sm" onClick={() => openAuthModal('login')}>
            Log in
          </button>
          <button type="button" className="btn btn-lime btn-sm" onClick={() => openAuthModal('register')}>
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
