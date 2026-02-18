import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class CityWeather extends Model {
  public id!: number;
  public city!: string;
  public currentTemp!: number;
  public minForecast!: number | null;
  public maxForecast!: number | null;
  public rawForecast!: object | null;
  // Timestamps (managed by Sequelize when `timestamps: true`)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CityWeather.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    currentTemp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minForecast: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    maxForecast: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    rawForecast: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: 'city_weather',
    sequelize,
    timestamps: true,
  }
);

export default CityWeather;
