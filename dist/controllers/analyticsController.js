"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCitiesAnalytics = postCitiesAnalytics;
exports.getCityAnalytics = getCityAnalytics;
const weatherService_1 = __importDefault(require("../services/weatherService"));
const cityWeather_1 = require("../models/cityWeather");
const DEFAULT_THRESHOLD = 35; // °C
async function postCitiesAnalytics(req, res) {
    try {
        const cities = req.body.cities;
        const threshold = typeof req.body.threshold === 'number' ? req.body.threshold : DEFAULT_THRESHOLD;
        if (!Array.isArray(cities) || cities.length === 0) {
            return res.status(400).json({ error: 'cities must be a non-empty array' });
        }
        const promises = cities.map((c) => weatherService_1.default.fetchCityData(c));
        const results = await Promise.all(promises);
        // Save to DB (upsert latest)
        await Promise.all(results.map((r) => cityWeather_1.CityWeather.upsert({ city: r.city, currentTemp: r.currentTemp, minForecast: r.minForecast, maxForecast: r.maxForecast, rawForecast: r.rawForecast })));
        const temps = results.map((r) => r.currentTemp).filter((t) => typeof t === 'number');
        const averageTemperature = temps.reduce((s, v) => s + v, 0) / temps.length;
        let highest = { city: '', temp: -Infinity };
        let lowest = { city: '', temp: Infinity };
        const hotCities = [];
        for (const r of results) {
            if (r.currentTemp > highest.temp)
                highest = { city: r.city, temp: r.currentTemp };
            if (r.currentTemp < lowest.temp)
                lowest = { city: r.city, temp: r.currentTemp };
            if (r.currentTemp > threshold)
                hotCities.push(r.city);
        }
        res.json({
            averageTemperature: Number(averageTemperature.toFixed(2)),
            highestTemperature: highest,
            lowestTemperature: lowest,
            hotCities,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
}
async function getCityAnalytics(req, res) {
    try {
        const name = req.params.name;
        const threshold = req.query.threshold ? Number(req.query.threshold) : DEFAULT_THRESHOLD;
        const data = await weatherService_1.default.fetchCityData(name);
        if (!data)
            return res.status(404).json({ error: 'city not found' });
        const warning = data.currentTemp > threshold ? `Temperature exceeds ${threshold}°C` : undefined;
        // Save or update DB record
        await cityWeather_1.CityWeather.upsert({ city: data.city, currentTemp: data.currentTemp, minForecast: data.minForecast, maxForecast: data.maxForecast, rawForecast: data.rawForecast });
        res.json({
            city: data.city,
            currentTemperature: data.currentTemp,
            minForecast: data.minForecast,
            maxForecast: data.maxForecast,
            warning,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
}
