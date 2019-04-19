import React, { Component } from 'react';
import logo from './logo.jpg';
import Routes from './routes';
import {BrowserRouter, Redirect} from 'react-router-dom';
import {Navbar} from 'react-bootstrap'

class App extends Component {

  //Empty Navbar and simple Footer
  render() {
    return (
      <div>
        <div className="App">
        <BrowserRouter>
          <header className="App-header">
            <Navbar bg="light" expand="lg">
              <Navbar.Brand href="/"> <img src={logo} alt="everymundo logo" className="header-logo" /></Navbar.Brand>
            </Navbar>
            <Routes />
          </header>
        </BrowserRouter>
        </div>
        <footer style={bottomView}>
              <h4 style={{textAlign: 'center'}}>Alejandro Barnola, 2019</h4>
        </footer>
      </div>
    );
  }
}

const bottomView = {
  width: '100%', 
  height: '2.5rem', 
  justifyContent: 'center', 
  alignItems: 'center',
  position: 'absolute',
  bottom: 0
}

export default App;