"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityWeather = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
class CityWeather extends sequelize_1.Model {
}
exports.CityWeather = CityWeather;
CityWeather.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    currentTemp: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    minForecast: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    maxForecast: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    rawForecast: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'city_weather',
    sequelize: index_1.sequelize,
    timestamps: true,
});
exports.default = CityWeather;
