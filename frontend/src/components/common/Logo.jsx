// import { Link } from 'react-router-dom';

// function Logo({ to = '/', variant = 'default', className = '' }) {
//   const isFooter = variant === 'footer';

//   return (
//     <Link to={to} className={`brand ${className}`.trim()}>
//       <span className="brand-mark" aria-hidden="true" />
//       UniSphere
//     </Link>
//   );
// }

// export default Logo;

import { Link } from 'react-router-dom';
import logo from '../../assets/logo2.png';
import './logo.css';

function Logo({ to = '/', variant = 'default', className = '' }) {
  return (
    <Link to={to} className={`brand ${className}`.trim()}>
      <img
        src={logo}
        alt="UniSphere Logo"
        className="brand-logo"
      />
      <span className="brand-text">UniSphere</span>
    </Link>
  );
}

export default Logo;
