import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL = process.env.API_BASE_URL;
  private apiKey = process.env.API_KEY;
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );
    return response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { city, list } = response;
    const currentWeather = list[0];
    return new Weather(
      city.name,
      currentWeather.dt_txt,
      currentWeather.weather[0].icon,
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.wind.speed,
      currentWeather.main.humidity
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data: any) => {
      return new Weather(
        currentWeather.city,
        data.dt_txt,
        data.weather[0].icon,
        data.weather[0].description,
        data.main.temp,
        data.wind.speed,
        data.main.humidity
      );
    });
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();
