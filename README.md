# Weather Analytics API

Simple Express + TypeScript API that fetches weather data (current + 5-day forecast) from OpenWeatherMap, stores recent fetches in Postgres via Sequelize, and exposes analytics endpoints.

Required env vars (see `.env.example`):
- DATABASE_URL - Postgres connection string
- OPENWEATHERMAP_API_KEY - API key from OpenWeatherMap
- PORT - server port (default 3000)

Install & run (macOS / zsh):

```bash
cd /Users/nikhil/Desktop/weather
npm install
# copy .env.example -> .env and fill values
npm run dev
```

Endpoints
- POST /analytics/cities
  - Body: { "cities": ["London","New York"], "threshold": 35 }
  - Returns aggregated analytics across provided cities.
- GET /analytics/city/:name
  - Returns current temp, min/max forecast for next 5 days, and any warning (temp > threshold default 35°C).
