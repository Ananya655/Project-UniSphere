import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { openAuthModal } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Logo />

        <div className="nav-links">
          <a href="#discussions">Discussions</a>
          <a href="#upload">Upload</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button type="button" className="btn btn-ghost" onClick={() => openAuthModal('login')}>
            Log in
          </button>
          <button type="button" className="btn btn-solid" onClick={() => openAuthModal('register')}>
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
