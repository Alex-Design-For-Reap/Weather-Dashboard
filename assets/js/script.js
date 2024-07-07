const apiKey = 'e17903875f48eb578e871c60bdfa5def'; // "YOUR_API_KEY_HERE" Replace with your own API key here
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const clearHistoryBtn = document.getElementById('clear-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const cityName = cityInput.value;
    getCoordinates(cityName);
});

clearHistoryBtn.addEventListener('click', clearSearchHistory);

function getCoordinates(cityName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon, cityName);
                addToSearchHistory(cityName);
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching coordinates:', error));
}

function getWeather(lat, lon, cityName) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data, cityName);
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data, cityName) {
    const weather = data.list[0];
    currentWeather.innerHTML = `
    <div class="card text-white bg-primary mb-3">
        <h2 class="card-header">Current Weather in ${cityName}</h2>
        <div class="row card-body ">
            <div class="col-md-4">
                <p class="card-text"><strong>Date:</strong> ${new Date(weather.dt_txt).toLocaleDateString()}</p>
                <p><strong>Temperature:</strong> ${weather.main.temp} °C</p>
                <p><strong>Humidity:</strong> ${weather.main.humidity} %</p>
                <p><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
                <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
            </div>
        </div>
    </div>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = `
    <div class="card col-12 text-white bg-secondary mb-3">
    <h2 class="card-header">5-Day Forecast</h2>
    </div>
    `;
    for (let i = 0; i < data.list.length; i += 8) {
        const weather = data.list[i];
        forecast.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <p class="card-text"><strong>Date:</strong> ${new Date(weather.dt_txt).toLocaleDateString()}</p>
                    <p class="card-text"><strong>Temperature:</strong> ${weather.main.temp} °C</p>
                    <p class="card-text"><strong>Humidity:</strong> ${weather.main.humidity} %</p>
                    <p class="card-text"><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
                    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}">
                </div>
            </div>
        `;
    }
}

function addToSearchHistory(cityName) {
    const cities = JSON.parse(localStorage.getItem('cities')) || [];

    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));

        const cityButton = document.createElement('button');
        cityButton.textContent = cityName;
        cityButton.className = 'btn btn-secondary btn-block mb-2';
        cityButton.addEventListener('click', () => {
            getCoordinates(cityName);
        });
        searchHistory.appendChild(cityButton);
    }
}


function saveToLocalStorage(cityName) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

function loadFromLocalStorage() {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.forEach(cityName => {
        addToSearchHistory(cityName);
    });
}

function clearSearchHistory() {
    localStorage.removeItem('cities');
    searchHistory.innerHTML = '';
}

loadFromLocalStorage();
