import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Homepage from './Homepage';
import UserHome from './UserHome';
import Create from './Create';
import Sell from './Sell';
import Buy from './Buy';
import Browse from './Browse';
import ConfirmBuy from './ConfirmBuy';
import {
  BrowserRouter as Router, Route, Routes
} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path= "" element={<Homepage />}></Route>
        <Route path= "/userhome" element={<UserHome />}></Route>
        <Route path= "/create" element={<Create />}></Route>
        <Route path= "/browse" element={<Browse />}></Route>
        <Route path= "/sell/:id" element={<Sell />}></Route>
        <Route path= "/tickets/:id" element={<Buy />}></Route>
        <Route path= "/buy/:id" element={<ConfirmBuy />}></Route>
      </Routes>
    </Router> 
  </React.StrictMode>

);
