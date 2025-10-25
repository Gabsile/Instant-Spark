import React, { useState, useEffect } from "react";
import WeatherCard from "./WeatherCard.jsx";

const languageCodes = ["en","zu","st","af","xh","tn","ts","ss","ve","nr","nd"];

function App() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [notifications, setNotifications] = useState({ push:true, sms:false, email:false });
  const [reports, setReports] = useState(JSON.parse(localStorage.getItem("reports")||"[]"));
  const [newReport, setNewReport] = useState({ type:"", description:"", location:"" });
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem("settings")||'{"region":"Urban","alertTypes":["storm","flood","drought"]}') );

  const resourcesData = [
    { title: "Climate-Smart Farming Guide", type: "text", link: "#" },
    { title: "Drought-Resistant Crops Video", type: "video", link: "#" },
    { title: "Soil Care Infographic", type: "image", link: "#" },
    { title: "Audio Guide: Irrigation Tips", type: "audio", link: "#" },
  ];

  const translations = {
    en: { login:"Login", welcome:"Welcome", offline:"Offline Mode: Cached Data", loading:"Loading weather...", notifications:"Notification Preferences", ussd:"USSD Registration", community:"Community Reports", learning:"Learning & Resources", settings:"Settings" },
    zu: { login:"Ngena ngemvume", welcome:"Siyakwamukela", offline:"Imodi engaxhunyiwe ku-inthanethi: Idatha egciniwe", loading:"Ilayisha isimo sezulu...", notifications:"Izintandokazi Zezaziso", ussd:"Bhalisa nge-USSD", community:"Izibalo Zomphakathi", learning:"Ukufunda & Izinsiza", settings:"Izilungiselelo" },
    st: { login:"Kena", welcome:"Rea u amohela", offline:"Mokhoa oa ho se hokahane: Data e bolokiloeng", loading:"E kenya boemo ba leholimo...", notifications:"Likhetho tsa Tsebo", ussd:"Ngoliso ea USSD", community:"Litlhahlobo tsa Sechaba", learning:"Thuto & Lisebelisoa", settings:"Litsamaiso" },
    af: { login:"Meld aan", welcome:"Welkom", offline:"Vanlyn modus: Gestoorde data", loading:"Laai weerdata...", notifications:"Kennisgewing Voorkeure", ussd:"USSD Registrasie", community:"Gemeenskapsverslae", learning:"Leer & Hulpbronne", settings:"Instellings" },
    // add other languages as needed
  };

  const t = translations[language];

  useEffect(() => {
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => { if(user) fetchWeather(); }, [user]);

  const fetchWeather = async () => {
    if(navigator.onLine){
      try{
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-26.2&longitude=28.0&current_weather=true");
        const data = await response.json();
        const weatherData = {...data.current_weather};
        weatherData.feels_like = (weatherData.temperature - (weatherData.windspeed*0.7)).toFixed(1);
        weatherData.alert = weatherData.temperature>35 ? "red" : weatherData.temperature>28 ? "yellow" : "green";
        setWeather(weatherData);
        localStorage.setItem("weatherData", JSON.stringify(weatherData));
      } catch { loadOfflineWeather(); }
    } else loadOfflineWeather();
  };

  const loadOfflineWeather = () => {
    const saved = localStorage.getItem("weatherData");
    if(saved) setWeather(JSON.parse(saved));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    setUser({email, phone});
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({...notifications,[name]:checked});
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if(!newReport.type || !newReport.location) return;
    const updatedReports = [...reports,{...newReport,date:new Date()}];
    setReports(updatedReports);
    localStorage.setItem("reports",JSON.stringify(updatedReports));
    setNewReport({ type:"", description:"", location:"" });
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    const updatedSettings = {...settings, [name]: value};
    setSettings(updatedSettings);
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  return (
    <div className="App">
      <h1><i className="fa-solid fa-leaf"></i> AgriGuard</h1>
      <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="language-select">
        {languageCodes.map(lang => <option key={lang} value={lang}>{lang}</option>)}
      </select>

      {!user ? (
        <form onSubmit={handleLogin}>
          <h2>{t.login}</h2>
          <input type="email" name="email" placeholder="Email" required />
          <input type="tel" name="phone" placeholder="Phone Number" required />
          <button type="submit">{t.login}</button>
        </form>
      ) : (
        <div className="dashboard">
          <h2>{t.welcome}, {user.email}</h2>

          {weather ? <WeatherCard weather={weather}/> : <p>{t.loading}</p>}
          {isOffline && <p className="offline">{t.offline}</p>}

          {/* Notifications */}
          <div className="notification-settings">
            <h3>{t.notifications}</h3>
            <label><input type="checkbox" name="push" checked={notifications.push} onChange={handleNotificationChange}/> Push</label>
            <label><input type="checkbox" name="sms" checked={notifications.sms} onChange={handleNotificationChange}/> SMS</label>
            <label><input type="checkbox" name="email" checked={notifications.email} onChange={handleNotificationChange}/> Email</label>
          </div>

          {/* USSD */}
          <div className="ussd-info">
            <h3>{t.ussd}</h3>
            <p>Dial <strong>*123#</strong> on your phone to register and receive SMS alerts.</p>
          </div>

          {/* Community Reports */}
          <div className="community-reports">
            <h3>{t.community}</h3>
            <form onSubmit={handleReportSubmit}>
              <select value={newReport.type} onChange={(e)=>setNewReport({...newReport,type:e.target.value})} required>
                <option value="">Select Type</option>
                <option value="Flood">Flood</option>
                <option value="Drought">Drought</option>
                <option value="Crop Disease">Crop Disease</option>
                <option value="Pest Outbreak">Pest Outbreak</option>
              </select>
              <input type="text" placeholder="Location" value={newReport.location} onChange={(e)=>setNewReport({...newReport,location:e.target.value})} required />
              <textarea placeholder="Description (optional)" value={newReport.description} onChange={(e)=>setNewReport({...newReport,description:e.target.value})}/>
              <button type="submit">Submit Report</button>
            </form>
            <ul>
              {reports.map((r, idx)=><li key={idx}><strong>{r.type}</strong> at {r.location} ({new Date(r.date).toLocaleString()})</li>)}
            </ul>
          </div>

          {/* Learning & Resources */}
          <div className="learning-resources">
            <h3>{t.learning}</h3>
            <ul>
              {resourcesData.map((res, idx)=>(
                <li key={idx}>{res.title} [{res.type}] <a href={res.link} target="_blank" rel="noopener noreferrer">View</a></li>
              ))}
            </ul>
          </div>

          {/* Settings */}
          <div className="settings">
            <h3>{t.settings}</h3>
            <label>
              Region:
              <select name="region" value={settings.region} onChange={handleSettingsChange}>
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </label>
            <label>
              Alerts:
              <select name="alertTypes" value={settings.alertTypes} onChange={handleSettingsChange} multiple>
                <option value="storm">Storm</option>
                <option value="flood">Flood</option>
                <option value="drought">Drought</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

