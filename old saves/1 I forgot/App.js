import React, { useState } from 'react';


function fetchWeather(city) {
    const apiKey = 'f6ac28aa18de4bde89a235618243009';
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    
  
    fetch(apiUrl)
      .then(response => response.json()) // Parse the JSON response
      .then(data => {
        console.log(data);
        console.log("temp in " + city + " is " + data.current.temp_f);
        return data;
    })
      .catch(error => console.error(error));
    return null;
  }

export default function Square() {
    const [inputValue, setInputValue] = useState('');
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    //let tempF = null;            <div className="tempF">{tempF}</div>
    

    return (
        <div>
            <input type="text" value={inputValue} onChange={handleChange} placeholder="Enter text"/>
            <button className="square" onClick={() => fetchWeather(inputValue)}>X</button>;

        </div>
    )
}
