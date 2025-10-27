import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard";
import FarmingTips from "./FarmingTips";

export default function App() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [tips, setTips] = useState([]);
  const [language, setLanguage] = useState("en");
  const [speaking, setSpeaking] = useState(false);

  // South African languages
  const languages = [
    { code: "en", name: "English" },
    { code: "zu", name: "isiZulu" },
    { code: "xh", name: "isiXhosa" },
    { code: "af", name: "Afrikaans" },
    { code: "st", name: "Sesotho" },
    { code: "tn", name: "Setswana" },
    { code: "nso", name: "Sepedi" },
    { code: "ve", name: "Tshivenda" },
    { code: "ts", name: "Xitsonga" },
    { code: "nr", name: "isiNdebele" },
    { code: "ss", name: "Siswati" },
  ];

  // Detect online/offline
  useEffect(() => {
    window.addEventListener("offline", () => setIsOffline(true));
    window.addEventListener("online", () => setIsOffline(false));
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const location = e.target.location.value;

    setUser({ email, phone, location });
    fetchWeather();
    fetchTips();
  };

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-26.2&longitude=28.0&current_weather=true"
      );
      const data = await res.json();
      setWeather(data.current_weather);
    } catch {
      setWeather(null);
    }
  };

  // Example farming tips
  const fetchTips = async () => {
    const sampleTips = [
      { title: "Soil Care", content: "Keep your soil rich with compost and mulch." },
      { title: "Water Saving", content: "Use drip irrigation to reduce water waste." },
      { title: "Animal Care", content: "Provide shade and clean water for livestock." },
    ];
    setTips(sampleTips);
  };

  // Voice-over using Web Speech API
  const speak = (text) => {
    if (!window.speechSynthesis) return alert("Voice feature not supported on this browser.");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="app">
      <header>
        <h1>🌾 AgriGuard</h1>
        <p>Smart Climate & Food Resilience App</p>
      </header>

      {/* Language Selection */}
      <div className="language-select">
        <label>Select Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {!user ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" name="email" placeholder="Email" required />
          <input type="tel" name="phone" placeholder="Phone Number" required />
          <input type="text" name="location" placeholder="Location" required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <>
          <h2>Welcome, {user.email}</h2>

          {/* Weather Section */}
          {weather ? (
            <WeatherCard weather={weather} />
          ) : (
            <p>Loading weather...</p>
          )}
          {isOffline && <p className="offline">Offline Mode: Cached Data</p>}

          {/* Farming Tips */}
          <section className="tips">
            <h3>🌱 Farming & Animal Tips</h3>
            {tips.length ? (
              tips.map((tip, i) => (
                <div key={i} className="tip">
                  <strong>{tip.title}</strong>
                  <p>{tip.content}</p>
                  <button
                    className="speak-btn"
                    onClick={() => speak(`${tip.title}. ${tip.content}`)}
                    disabled={speaking}
                  >
                    🔊 Listen
                  </button>
                </div>
              ))
            ) : (
              <p>Loading farming tips...</p>
            )}
          </section>

          {/* Video Section */}
          <section className="videos">
            <h3>🎥 Learning Videos</h3>
            <video width="320" height="240" controls>
              <source src="/videos/farming_guide.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </section>
        </>
      )}
    </div>
  );
}
