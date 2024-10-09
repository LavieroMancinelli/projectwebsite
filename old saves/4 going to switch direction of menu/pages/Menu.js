import React, { useState } from 'react';
import { NavLink, HashRouter } from "react-router-dom";
import '../styles.css';

export default function Menu() {
    const [menuDeploy, setMenuDeploy] = useState(false);
    const [menuAreaClass, setMenuAreaClass] = useState('menuArea');

    console.log(menuAreaClass);
    const handleMenuClick = (event) => {
        setMenuDeploy((prevMenuDeploy) => {
            const newMenuDeploy = !prevMenuDeploy;
            setMenuAreaClass(newMenuDeploy ? 'menuArea deployed' : 'menuArea');
            return newMenuDeploy;
        });
    };

    return (
        <div className={menuAreaClass}>
            <button className="menuButton" onClick={handleMenuClick}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </button>
            {menuDeploy && (
                <div className="menuBox">
                    <ul className="menuList">
                        <li><NavLink to="/" className="home">Home</NavLink></li>
                        <li><NavLink to="/weather">Weather</NavLink></li>
                        <li><NavLink to="/maze">Maze</NavLink></li>
                    </ul>
                </div>
            )}
        </div>
    );
}
