import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.sass';
import * as serviceWorker from './serviceWorker';
import Lobby from './lobby/Lobby';
import Classroom from './classroom/Classroom';
import TermsOfService from './support/TermsOfService';

function Main() {
  // Setup WebSockets
  const [ws, setWs] = useState(new WebSocket('ws://localhost:3334'));
  const timeout = useRef(250);
  const connectInterval = useRef(-1);

  function websocketConnect(reconnect = false) {
    let wsPointer = ws;
    if (reconnect) {
      wsPointer = new WebSocket('ws://localhost:3334');
    }

    wsPointer.onopen = () => {
      setWs(wsPointer);
      // reset the timeout on open of a new connection
      timeout.current = 250;
      clearInterval(connectInterval.current);
    };

    wsPointer.onclose = e => {
      console.warn(
        `WebSocket closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (timeout.current + timeout.current) / 1000
        )} second(s).`,
        e.reason
      );
      timeout.current += timeout.current;
      connectInterval.current = setTimeout(
        // eslint-disable-next-line no-use-before-define
        check,
        Math.min(10000, timeout.current)
      );
    };

    wsPointer.onerror = err => {
      console.error(
        `Websocket encountered an error: ${err.message}, Closing socket.`
      );
      // can point directly to the websocket in this instance
      ws.close();
    };
  }

  useEffect(() => {
    websocketConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // passing an empty dependency array ensures it is only called once, equivalent of compenentDidMount

  function check() {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      websocketConnect(true);
    }
  }

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
          <Route
            exact
            path="/"
            render={props => <Lobby {...props} ws={ws} key={ws} />}
          />
          {/* catch routing to base path as well */}
          <Route exact path="/room" component={Classroom} />
          <Route exact path="/room/:roomId" component={Classroom} />
          <Route
            exact
            path="/room/:roomId/:role"
            render={props => <Classroom {...props} ws={ws} key={ws} />}
          />
          <Route exact path="/terms-of-service" component={TermsOfService} />
        </div>
        <footer>
          <Link to="/terms-of-service">Terms of Service</Link>
          <a href="mailto:jared.scott@variable.team">Contact support</a>
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
