import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

function Footer() {
  const { openAuthModal } = useAuth();

  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo variant="footer" />
            <p className="footer-tag">
              The shared notebook for engineering students — built to make every batch&apos;s
              knowledge outlast the batch itself.
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#discussions">Discussions</a>
            <a href="#upload">Upload a resource</a>
            <a href="#how">How it works</a>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Browse notes</a>
            <a href="#">Question papers</a>
            <a href="#">Ask a doubt</a>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <button type="button" className="footer-link-btn" onClick={() => openAuthModal('register')}>
              Register
            </button>
            <button type="button" className="footer-link-btn" onClick={() => openAuthModal('login')}>
              Log in
            </button>
            <a href="#">Your profile</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 UniSphere. Made for students, by students.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
