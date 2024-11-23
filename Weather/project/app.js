async function getWeatherByCoords(lat, lon) {
    try {
        const [currentWeather, forecast, aqiData] = await Promise.all([
            WeatherService.getCurrentWeather(lat, lon),
            WeatherService.getForecast(lat, lon),
            WeatherService.getAirQuality(lat, lon)
        ]);

        UIService.updateCurrentWeather(currentWeather);
        UIService.updateHourlyForecast(forecast);
        UIService.updateDailyForecast(forecast);
        UIService.updateAirQuality(aqiData);
        
        document.getElementById('forecast-display').classList.remove('hidden');
    } catch (error) {
        UIService.showError(error.message);
    }
}

async function searchLocation() {
    const location = document.getElementById('location-input').value.trim();
    if (!location) return;

    try {
        const coords = await WeatherService.getCoordinates(location);
        getWeatherByCoords(coords.lat, coords.lon);
    } catch (error) {
        UIService.showError(error.message);
    }
}

function handleLocationError(error) {
    UIService.showError('Location Access Denied: Please enable location services or search manually');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
            handleLocationError
        );
    } else {
        UIService.showError('Geolocation not supported by your system');
    }
});

// Add enter key support for search
document.getElementById('location-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchLocation();
});