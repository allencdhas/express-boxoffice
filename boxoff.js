const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns OK if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK!
 */
app.get('/health', (req, res) => {
  res.send('OK!');
});

// Helper function to run Python script
const runPythonScript = (scriptPath, args) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath, ...args]);
    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`));
      } else {
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${result}`));
        }
      }
    });
  });
};

// Daily box office endpoint
/**
 * @swagger
 * /daily:
 *   get:
 *     summary: Get daily box office data
 *     description: Retrieves box office data for a specific date
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Box office data for the specified date
 *       400:
 *         description: Invalid date format
 *       500:
 *         description: Server error
 */
app.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    const result = await runPythonScript('boxoff.py', ['daily', date]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Weekend box office endpoint
/**
 * @swagger
 * /weekend:
 *   get:
 *     summary: Get weekend box office data
 *     description: Retrieves box office data for a specific weekend
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *         description: Week number (1-52)
 *     responses:
 *       200:
 *         description: Box office data for the specified weekend
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
app.get('/weekend', async (req, res) => {
  try {
    const { year, week } = req.query;
    if (!year || !week) {
      return res.status(400).json({ error: 'Year and week parameters are required' });
    }
    const result = await runPythonScript('boxoff.py', ['weekend', year, week]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Weekly box office endpoint
/**
 * @swagger
 * /weekly:
 *   get:
 *     summary: Get weekly box office data
 *     description: Retrieves box office data for a specific week
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *         description: Week number (1-52)
 *     responses:
 *       200:
 *         description: Box office data for the specified week
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
app.get('/weekly', async (req, res) => {
  try {
    const { year, week } = req.query;
    if (!year || !week) {
      return res.status(400).json({ error: 'Year and week parameters are required' });
    }
    const result = await runPythonScript('boxoff.py', ['weekly', year, week]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Monthly box office endpoint
/**
 * @swagger
 * /monthly:
 *   get:
 *     summary: Get monthly box office data
 *     description: Retrieves box office data for a specific month
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Month number (1-12)
 *     responses:
 *       200:
 *         description: Box office data for the specified month
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
app.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month parameters are required' });
    }
    const result = await runPythonScript('boxoff.py', ['monthly', year, month]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seasonal box office endpoint
/**
 * @swagger
 * /seasonal:
 *   get:
 *     summary: Get seasonal box office data
 *     description: Retrieves box office data for a specific season
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: string
 *           enum: [spring, summer, fall, winter]
 *         description: Season name
 *     responses:
 *       200:
 *         description: Box office data for the specified season
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
app.get('/seasonal', async (req, res) => {
  try {
    const { year, season } = req.query;
    if (!year || !season) {
      return res.status(400).json({ error: 'Year and season parameters are required' });
    }
    const result = await runPythonScript('boxoff.py', ['seasonal', year, season]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quarterly box office endpoint
/**
 * @swagger
 * /quarterly:
 *   get:
 *     summary: Get quarterly box office data
 *     description: Retrieves box office data for a specific quarter
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *       - in: query
 *         name: quarter
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4]
 *         description: Quarter number (1-4)
 *     responses:
 *       200:
 *         description: Box office data for the specified quarter
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
app.get('/quarterly', async (req, res) => {
  try {
    const { year, quarter } = req.query;
    if (!year || !quarter) {
      return res.status(400).json({ error: 'Year and quarter parameters are required' });
    }
    const result = await runPythonScript('boxoff.py', ['quarterly', year, quarter]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yearly box office endpoint
/**
 * @swagger
 * /yearly:
 *   get:
 *     summary: Get yearly box office data
 *     description: Retrieves box office data for a specific year
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2024)
 *     responses:
 *       200:
 *         description: Box office data for the specified year
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
app.get('/yearly', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ error: 'Year parameter is required' });
    }
    const result = await runPythonScript('boxoff.py', ['yearly', year]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export the Express app for Vercel
module.exports = app; 