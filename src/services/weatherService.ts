import axios from 'axios';
import SimpleCache from '../utils/cache';

const API_KEY = process.env.OPENWEATHERMAP_API_KEY || process.env.OPENWEATHER_API_KEY || '';
if (!API_KEY) {
  console.warn('WARNING: OpenWeather API key not set. Set OPENWEATHERMAP_API_KEY or OPENWEATHER_API_KEY in .env');
}
const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || '300');

type CityData = {
  city: string;
  currentTemp: number;
  minForecast: number | null;
  maxForecast: number | null;
  rawForecast?: any;
};

const cache = new SimpleCache<CityData>(CACHE_TTL);


class WeatherService {
  static async fetchCurrentWeather(city: string) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const resp = await axios.get(url);
    return resp.data;
  }

  static async fetchForecast(city: string) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const resp = await axios.get(url);
    return resp.data;
  }

  static async fetchCityData(city: string): Promise<CityData> {
    const key = `city:${city.toLowerCase()}`;
    const cached = cache.get(key);
    if (cached) return cached;

    // Fetch current and forecast in parallel
    const [currentResp, forecastResp] = await Promise.allSettled([
      WeatherService.fetchCurrentWeather(city),
      WeatherService.fetchForecast(city),
    ]);

    if (currentResp.status === 'rejected') throw currentResp.reason;
    const current = currentResp.value;

    let minForecast: number | null = null;
    let maxForecast: number | null = null;
    let rawForecast = null;

    if (forecastResp.status === 'fulfilled') {
      rawForecast = forecastResp.value;
      const temps = (forecastResp.value.list || []).map((i: any) => i.main.temp as number);
      if (temps.length > 0) {
        minForecast = Math.min(...temps);
        maxForecast = Math.max(...temps);
      }
    }

    const data: CityData = {
      city: current.name || city,
      currentTemp: Number((current.main.temp as number).toFixed(2)),
      minForecast: minForecast !== null ? Number(minForecast.toFixed(2)) : null,
      maxForecast: maxForecast !== null ? Number(maxForecast.toFixed(2)) : null,
      rawForecast,
    };

    cache.set(key, data);
    return data;
  }
}

export default WeatherService;
