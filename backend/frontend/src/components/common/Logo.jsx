import { Link } from 'react-router-dom';

function LogoMark({ stroke = '#FAF8F3' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5L12 3l8 3.5-8 3.5-8-3.5z"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 10v5.5C7 17 9.2 18.5 12 18.5s5-1.5 5-3V10"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 7.5V13"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Logo({ to = '/', variant = 'default' }) {
  const isFooter = variant === 'footer';

  return (
    <Link to={to} className="nav-logo">
      <span className="nav-logo-mark">
        <LogoMark stroke={isFooter ? '#1B1B2F' : '#FAF8F3'} />
      </span>
      <span className="nav-logo-text">UniSphere</span>
    </Link>
  );
}

export default Logo;
