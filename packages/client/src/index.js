import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.scss';
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

    wsPointer.onclose = (e) => {
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

    wsPointer.onmessage = (ev) => {
      // eslint-disable-next-line no-console
      console.info('WebSocket Message: ', ev);
    };

    wsPointer.onerror = (err) => {
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
  }, []); // passing an empty dependency array ensures it is only called once, equivalent of componentDidMount

  function check() {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      websocketConnect(true);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Lobby ws={ws} key={ws} />} />
        {/* catch routing to base path as well */}
        <Route path="/room/:roomId/:role/*" element={<Classroom ws={ws} />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<Main />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
