const express = require('express');
const { spawn } = require('child_process');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

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

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns OK if the server is running
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK!
 */
app.get('/health', (req, res) => {
  res.send('OK!');
});

/**
 * @swagger
 * /daily:
 *   get:
 *     summary: Get daily box office data
 *     description: Retrieve box office data for a specific date
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-03-20"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Daily box office data
 *       400:
 *         description: Missing date parameter
 *       500:
 *         description: Server error
 */
app.get('/daily', (req, res) => {
  const date = req.query.date;
  if (!date) {
    return res.status(400).json({ error: 'Missing date query parameter (YYYY-MM-DD)' });
  }
  callPythonScript(['daily', date])
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error }));
});

/**
 * @swagger
 * /weekend:
 *   get:
 *     summary: Get weekend box office data
 *     description: Retrieve box office data for a specific weekend
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year in YYYY format
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *         description: Week number
 *     responses:
 *       200:
 *         description: Weekend box office data
 *       400:
 *         description: Missing year or week parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /weekly:
 *   get:
 *     summary: Get weekly box office data
 *     description: Retrieve box office data for a specific week
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year in YYYY format
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *         description: Week number
 *     responses:
 *       200:
 *         description: Weekly box office data
 *       400:
 *         description: Missing year or week parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /monthly:
 *   get:
 *     summary: Get monthly box office data
 *     description: Retrieve box office data for a specific month
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year in YYYY format
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 3
 *         description: Month number (1-12)
 *     responses:
 *       200:
 *         description: Monthly box office data
 *       400:
 *         description: Missing year or month parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /seasonal:
 *   get:
 *     summary: Get seasonal box office data
 *     description: Retrieve box office data for a specific season
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year in YYYY format
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: string
 *           enum: [spring, summer, fall, winter]
 *           example: spring
 *         description: Season name
 *     responses:
 *       200:
 *         description: Seasonal box office data
 *       400:
 *         description: Missing year or season parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /quarterly:
 *   get:
 *     summary: Get quarterly box office data
 *     description: Retrieve box office data for a specific quarter
 *     parameters:
 *       - in: query
 *         name: quarter
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *           example: 1
 *         description: Quarter number (1-4)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year in YYYY format
 *     responses:
 *       200:
 *         description: Quarterly box office data
 *       400:
 *         description: Missing quarter or year parameters
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /yearly:
 *   get:
 *     summary: Get yearly box office data
 *     description: Retrieve box office data for a specific year
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2024
 *         description: Year in YYYY format
 *     responses:
 *       200:
 *         description: Yearly box office data
 *       400:
 *         description: Missing year parameter
 *       500:
 *         description: Server error
 */
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