import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Player } from 'video-react';

const videoPlayerStyle = {
  width: '50%',
  hieght: 'auto'
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <link
        rel="stylesheet"
        href="https://video-react.github.io/assets/video-react.css"
        />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <img alt="test" src="http://localhost:8080/assets/images/2020-02-02_18-51-47_c5e4827c4180ea937359343bba3e7fc9.jpg"/>
        <div style={videoPlayerStyle}> 
          <Player>
            <source src="http://localhost:8080/assets/videos/2020-02-02_19-44-25_cef9198b0ac10f7d7e1583629f1825ed.mp4"/>
          </Player>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
