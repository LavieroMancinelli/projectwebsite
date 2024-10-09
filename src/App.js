import React from 'react';

import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Maze from "./pages/Maze";
import Menu from "./pages/Menu";
import { Route, Routes, HashRouter } from "react-router-dom";
import './styles.css';

function App() {
    return (
        <HashRouter>
            <Menu/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/weather" element={<Weather/>}/>
                <Route exact path="/maze" element={<Maze/>}/>
            </Routes>
        </HashRouter>
    );
}

export default App;