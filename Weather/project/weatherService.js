class WeatherService {
    static async getCoordinates(location) {
        const response = await fetch(
            `${CONFIG.GEOCODING_API_BASE}/direct?q=${location}&limit=1&appid=${CONFIG.API_KEY}`
        );
        const data = await response.json();
        if (!data.length) throw new Error('Location not found');
        return { lat: data[0].lat, lon: data[0].lon };
    }

    static async getCurrentWeather(lat, lon) {
        const response = await fetch(
            `${CONFIG.WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`
        );
        if (!response.ok) throw new Error('Weather data unavailable');
        return await response.json();
    }

    static async getForecast(lat, lon) {
        const response = await fetch(
            `${CONFIG.WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`
        );
        if (!response.ok) throw new Error('Forecast data unavailable');
        return await response.json();
    }

    static async getAirQuality(lat, lon) {
        const response = await fetch(
            `${CONFIG.AQI_API_BASE}?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}`
        );
        if (!response.ok) throw new Error('Air quality data unavailable');
        return await response.json();
    }
}