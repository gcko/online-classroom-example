import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.scss';
import Lobby from 'src/lobby/Lobby.tsx';
import Classroom from 'src/classroom/Classroom.tsx';
import socket from 'src/socket.ts';
import TermsOfService from './support/TermsOfService.tsx';

function Main() {
  // Setup WebSockets
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      // eslint-disable-next-line no-console
      console.log(` ==== WEBSOCKET CLIENT ==== `);
      // eslint-disable-next-line no-console
      console.log(` ==== Connected: ${isConnected} ==== `);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Lobby />} />
        {/* catch routing to base path as well */}
        <Route path="/room/:roomId/:role/*" element={<Classroom />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root') as HTMLElement;
createRoot(rootElement).render(<Main />);
