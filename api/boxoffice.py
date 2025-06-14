from http.server import BaseHTTPRequestHandler
import json
from boxoffice_api import BoxOffice
import sys
from urllib.parse import parse_qs, urlparse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse the URL and query parameters
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query_params = parse_qs(parsed_url.query)

            # Initialize BoxOffice
            box_office = BoxOffice()

            # Handle different endpoints
            if path == '/daily':
                if 'date' not in query_params:
                    self.send_error(400, 'Date parameter is required')
                    return
                date = query_params['date'][0]
                data = box_office.get_daily(date)
            
            elif path == '/weekend':
                if 'year' not in query_params or 'week' not in query_params:
                    self.send_error(400, 'Year and week parameters are required')
                    return
                year = int(query_params['year'][0])
                week = int(query_params['week'][0])
                data = box_office.get_weekend(year=year, week=week)
            
            elif path == '/weekly':
                if 'year' not in query_params or 'week' not in query_params:
                    self.send_error(400, 'Year and week parameters are required')
                    return
                year = int(query_params['year'][0])
                week = int(query_params['week'][0])
                data = box_office.get_weekly(year=year, week=week)
            
            elif path == '/monthly':
                if 'year' not in query_params or 'month' not in query_params:
                    self.send_error(400, 'Year and month parameters are required')
                    return
                year = int(query_params['year'][0])
                month = int(query_params['month'][0])
                data = box_office.get_monthly(year=year, month=month)
            
            elif path == '/seasonal':
                if 'year' not in query_params or 'season' not in query_params:
                    self.send_error(400, 'Year and season parameters are required')
                    return
                year = int(query_params['year'][0])
                season = query_params['season'][0]
                data = box_office.get_season(year=year, season=season)
            
            elif path == '/quarterly':
                if 'year' not in query_params or 'quarter' not in query_params:
                    self.send_error(400, 'Year and quarter parameters are required')
                    return
                year = int(query_params['year'][0])
                quarter = int(query_params['quarter'][0])
                data = box_office.get_quarterly(quarterly=quarter, year=year)
            
            elif path == '/yearly':
                if 'year' not in query_params:
                    self.send_error(400, 'Year parameter is required')
                    return
                year = int(query_params['year'][0])
                data = box_office.get_yearly(year=year)
            
            else:
                self.send_error(404, 'Endpoint not found')
                return

            # Send the response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(data).encode())
            
        except Exception as e:
            self.send_error(500, str(e)) 