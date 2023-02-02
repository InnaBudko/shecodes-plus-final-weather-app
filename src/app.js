function showError(cityName) {
  let error = document.querySelector("#error-placeholder");
  if (cityName) {
    error.innerHTML = `Sorry, we could not find ${cityName} city`;
  } else {
    error.innerHTML = `Please enter a city name`;
  }
}

function cleanErrorMessage() {
  let error = document.querySelector("#error-placeholder");
  error.innerHTML = "";
}

function formatDate(timestamp) {
  // calculate the date and time
  let date = new Date(timestamp);
  let day = date.toLocaleDateString("en-US", { weekday: "long" });
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}`;
}

function displayForecast(response) {
  console.log(response.data);

  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    let maxTemperature = Math.round(forecastDay.temperature.maximum);
    let minTemperature = Math.round(forecastDay.temperature.minimum);
    let src = forecastDay.condition.icon_url;
    let day = formatDay(forecastDay.time * 1000);
    if (index < 7) {
      forecastHTML += `
                <div class="col">
                  <div class="weather-forecast-date">${day}</div>
                  <img
                    src="${src}"
                    alt=""
                    width="42"
                  />
                  <div class="weather-forecast-temperature">
                    <div class="forecast-temperature-max">${maxTemperature}</div>
                    <div class="forecast-temperature-min">${minTemperature}</div>
                  </div>
                </div>
    `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let endpoint = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios
    .get(endpoint)
    .then(displayForecast)
    .catch(function (error) {
      console.log(error);
    });
}

function updateWeatherData(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let datetimeElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  datetimeElement.innerHTML = formatDate(response.data.time * 1000);

  iconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  iconElement.setAttribute("alt", response.data.condition.description);
  getForecast(response.data.coordinates);
}

function search(cityName) {
  let endpoint = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=metric`;
  console.log(endpoint);
  axios
    .get(endpoint)
    .then(updateWeatherData)
    .catch(function (error) {
      console.log(error);
      showError(cityName);
    });
}

function handleSearchEvent(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city-input");
  search(cityElement.value);
  document.querySelector("#search-form").reset();
  cleanErrorMessage();
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

  // set class="active" for fahrenheit units and set class="Inactive" for celsius unit
  fahrenheitLink.classList.replace("inactive", "active");
  celsiusLink.classList.replace("active", "inactive");

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  // set class="active" for celsius units and set class="Inactive" for fahrenheit unit
  celsiusLink.classList.replace("inactive", "active");
  fahrenheitLink.classList.replace("active", "inactive");

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

// Global variables region

let apiKey = "95c40b01td464da65f4f835cof7b5c75";
let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearchEvent);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSearchEvent);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

// default search region
search("New York");
