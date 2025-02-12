// TODO: Define a City class with name and id properties
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class City {
  constructor(public name: string, public id: string = uuidv4()) {}
}


// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = 'server/db/db.json';

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data) as City[];
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const city = new City(cityName);
    cities.push(city);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter(city => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();