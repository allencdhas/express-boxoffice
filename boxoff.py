import sys
import json
from boxoffice_api import BoxOffice

if len(sys.argv) < 2:
    print(json.dumps({"error": "Endpoint type required. Usage: python boxoff.py [daily|weekend|weekly|monthly|seasonal|quarterly|yearly] [params...]"}))
    sys.exit(1)

endpoint = sys.argv[1]
box_office = BoxOffice()

if endpoint == "daily":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Date required for daily endpoint. Usage: python boxoff.py daily YYYY-MM-DD"}))
        sys.exit(1)
    date = sys.argv[2]
    data = box_office.get_daily(date)
elif endpoint == "weekend":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Year and week required for weekend endpoint. Usage: python boxoff.py weekend YYYY WW"}))
        sys.exit(1)
    year = int(sys.argv[2])
    week = int(sys.argv[3])
    data = box_office.get_weekend(year=year, week=week)
elif endpoint == "weekly":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Year and week required for weekly endpoint. Usage: python boxoff.py weekly YYYY WW"}))
        sys.exit(1)
    year = int(sys.argv[2])
    week = int(sys.argv[3])
    data = box_office.get_weekly(year=year, week=week)
elif endpoint == "monthly":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Year and month required for monthly endpoint. Usage: python boxoff.py monthly YYYY MM"}))
        sys.exit(1)
    year = int(sys.argv[2])
    month = int(sys.argv[3])
    data = box_office.get_monthly(year=year, month=month)
elif endpoint == "seasonal":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Year and season required for seasonal endpoint. Usage: python boxoff.py seasonal YYYY [spring|summer|fall|winter]"}))
        sys.exit(1)
    year = int(sys.argv[2])
    season = sys.argv[3]
    data = box_office.get_season(year=year, season=season)
elif endpoint == "quarterly":
    if len(sys.argv) < 4:
        print(json.dumps({"error": "Quarter and year required for quarterly endpoint. Usage: python boxoff.py quarterly Q YYYY"}))
        sys.exit(1)
    quarter = int(sys.argv[2])
    year = int(sys.argv[3])
    data = box_office.get_quarterly(quarterly=quarter, year=year)
elif endpoint == "yearly":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Year required for yearly endpoint. Usage: python boxoff.py yearly YYYY"}))
        sys.exit(1)
    year = int(sys.argv[2])
    data = box_office.get_yearly(year=year)
else:
    print(json.dumps({"error": "Invalid endpoint. Supported endpoints: daily, weekend, weekly, monthly, seasonal, quarterly, yearly"}))
    sys.exit(1)

print(json.dumps(data))