import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
 // TODO: GET weather data from city name
  // TODO: save city to search history
  router.post('/', async (req: Request, res: Response) => {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).send({ error: 'City name is required' });
    }
  
    try {
      console.log(`Fetching weather data for city: ${cityName}`);
      const weatherData = await WeatherService.getWeatherByCity(cityName);
      await HistoryService.addCity(cityName);
      return res.json(weatherData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching weather data:', error.message);
      } else {
        console.error('Error fetching weather data:', error);
      }
      return res.status(500).send({ error: 'Failed to retrieve weather data' });
    }
  });
  
  // TODO: GET search history
  router.get('/history', async (_req: Request, res: Response) => {
    try {
      const cities = await HistoryService.getCities();
      return res.status(200).json(cities);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching search history:', error.message);
      } else {
        console.error('Error fetching search history:', error);
      }
      return res.status(500).json({ error: 'Failed to retrieve search history' });
    }
  })
  
  // * BONUS TODO: DELETE city from search history
  router.delete('/history/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }
  
    try {
      await HistoryService.removeCity(id);
      return res.status(204).end();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error removing city from search history:', error.message);
      } else {
        console.error('Error removing city from search history:', error);
      }
      return res.status(500).json({ error: 'Failed to remove city from search history' });
    }
  });
  
  
  export default router;