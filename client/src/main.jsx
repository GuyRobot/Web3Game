import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home, CreateBattle, JoinBattle, Battle } from './page';
import './index.css';
import { StateContextProvider } from './context';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StateContextProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-battle" element={<CreateBattle />} />
        <Route path="/join-battle" element={<JoinBattle />} />
        <Route path="/battle/:battleName" element={<Battle />} />
      </Routes>
    </StateContextProvider>
  </BrowserRouter>,
);
