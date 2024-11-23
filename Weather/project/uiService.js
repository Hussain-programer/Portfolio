class UIService {
    static updateCurrentWeather(data) {
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        
        document.getElementById('weather-display').innerHTML = `
            <div class="weather-info">
                <div class="location">${data.name}, ${data.sys.country}</div>
                <div class="temp">${Math.round(data.main.temp)}°C</div>
                <div class="description">${data.weather[0].description}</div>
                <div class="details">
                    <div class="info-card">
                        <div>Humidity: ${data.main.humidity}%</div>
                        <div>Wind: ${Math.round(data.wind.speed * 3.6)} km/h</div>
                    </div>
                    <div class="info-card">
                        <div>Feels Like: ${Math.round(data.main.feels_like)}°C</div>
                        <div>Pressure: ${data.main.pressure} hPa</div>
                    </div>
                    <div class="info-card">
                        <div>Sunrise: ${sunrise}</div>
                        <div>Sunset: ${sunset}</div>
                    </div>
                </div>
            </div>
        `;
    }

    static updateHourlyForecast(data) {
        const hourlyHTML = data.list.slice(0, 8).map(item => `
            <div class="forecast-card">
                <div>${new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>${Math.round(item.main.temp)}°C</div>
                <div>${Math.round(item.wind.speed * 3.6)} km/h</div>
                <div>${item.pop > 0 ? Math.round(item.pop * 100) + '%' : 'No'} rain</div>
            </div>
        `).join('');
        
        document.getElementById('hourly-forecast').innerHTML = hourlyHTML;
    }

    static updateDailyForecast(data) {
        const dailyData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = days[date.getDay()];
            
            if (!dailyData.find(d => d.day === day)) {
                dailyData.push({
                    day,
                    high: item.main.temp_max,
                    low: item.main.temp_min,
                    condition: item.weather[0].main
                });
            }
        });

        const dailyHTML = dailyData.slice(0, 5).map(day => `
            <div class="forecast-card">
                <div>${day.day}</div>
                <div>${Math.round(day.high)}°C</div>
                <div>${Math.round(day.low)}°C</div>
                <div>${day.condition}</div>
            </div>
        `).join('');
        
        document.getElementById('daily-forecast').innerHTML = dailyHTML;
    }

    static updateAirQuality(aqiData) {
        const aqi = aqiData.list[0].main.aqi;
        const aqiLevel = this.getAQILevel(aqi);
        
        document.getElementById('extra-info').innerHTML = `
            <div class="info-card">
                <div>Air Quality: ${aqiLevel.level}</div>
                <div>${aqiLevel.message}</div>
            </div>
        `;
    }

    static getAQILevel(aqi) {
        const levels = {
            1: { level: 'Good', message: 'Air quality is good' },
            2: { level: 'Fair', message: 'Moderate air quality' },
            3: { level: 'Moderate', message: 'Unhealthy for sensitive groups' },
            4: { level: 'Poor', message: 'Unhealthy air quality' },
            5: { level: 'Very Poor', message: 'Very unhealthy air quality' }
        };
        return levels[aqi] || levels[1];
    }

    static showError(message) {
        document.getElementById('weather-display').innerHTML = `
            <div class="error">System Malfunction: ${message}</div>
        `;
        document.getElementById('forecast-display').classList.add('hidden');
    }
}