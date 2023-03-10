// show error messages under search field if received error from api
function showError(cityName) {
  let error = document.querySelector("#error-placeholder");
  if (cityName) {
    error.innerHTML = `Sorry, we could not find ${cityName} city`;
  } else {
    error.innerHTML = `Please enter a city name`;
  }
}

// clean error message shown under search field
function cleanErrorMessage() {
  let error = document.querySelector("#error-placeholder");
  error.innerHTML = "";
}

// calculate the date and time from unix timestamp
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let day = date.toLocaleDateString("en-US", { weekday: "long" });
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

// calculate day name in short presentation to use in forecast
function formatDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}`;
}

// update HTML with forecast data in Calsius units
function displayForecastCelsius(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    let maxTemperature = Math.round(forecastDay.temperature.maximum);
    let minTemperature = Math.round(forecastDay.temperature.minimum);
    let responseIconLink = forecastDay.condition.icon_url;
    let responseIconLinkProtocol = responseIconLink.substring(0, 5);
    let day = formatDay(forecastDay.time * 1000);

    if (responseIconLinkProtocol === "http:") {
      responseIconLink = responseIconLink.replace("http://", "https://");
    }

    if (index < 7) {
      forecastHTML += `
                <div class="col">
                  <div class="weather-forecast-date">${day}</div>
                  <img
                    src="${responseIconLink}"
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

// update HTML with forecast data in Fahrenheit units
function displayForecastFahrenheit(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    let maxTemperature = Math.round(forecastDay.temperature.maximum);
    let minTemperature = Math.round(forecastDay.temperature.minimum);
    let responseIconLink = forecastDay.condition.icon_url;
    let responseIconLinkProtocol = responseIconLink.substring(0, 5);
    let day = formatDay(forecastDay.time * 1000);

    if (responseIconLinkProtocol === "http:") {
      responseIconLink = responseIconLink.replace("http://", "https://");
    }

    if (index < 7) {
      forecastHTML += `
                <div class="col">
                  <div class="weather-forecast-date">${day}</div>
                  <img
                    src="${responseIconLink}"
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

// fetch forecast data taking into account units
// "c" == Celcius, "f" == Fahrenheit
function getForecastUnits(coordinates, units) {
  try {
    if (units === "c") {
      let endpoint = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
      axios
        .get(endpoint)
        .then(displayForecastCelsius)
        .catch(function (error) {
          console.log(error);
        });
    } else if (units === "f") {
      let endpoint = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=imperial`;
      axios
        .get(endpoint)
        .then(displayForecastFahrenheit)
        .catch(function (error) {
          console.log(error);
        });
    } else {
      throw error;
    }
  } catch (error) {
    console.log(error, "Incorrect unit type");
  }
}

// update HTML with weather data in Celsius units
function updateWeatherDataCelsius(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let windUnits = document.querySelector("#wind-units");
  let datetimeElement = document.querySelector("#date-time");
  let iconElement = document.querySelector("#weather-icon");
  let units = "c";
  let responseIconLink = response.data.condition.icon_url;
  let responseIconLinkProtocol = responseIconLink.substring(0, 5);

  if (responseIconLinkProtocol === "http:") {
    responseIconLink = responseIconLink.replace("http://", "https://");
  }

  celsiusTemperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  windUnits.innerHTML = "km/h";
  datetimeElement.innerHTML = formatDate(response.data.time * 1000);

  iconElement.setAttribute("src", `${responseIconLink}`);
  iconElement.setAttribute("alt", response.data.condition.description);

  celsiusLink.classList.replace("inactive", "active");
  fahrenheitLink.classList.replace("active", "inactive");

  getForecastUnits(response.data.coordinates, units);
}

// update HTML with weather data about time, temperatures, wind speed and wind units in Fahrenheit units
function updateWeatherDataFahrenheit(response) {
  let temperatureElement = document.querySelector("#temperature");
  let windElement = document.querySelector("#wind");
  let windUnits = document.querySelector("#wind-units");
  let datetimeElement = document.querySelector("#date-time");
  let units = "f";

  fahrenheitTemperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  windUnits.innerHTML = "mph";
  datetimeElement.innerHTML = formatDate(response.data.time * 1000);

  getForecastUnits(response.data.coordinates, units);
}

//  request current weather data taking into account units
// "c" == Celcius, "f" == Fahrenheit
function searchUnits(cityName, units) {
  try {
    if (units === "c") {
      let endpoint = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=metric`;
      axios
        .get(endpoint)
        .then(updateWeatherDataCelsius)
        .catch(function (error) {
          console.log(error);
          showError(cityName);
        });
    } else if (units === "f") {
      let endpoint = `https://api.shecodes.io/weather/v1/current?query=${cityName}&key=${apiKey}&units=imperial`;
      axios
        .get(endpoint)
        .then(updateWeatherDataFahrenheit)
        .catch(function (error) {
          console.log(error);
          showError(cityName);
        });
    } else {
      throw error;
    }
  } catch (error) {
    console.log(error, "Incorrect unit type");
  }
}

function handleSearchEvent(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city-input");

  searchUnits(cityElement.value, "c");
  document.querySelector("#search-form").reset();
  cleanErrorMessage();
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  // set class="active" for celsius units and set class="Inactive" for fahrenheit unit
  celsiusLink.classList.replace("inactive", "active");
  fahrenheitLink.classList.replace("active", "inactive");
  let cityName = document.querySelector("#city").innerText;
  let units = "c";

  // fetch data with Celsius units
  searchUnits(cityName, units);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  let cityName = document.querySelector("#city").innerText;

  // set class="active" for fahrenheit units and set class="Inactive" for celsius unit
  fahrenheitLink.classList.replace("inactive", "active");
  celsiusLink.classList.replace("active", "inactive");

  let units = "f";
  // fetch data with Farenheit units
  searchUnits(cityName, units);
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
searchUnits("New York", "c");
