import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number; // Latitude of the location
  lon: number; // Longitude of the location
}

class Weather {
  constructor(
    public temp: number, // Temperature in Celsius
    public description: string, // Description of the weather
    public icon: string // URL of the weather icon
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';

  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(this.buildGeocodeQuery(query));
    return response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }
  // TODO: Create buildForecastQuery method
  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutely,hourly&units=metric&appid=${this.apiKey}`;
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
  // TODO: Build fetchForecastData method
  private async fetchForecastData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildForecastQuery(coordinates));
    return response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(weatherData: any): Weather {
    const { main, weather } = weatherData;
    return new Weather(main.temp, weather[0].description, weather[0].icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast = weatherData.slice(1, 6).map((data) => {
      const { temp, weather } = data;
      return new Weather(temp.day, weather[0].description, weather[0].icon);
    });
    return [currentWeather, ...forecast];
  }

  // TODO: Complete getWeatherForCity method
  public async getWeatherByCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const currentWeatherData = await this.fetchWeatherData(coordinates);
    const forecastData = await this.fetchForecastData(coordinates);
    const currentWeather = this.parseCurrentWeather(currentWeatherData);
    return this.buildForecastArray(currentWeather, forecastData.list);
  }
}

export default new WeatherService();
