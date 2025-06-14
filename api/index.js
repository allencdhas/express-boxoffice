const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns OK if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 */
app.get('/health', (req, res) => {
  res.send('OK!');
});

// Helper function to run Python script
const runPythonScript = (scriptPath, args) => {
  return new Promise((resolve, reject) => {
    // In Vercel environment, use the system Python
    const pythonPath = process.env.VERCEL ? 'python' : 'python3';
    console.log('Using Python path:', pythonPath);
    console.log('Script path:', scriptPath);
    console.log('Arguments:', args);

    const pythonProcess = spawn(pythonPath, [scriptPath, ...args]);
    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
      console.log('Python stdout:', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      console.error('Python stderr:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log('Python process exited with code:', code);
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

/**
 * @swagger
 * /daily:
 *   get:
 *     summary: Get daily box office data
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Daily box office data
 *       400:
 *         description: Invalid date format
 */
app.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['daily', date]);
    res.json(result);
  } catch (error) {
    console.error('Error in /daily endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /weekend:
 *   get:
 *     summary: Get weekend box office data
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Weekend box office data
 *       400:
 *         description: Invalid parameters
 */
app.get('/weekend', async (req, res) => {
  try {
    const { year, week } = req.query;
    if (!year || !week) {
      return res.status(400).json({ error: 'Year and week parameters are required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['weekend', year, week]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /weekly:
 *   get:
 *     summary: Get weekly box office data
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: week
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Weekly box office data
 *       400:
 *         description: Invalid parameters
 */
app.get('/weekly', async (req, res) => {
  try {
    const { year, week } = req.query;
    if (!year || !week) {
      return res.status(400).json({ error: 'Year and week parameters are required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['weekly', year, week]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /monthly:
 *   get:
 *     summary: Get monthly box office data
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Monthly box office data
 *       400:
 *         description: Invalid parameters
 */
app.get('/monthly', async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month parameters are required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['monthly', year, month]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /seasonal:
 *   get:
 *     summary: Get seasonal box office data
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: season
 *         required: true
 *         schema:
 *           type: string
 *           enum: [spring, summer, fall, winter]
 *     responses:
 *       200:
 *         description: Seasonal box office data
 *       400:
 *         description: Invalid parameters
 */
app.get('/seasonal', async (req, res) => {
  try {
    const { year, season } = req.query;
    if (!year || !season) {
      return res.status(400).json({ error: 'Year and season parameters are required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['seasonal', year, season]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /quarterly:
 *   get:
 *     summary: Get quarterly box office data
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: quarter
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *     responses:
 *       200:
 *         description: Quarterly box office data
 *       400:
 *         description: Invalid parameters
 */
app.get('/quarterly', async (req, res) => {
  try {
    const { year, quarter } = req.query;
    if (!year || !quarter) {
      return res.status(400).json({ error: 'Year and quarter parameters are required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['quarterly', year, quarter]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /yearly:
 *   get:
 *     summary: Get yearly box office data
 *     parameters:
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yearly box office data
 *       400:
 *         description: Invalid parameters
 */
app.get('/yearly', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ error: 'Year parameter is required' });
    }
    const result = await runPythonScript(path.join(__dirname, '../boxoff.py'), ['yearly', year]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export the Express API
module.exports = app; 