from flask import Flask, request, jsonify
from boxoffice_api import BoxOffice
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

box_office = BoxOffice()

@app.route('/health')
def health():
    return 'OK!'

@app.route('/daily')
def daily():
    date = request.args.get('date')
    if not date:
        return jsonify({'error': 'Date parameter is required'}), 400
    try:
        data = box_office.get_daily(date)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/weekend')
def weekend():
    year = request.args.get('year')
    week = request.args.get('week')
    if not year or not week:
        return jsonify({'error': 'Year and week parameters are required'}), 400
    try:
        data = box_office.get_weekend(year=int(year), week=int(week))
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/weekly')
def weekly():
    year = request.args.get('year')
    week = request.args.get('week')
    if not year or not week:
        return jsonify({'error': 'Year and week parameters are required'}), 400
    try:
        data = box_office.get_weekly(year=int(year), week=int(week))
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/monthly')
def monthly():
    year = request.args.get('year')
    month = request.args.get('month')
    if not year or not month:
        return jsonify({'error': 'Year and month parameters are required'}), 400
    try:
        data = box_office.get_monthly(year=int(year), month=int(month))
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/seasonal')
def seasonal():
    year = request.args.get('year')
    season = request.args.get('season')
    if not year or not season:
        return jsonify({'error': 'Year and season parameters are required'}), 400
    try:
        data = box_office.get_season(year=int(year), season=season)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/quarterly')
def quarterly():
    year = request.args.get('year')
    quarter = request.args.get('quarter')
    if not year or not quarter:
        return jsonify({'error': 'Year and quarter parameters are required'}), 400
    try:
        data = box_office.get_quarterly(quarterly=int(quarter), year=int(year))
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/yearly')
def yearly():
    year = request.args.get('year')
    if not year:
        return jsonify({'error': 'Year parameter is required'}), 400
    try:
        data = box_office.get_yearly(year=int(year))
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run() 