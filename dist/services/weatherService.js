"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cache_1 = __importDefault(require("../utils/cache"));
const API_KEY = process.env.OPENWEATHERMAP_API_KEY || process.env.OPENWEATHER_API_KEY || '';
if (!API_KEY) {
    console.warn('WARNING: OpenWeather API key not set. Set OPENWEATHERMAP_API_KEY or OPENWEATHER_API_KEY in .env');
}
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || '300');
const cache = new cache_1.default(CACHE_TTL);
const KELVIN_TO_C = (k) => k - 273.15;
class WeatherService {
    static async fetchCurrentWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
        const resp = await axios_1.default.get(url);
        return resp.data;
    }
    static async fetchForecast(city) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
        const resp = await axios_1.default.get(url);
        return resp.data;
    }
    static async fetchCityData(city) {
        const key = `city:${city.toLowerCase()}`;
        const cached = cache.get(key);
        if (cached)
            return cached;
        // Fetch current and forecast in parallel
        const [currentResp, forecastResp] = await Promise.allSettled([
            WeatherService.fetchCurrentWeather(city),
            WeatherService.fetchForecast(city),
        ]);
        if (currentResp.status === 'rejected')
            throw currentResp.reason;
        const current = currentResp.value;
        let minForecast = null;
        let maxForecast = null;
        let rawForecast = null;
        if (forecastResp.status === 'fulfilled') {
            rawForecast = forecastResp.value;
            // forecast.list contains 3-hourly entries; we'll compute min/max for next 5 days
            const temps = (forecastResp.value.list || []).map((i) => KELVIN_TO_C(i.main.temp));
            if (temps.length > 0) {
                minForecast = Math.min(...temps);
                maxForecast = Math.max(...temps);
            }
        }
        const data = {
            city: current.name || city,
            currentTemp: Number(KELVIN_TO_C(current.main.temp).toFixed(2)),
            minForecast: minForecast !== null ? Number(minForecast.toFixed(2)) : null,
            maxForecast: maxForecast !== null ? Number(maxForecast.toFixed(2)) : null,
            rawForecast,
        };
        cache.set(key, data);
        return data;
    }
}
exports.default = WeatherService;
