import React from 'react';
import ReactDOM from 'react-dom';

import Web3Provider from './store/Web3Provider';
import DaoProvider from './store/DaoProvider';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';

ReactDOM.render(
  <Web3Provider>
    <DaoProvider>
      <App />
    </DaoProvider>
  </Web3Provider>, 
  document.getElementById('root')  
);