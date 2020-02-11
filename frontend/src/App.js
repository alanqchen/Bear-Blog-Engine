import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Player } from 'video-react';
import 
{ 
  BrowserRouter,
  Switch, 
  Route,
  Redirect
} from "react-router-dom";
import MetaTags from "react-meta-tags";
import FourZeroFour from "./pages/404/404";
import "./universal/style.css"

const videoPlayerStyle = {
  width: '50%',
  hieght: 'auto'
}

function App() {
  return (
    /*
    <div className="App">
      <header className="App-header">
        <link rel="stylesheet" href="https://video-react.github.io/assets/video-react.css"/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <img alt="test" src="http://localhost:8080/assets/images/2020-02-02_18-51-47_c5e4827c4180ea937359343bba3e7fc9.jpg"/>
        <div style={videoPlayerStyle}> 
          <Player>
            <source src="http://localhost:8080/assets/videos/2020-02-02_19-44-25_cef9198b0ac10f7d7e1583629f1825ed.mp4"/>
          </Player>
          <Player>
            <source src="http://localhost:8080/assets/videos/2020-02-03_02-29-05_f094542e103332456bd5492648920bf6.mp4"/>
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
    */
   <BrowserRouter>
      <div class="full-height">

        <MetaTags>
          <title>Bear Post</title>
          <meta name="description" content="Bear Post" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </MetaTags>

        { /* ReactRouter offers support for putting a <nav> element here, should investigate that at some point. */ }

        <Switch>
          <Route path="/backend">
            { /* Do nothing */ }
          </Route>
          <Route path="/">
            <FourZeroFour />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
