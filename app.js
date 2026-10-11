// Weather codes from Open-Meteo mapped to simple descriptions
const weatherCodes = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers",
  95: "Thunderstorm"
};
let btn = document.querySelector("#btn");
btn.addEventListener("click", async ()=>{
        const city = document.querySelector("#city").value.trim();
        const status = document.querySelector("#status");
        const result = document.querySelector("#result");
        if(!city){
            status.textContent = "Please enter a city name.";
            status.className = "error";
            result.style.display = "none" ;
            return ;
        }
        status.textContent = "Loading... ";
        status.className = "loading";
        result.style.display = "none";
        try{
         const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      status.textContent = "City not found. Try another name.";
      status.className = "error";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
       // Step 2 :- Fetch current weather for those coordinates
       const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
       const weatherdata = await weatherRes.json() ;

       const temp = weatherdata.current_weather.temperature ;
       const code = weatherdata.current_weather.weathercode ;
       const descriptions = weatherCodes[code] || "Unknown conditions";
       document.querySelector("#cityname").textContent = `${name} , ${country}` ;
       document.querySelector("#temp").textContent = `${temp} C `;
       document.querySelector("#desc").textContent = descriptions ;
       status.textContent = "";
       result.style.display = "block";
       document.querySelector("#city").innerHTML = "";
  }catch(err){
    status.textContent = "Something went wrong. Please try again.";
    status.className = "error";
  }
});

