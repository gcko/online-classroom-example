import { Link } from 'react-router-dom';
import React from 'react';

function Layout(props) {
  return (
    <div>
      <nav className="navbar sticky-top bg-dark">
        <div className="container-fluid">
          <Link
            to="/"
            title="Back to the Lobby"
            className="navbar-brand h4 text-white"
          >
            Amplify <small>your skill</small>
          </Link>
        </div>
      </nav>
      <div className="amplify-app container-fluid">
        <div className="content">{props.children}</div>
        <footer>
          <Link to="/terms-of-service">Terms of Service</Link>
          <a href="mailto:jared.scott@variable.team">Contact support</a>
          <span>© 2020 Variable.</span>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
