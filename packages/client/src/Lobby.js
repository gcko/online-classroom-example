import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Lobby.sass';

function Lobby() {
  return (
    <div className="lobby">
      <Helmet>
        <title>Lobby | Amplify</title>
        <link rel="canonical" href="https://amplifyourskill.com/" />
      </Helmet>
      <header>
        <h2>logo here</h2>
        <p>
          Edit <code>src/Lobby.js</code> and save to reload.
        </p>
        <Link to="/room" className="amplify-link">
          Go to class!
        </Link>
      </header>
    </div>
  );
}

export default Lobby;
