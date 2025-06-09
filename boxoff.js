const express = require('express');
const { spawn } = require('child_process');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();
const PORT = process.env.PORT || 3000;

function callPythonScript(args) {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['boxoff.py', ...args]);
    let data = '';
    let error = '';

    py.stdout.on('data', (chunk) => {
      data += chunk;
    });

    py.stderr.on('data', (chunk) => {
      error += chunk;
    });

    py.on('close', (code) => {
      if (error) {
        reject(error.trim());
      } else {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject('Failed to parse Python output: ' + data);
        }
      }
    });
  });
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.send('OK!');
});

app.get('/daily', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Missing date query parameter (YYYY-MM-DD)' });
  }
  callPythonScript(['daily', date])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.get('/weekend', (req, res) => {
  const year = req.query.year;
  const week = req.query.week;
  if (!year || !week) {
    return res.status(400).json({ error: 'Missing year or week query parameters (YYYY WW)' });
  }
  callPythonScript(['weekend', year, week])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.get('/weekly', (req, res) => {
  const year = req.query.year;
  const week = req.query.week;
  if (!year || !week) {
    return res.status(400).json({ error: 'Missing year or week query parameters (YYYY WW)' });
  }
  callPythonScript(['weekly', year, week])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.get('/monthly', (req, res) => {
  const year = req.query.year;
  const month = req.query.month;
  if (!year || !month) {
    return res.status(400).json({ error: 'Missing year or month query parameters (YYYY MM)' });
  }
  callPythonScript(['monthly', year, month])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.get('/seasonal', (req, res) => {
  const year = req.query.year;
  const season = req.query.season;
  if (!year || !season) {
    return res.status(400).json({ error: 'Missing year or season query parameters (YYYY [spring|summer|fall|winter])' });
  }
  callPythonScript(['seasonal', year, season])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.get('/quarterly', (req, res) => {
  const quarter = req.query.quarter;
  const year = req.query.year;
  if (!quarter || !year) {
    return res.status(400).json({ error: 'Missing quarter or year query parameters (Q YYYY)' });
  }
  callPythonScript(['quarterly', quarter, year])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.get('/yearly', (req, res) => {
  const year = req.query.year;
  if (!year) {
    return res.status(400).json({ error: 'Missing year query parameter (YYYY)' });
  }
  callPythonScript(['yearly', year])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 