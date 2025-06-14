# Box Office API

A Flask-based API for retrieving box office data.

## Features

- Daily box office data
- Weekend box office data
- Weekly box office data
- Monthly box office data
- Seasonal box office data
- Quarterly box office data
- Yearly box office data

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/express-boxoffice.git
cd express-boxoffice
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Local Development

Run the Flask development server:
```bash
python api/index.py
```

The API will be available at `http://localhost:5000`

### Vercel Deployment

The application is configured for deployment on Vercel. Simply push to your repository and Vercel will automatically deploy your changes.

## API Endpoints

### Health Check
```
GET /health
```
Returns "OK!" if the server is running.

### Daily Box Office
```
GET /daily?date=YYYY-MM-DD
```
Get box office data for a specific date.

### Weekend Box Office
```
GET /weekend?year=YYYY&week=WW
```
Get box office data for a specific weekend.

### Weekly Box Office
```
GET /weekly?year=YYYY&week=WW
```
Get box office data for a specific week.

### Monthly Box Office
```
GET /monthly?year=YYYY&month=MM
```
Get box office data for a specific month.

### Seasonal Box Office
```
GET /seasonal?year=YYYY&season=SEASON
```
Get box office data for a specific season (spring, summer, fall, winter).

### Quarterly Box Office
```
GET /quarterly?year=YYYY&quarter=Q
```
Get box office data for a specific quarter (1-4).

### Yearly Box Office
```
GET /yearly?year=YYYY
```
Get box office data for a specific year.

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (missing or invalid parameters)
- 500: Internal Server Error

Error responses include a JSON object with an error message:
```json
{
  "error": "Error message here"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 