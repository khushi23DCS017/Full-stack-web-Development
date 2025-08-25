// Hardcoded weather data
const weatherData = {
  ahmedabad: "40°C",
  mumbai: "32°C",
  delhi: "38°C",
  surat: "36°C",
  chennai: "34°C"
};

// Function to get weather for entered city
function getWeather() {
  const cityInput = document.getElementById("cityInput").value.toLowerCase();
  const result = document.getElementById("result");

  if (weatherData[cityInput]) {
    const formattedCity = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    result.textContent = `The weather in ${formattedCity} is ${weatherData[cityInput]}`;
  } else {
    result.textContent = "City not found in database.";
  }
}
