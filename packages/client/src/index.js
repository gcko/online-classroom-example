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
      <div className="amplify-app">
        <div className="top-page-content">
          <h2 className="col-3">
            <Link to="/" title="Back to the Lobby">
              Amplify <small>your skill</small>
            </Link>
          </h2>
        </div>
        <div className="content">
          <Route exact path="/" component={Lobby} />
          {/* catch routing to base path as well */}
          <Route exact path="/room" component={Classroom} />
          <Route exact path="/room/:roomId" component={Classroom} />
          <Route exact path="/room/:roomId/:role" component={Classroom} />
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
