import React, { useState } from 'react';
import './styles.css';


export default function Square() {
    const [inputValue, setInputValue] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const handleChange = (event) => { setInputValue(event.target.value); };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') { fetchWeather(inputValue); }
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

    return (
        <div>
            <div className="inputArea">
                <div className="main">
                    <div className="weatherTitle">How's the weather in...</div>
                    <input type="text" value={inputValue} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Enter text"/>
                    <button className="square" onClick={() => fetchWeather(inputValue)}>Enter</button>;
                </div>
                <div className="downArrow">V</div>
            </div>
            {weatherData && (
                <div className="infoArea">
                    <div className="cityAndState">{weatherData.location.name}, {weatherData.location.region}</div>
                    <div className="tempF">Temp is {weatherData.current.temp_f}°F {weatherData.current.temp_c}°C</div>
                    <div className="feelsLike">Feels like {weatherData.current.feelslike_f}°F {weatherData.current.feelslike_c}°C</div>
                    <div className="humidity">Humidity {weatherData.current.humidity}</div>
                    <div className="windSpeed">Wind speed {weatherData.current.wind_mph}mph {weatherData.current.wind_kph}kph</div>
                    <div className="uv">UV index {weatherData.current.uv}</div>

                </div>
            )}
        </div>
    )
}
