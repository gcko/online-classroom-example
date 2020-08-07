import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.sass';
import * as serviceWorker from './serviceWorker';
import Lobby from './Lobby';
import Classroom from './Classroom';

function Main() {
  return (
    <Router>
      <div className="amplify-app container-fluid">
        <div className="top-page-content row">
          <h1 className="col-3">
            Amplify <small>your skill</small>
          </h1>
          <ul className="nav col-9">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Lobby
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/room" className="nav-link">
                Class
              </Link>
            </li>
          </ul>
        </div>
        <div className="content">
          <Route exact path="/" component={Lobby} />
          <Route path="/room" component={Classroom} />
        </div>
        <footer>
          <a href="#terms-of-service">Terms of Service</a>
          <a href="#support">Support</a>
          <span>© 2020 Variable.</span>
        </footer>
      </div>
    </Router>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
