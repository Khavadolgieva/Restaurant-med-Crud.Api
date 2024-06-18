const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const CRUD_API_KEY = 'eXKqxzwNehQFey6fzQ9zrGlLkiJqGoP5I72jx-rOUCqi8NHrcA';
const SECRET_KEY = 'sommer';

app.use(bodyParser.json());
app.use(cors());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Ingen token oppgitt');
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token-verifisering feilet:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const authorize = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Du har ikke tillatelse til å utføre denne handlingen.' });
    }
  };
};

// Registrer bruker
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Brukernavn, passord og rolle er påkrevd' });
  }
  try {
    const response = await axios.post('https://crudapi.co.uk/api/v1/user', {
      username,
      password,
      role 
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRUD_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Feil under registrering:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Registrering feilet. Vennligst prøv igjen.' });
  }
});

// Logg inn bruker
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Brukernavn og passord er påkrevd' });
  }
  try {
    const response = await axios.get('https://crudapi.co.uk/api/v1/user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CRUD_API_KEY}`
      }
    });

    const users = response.data.items;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Ugyldige legitimasjon' });
    }
  } catch (error) {
    console.error('Feil under innlogging:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Innlogging feilet. Vennligst prøv igjen.' });
  }
});

// Endepunkt for å hente restauranter fra CRUD API uten autentisering
app.get('/api/crud-restaurants', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://crudapi.co.uk/api/v1/restaurants',
    headers: {
      'Authorization': `Bearer ${CRUD_API_KEY}`
    }
  };

  try {
    const response = await axios.request(options);
    const restaurants = response.data.items.map(restaurant => ({
      ...restaurant,
      source: 'crudapi',
      id: restaurant._uuid
    }));
    res.json(restaurants);
  } catch (error) {
    console.error('Feil ved henting av restauranter fra CRUD API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Feil ved henting av restauranter. Vennligst prøv igjen.' });
  }
});

// Endepunkt for å hente en restaurant basert på ID
app.get('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const options = {
    method: 'GET',
    url: `https://crudapi.co.uk/api/v1/restaurants/${id}`,
    headers: {
      'Authorization': `Bearer ${CRUD_API_KEY}`
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Feil ved henting av restaurant:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Feil ved henting av restaurant. Vennligst prøv igjen.' });
  }
});

// Endepunkt for å opprette en restaurant (bare admin)
app.post('/api/restaurants', authenticateToken, authorize(['admin']), async (req, res) => {
  const restaurantData = req.body;
  const options = {
    method: 'POST',
    url: 'https://crudapi.co.uk/api/v1/restaurants',
    headers: {
      'Authorization': `Bearer ${CRUD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: [restaurantData]
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating restaurant:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Feil ved oppretting av restaurant. Vennligst prøv igjen.' });
  }
});

// Endepunkt for å oppdatere en restaurant (bare admin)
app.put('/api/restaurants/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  const restaurantData = req.body;
  const options = {
    method: 'PUT',
    url: `https://crudapi.co.uk/api/v1/restaurants/${id}`,
    headers: {
      'Authorization': `Bearer ${CRUD_API_KEY}`,
      'Content-Type': 'application/json'
    },
    data: restaurantData
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating restaurant:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Feil ved oppdatering av restaurant. Vennligst prøv igjen.' });
  }
});

// Endepunkt for å slette en restaurant (bare admin)
app.delete('/api/restaurants/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  const { id } = req.params;
  const options = {
    method: 'DELETE',
    url: `https://crudapi.co.uk/api/v1/restaurants/${id}`,
    headers: {
      'Authorization': `Bearer ${CRUD_API_KEY}`
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error deleting restaurant:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Feil ved sletting av restaurant. Vennligst prøv igjen.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server kjører på port ${PORT}`);
});