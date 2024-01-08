// proxy-server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/trains-between-stations', async (req, res) => {
  const { from, to } = req.query;

  try {
    const response = await fetch(`https://indian-railway-api.cyclic.app/trains/betweenStations/?from=${from}&to=${to}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`);
});
