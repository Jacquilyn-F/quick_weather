import { promises as fs } from 'fs';
import { join } from 'path';




// TODO: Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}


// TODO: Complete the HistoryService class
class HistoryService {
  private async read(): Promise<City[]> {
    try {
      const filePath = join(__dirname, '..', 'db', 'searchHistory.json');
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const filePath = join(__dirname, '..', 'db', 'searchHistory.json');
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(filePath, data, 'utf8');
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }


  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const id = cities.length ? cities[cities.length - 1].id + 1 : 1;
    const newCity = new City(id, name);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== parseInt(id, 10));
    await this.write(updatedCities);
  }
}

export default new HistoryService();
