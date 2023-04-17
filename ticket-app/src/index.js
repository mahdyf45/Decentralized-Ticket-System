import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Homepage from './Homepage';
import UserHome from './UserHome';
import Create from './Create';
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
      </Routes>
    </Router> 
  </React.StrictMode>

);
