import React, { Component } from 'react';
import Main from './components/Main'
import Home from './components/Home'
import './index.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Main>
          <Home />
        </Main>
      </div>
    );
  }
}

export default App;
