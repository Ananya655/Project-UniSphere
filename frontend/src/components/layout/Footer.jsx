import Logo from '../common/Logo';

function Footer() {
  return (
    <footer>
      <div className="wrap foot-inner">
        <Logo variant="footer" />
        <div className="foot-links">
          <a href="#features">Resources</a>
          <a href="#how">How it works</a>
          <a href="#stack">Built with</a>
        </div>
        <div className="foot-links">
          <span>A student-built project</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
