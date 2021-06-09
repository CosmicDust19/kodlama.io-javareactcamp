import './App.css';
import React from 'react';
import Dashboard from './layouts/Dashboard';
import Footer from './layouts/Footer';
import {Container} from 'semantic-ui-react';
import Navi from "./layouts/Navi";

function App() {
    return (
        <div className="App">
            <Navi/>
            <Container className="main">
                <Dashboard/>
            </Container>
            <Footer/>
        </div>
    );
}

export default App;
