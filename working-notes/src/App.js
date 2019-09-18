import React from 'react';
import logo from './logo.svg';
import './App.css';
import {MainTextComponent} from './components/mainText/MainTextComponent'

function App() {
  return (
    <div className="App">
      <div className="App-top">
        <div>
          <MainTextComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
