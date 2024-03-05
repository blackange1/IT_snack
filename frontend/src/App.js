import logo from './logo.svg';
import './App.css';

import React from 'react';
import HelloWorld from './components/HelloWorld';
import MeinMenu from "./components/MainMenu";
import Catalog from "./components/Catalog";

function App() {
    return (
        <div>
            {/*<HelloWorld />*/}
            <MeinMenu/>
            <Catalog/>
        </div>
    );
}

export default App;
