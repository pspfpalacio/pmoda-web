import React, { Component } from 'react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
// import Menu from '../../components/Menu/Menu';
import UserBar from '../../components/UserBar/UserBar';

const Menu = require("../../components/Menu")

const App = ({ children }) => (
  <>
    <main>
      <UserBar/>
      <div className="main-container">
        <Menu />
        <div className="main-content" >
          {children}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default App;
