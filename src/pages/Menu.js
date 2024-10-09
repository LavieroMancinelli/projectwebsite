import React, { useState, useEffect } from 'react';
import { NavLink, HashRouter } from "react-router-dom";
import '../styles.css';

export default function Menu() {
    const [menuDeploy, setMenuDeploy] = useState(false);
    const [menuAreaClass, setMenuAreaClass] = useState('menuArea');
    const [menuItemsVisible, setMenuItemsVisible] = useState(false);

    console.log(menuAreaClass);
    const handleMenuClick = (event) => {
        setMenuDeploy((prevMenuDeploy) => !prevMenuDeploy)
        setMenuAreaClass(prevClass => prevClass.includes('deployed') ? 'menuArea' : 'menuArea deployed');
        /*setMenuDeploy((prevMenuDeploy) => {
            const newMenuDeploy = !prevMenuDeploy;
            setMenuAreaClass(newMenuDeploy ? 'menuArea deployed' : 'menuArea');
            return newMenuDeploy;
        });
        */
    };

    useEffect(() => {
        if (menuDeploy) {
            setTimeout(() => {
                setMenuItemsVisible(true);
            }, 200);
        } else {
            setMenuItemsVisible(false);
        }
    }, [menuDeploy]);

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
                        <li className={menuItemsVisible ? 'visible' : ''}><NavLink to="/">Home</NavLink></li>
                        <li className={menuItemsVisible ? 'visible' : ''}><NavLink to="/weather">Weather</NavLink></li>
                        <li className={menuItemsVisible ? 'visible' : ''}><NavLink to="/maze">Maze</NavLink></li>
                    </ul>
                </div>
            )}
        </div>
    );
}
