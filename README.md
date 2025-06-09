# Box Office API

A RESTful API service that provides box office data for movies, built with Express.js and Python. The API offers various endpoints to retrieve box office statistics for different time periods.

## Features

- Daily box office data
- Weekend box office statistics
- Weekly box office reports
- Monthly box office summaries
- Seasonal box office analysis
- Quarterly box office data
- Yearly box office statistics
- Swagger UI documentation
- Docker support

## Prerequisites

- Node.js (v18 or higher)
- Python 3.x
- Docker (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/box-office-api.git
cd box-office-api
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Application

### Local Development

1. Start the server:
```bash
node boxoff.js
```

The server will start on port 3000 by default.

### Using Docker

1. Build the Docker image:
```bash
docker build -t box-office-api .
```

2. Run the container:
```bash
docker run -d -p 3000:3000 --name box-office-api box-office-api
```

## API Endpoints

### Health Check
- `GET /health`
  - Returns server health status

### Daily Box Office
- `GET /daily?date=YYYY-MM-DD`
  - Returns box office data for a specific date

### Weekend Box Office
- `GET /weekend?year=YYYY&week=WW`
  - Returns box office data for a specific weekend

### Weekly Box Office
- `GET /weekly?year=YYYY&week=WW`
  - Returns box office data for a specific week

### Monthly Box Office
- `GET /monthly?year=YYYY&month=MM`
  - Returns box office data for a specific month
  - Month should be 1-12

### Seasonal Box Office
- `GET /seasonal?year=YYYY&season=SEASON`
  - Returns box office data for a specific season
  - Season can be: spring, summer, fall, winter

### Quarterly Box Office
- `GET /quarterly?quarter=Q&year=YYYY`
  - Returns box office data for a specific quarter
  - Quarter should be 1-4

### Yearly Box Office
- `GET /yearly?year=YYYY`
  - Returns box office data for a specific year

## API Documentation

Swagger UI documentation is available at:
```
http://localhost:3000/docs
```

## Project Structure

```
box-office-api/
├── boxoff.js          # Main Express application
├── boxoff.py          # Python script for box office data
├── swagger.js         # Swagger configuration
├── Dockerfile         # Docker configuration
├── requirements.txt   # Python dependencies
└── package.json       # Node.js dependencies
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Successful request
- 400: Bad request (missing or invalid parameters)
- 500: Server error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 