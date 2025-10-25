import React from "react";

function WeatherCard({ weather }) {
  if (!weather) return null;

  const alertColors = {
    green: "#2d6a4f",
    yellow: "#f0ad4e",
    red: "#d9534f"
  };

  return (
    <div className="weather-card" style={{ border: `2px solid ${alertColors[weather.alert || 'green']}` }}>
      <h3><i className="fa-solid fa-cloud-sun"></i> Current Weather</h3>
      <p><i className="fa-solid fa-temperature-half"></i> Temperature: {weather.temperature}°C</p>
      <p><i className="fa-solid fa-wind"></i> Wind Speed: {weather.windspeed} km/h</p>
      <p><i className="fa-solid fa-face-smile"></i> Feels Like: {weather.feels_like}°C</p>
      {weather.time && <p><i className="fa-solid fa-clock"></i> Updated: {new Date(weather.time).toLocaleTimeString()}</p>}
    </div>
  );
}

export default WeatherCard;
