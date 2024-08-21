document.getElementById("search").addEventListener("click", function () {
  fetchWeather();
});

function fetchWeather(preloadedCity) {
  const city = preloadedCity || document.getElementById("city").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const unit = document.querySelector('input[name="unit"]:checked').value;
  const apiKey = "583f25b9e2d5c948e139f98fd4c65a06"; // Replace with your OpenWeather API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.cod !== 200) {
        // Check for valid city response
        throw new Error(data.message || "Failed to fetch weather data.");
      }
      updateUI(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert(
        "Failed to fetch weather data. Please check the city name and try again."
      );
    });
}

function updateUI(data) {
  const location = `${data.name}, ${data.sys.country}`;
  const dateTime = new Date().toLocaleString();
  const temperature = `Temperature: ${data.main.temp}°${
    document.querySelector('input[name="unit"]:checked').value === "metric"
      ? "C"
      : "F"
  }`;
  const humidity = `Humidity: ${data.main.humidity}%`;
  const wind = `Wind: ${data.wind.speed} ${
    document.querySelector('input[name="unit"]:checked').value === "metric"
      ? "m/s"
      : "mph"
  } ${data.wind.deg}°`;
  const sunrise = `Sunrise: ${new Date(
    data.sys.sunrise * 1000
  ).toLocaleTimeString()}`;
  const sunset = `Sunset: ${new Date(
    data.sys.sunset * 1000
  ).toLocaleTimeString()}`;
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  document.getElementById("location").textContent = location;
  document.getElementById("date-time").textContent = dateTime;
  document.getElementById("temperature").textContent = temperature;
  document.getElementById("humidity").textContent = humidity;
  document.getElementById("wind").textContent = wind;
  document.getElementById(
    "sunrise-sunset"
  ).textContent = `${sunrise} | ${sunset}`;
  document.getElementById("weather-icon").src = iconUrl;
}

// Pre-load weather data for a specific city when the page loads
window.addEventListener("load", function () {
  fetchWeather("New York"); // Replace 'New York' with the desired pre-loaded city
  document.getElementById("city").value = "New York"; // Set the pre-loaded city in the input field
});
