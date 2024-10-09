import React, { useState, useEffect } from 'react';
import { Route, NavLink, HashRouter } from "react-router-dom";
import './styles.css';
import Home from "./Home";
import Weather from "./Weather"
import Maze from "./Maze"


export default function Square() {
    const [inputValue, setInputValue] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [inputAreaClass, setInputAreaClass] = useState('inputArea');
    const [menuDeploy, setMenuDeploy] = useState(false);
    const [menuAreaClass, setMenuAreaClass] = useState('menuArea');
    const handleMenuClick = (event) => {
        setMenuDeploy((prevMenuDeploy) => {
            const newMenuDeploy = !prevMenuDeploy;
            setMenuAreaClass(newMenuDeploy ? 'menuArea deployed' : 'menuArea');
            return newMenuDeploy;
        });
    };
    const handleChange = (event) => { setInputValue(event.target.value); };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { 
            if (inputValue != "") fetchWeather(inputValue); 
            else {  // reset inputArea to center if enter empty value
                setInputAreaClass('inputArea');
                setWeatherData(null);
            }
        }
    };
    
    const fetchWeather = (city) => {
        const apiKey = 'f6ac28aa18de4bde89a235618243009';
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
        
      
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            console.log("temp in " + city + " is " + data.current.temp_f);
            setWeatherData(data);
        })
          .catch(error => console.error(error));
        return null;
      }

      useEffect(() => {
        if (weatherData) {
            setInputAreaClass('inputArea deployed');
        }
      }, [weatherData]);


    return (
        <div>
            <div className={menuAreaClass}>
                <button className="menuButton" onClick={handleMenuClick}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </button>
                {menuDeploy && (
                    <HashRouter>
                        <div className="menuBox">
                            <ul className="header">
                                <li><NavLink to="/home">Home</NavLink></li>
                                <li><NavLink to="/">Weather</NavLink></li>
                                <li><NavLink to="/maze">Maze</NavLink></li>
                            </ul>
                            <div className="content">
                            </div>
                        </div>
                    </HashRouter>
                )}
            </div>
            <div className="weatherBox">
                <div className={inputAreaClass}>
                    <div className="weatherTitle">How's the weather in...</div>
                    <input type="weatherInput" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Enter text"/>
                    <button className="enter" onClick={() => fetchWeather(inputValue)}>Enter</button>;
                </div>
                {weatherData && (
                    <div className="infoArea">
                        <div className="cityAndState">
                            <div className="text">{weatherData.location.name}, {weatherData.location.region}</div>
                        </div>
                        <div className="condition">
                            <div className="titleText">Description</div>
                            <div className="valueText">{weatherData.current.condition.text}</div>
                        </div>
                        <div className="temp">
                            <div className="titleText">Temp is</div>
                            <div className="valueText">{weatherData.current.temp_f}°F {weatherData.current.temp_c}°C</div>
                        </div>
                        <div className="feelsLike">
                            <div className="titleText">Feels like</div>
                            <div className="valueText">{weatherData.current.feelslike_f}°F {weatherData.current.feelslike_c}°C</div>
                        </div>
                        <div className="humidity">
                            <div className="titleText">Humidity</div>
                            <div className="valueText">{weatherData.current.humidity}%</div>
                        </div>
                        <div className="windSpeed">
                            <div className="titleText">Wind speed</div>
                            <div className="valueText">{weatherData.current.wind_mph}mph {weatherData.current.wind_kph}kph</div>
                        </div>
                        <div className="uv">
                            <div className="titleText">UV index</div>
                            <div className="valueText">{weatherData.current.uv}</div>
                        </div>

                    </div>
                )}
            </div>
        </div>
        
    )
}
