import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGO_DB_URI = os.getenv('MONGO_DB_URI', 'mongodb://localhost:27017')
MONGO_DB_NAME = os.getenv('MONGO_DB_NAME', 'donorsUSA')
MONGO_DB_COLLECTION = "projects"

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/statistics')
def statistics():
    return render_template('statistics.html')


@app.route('/program')
def program():
    return render_template('program.html')


@app.route("/donorsUS/projects")
def donor_projects():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """

    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False, 'funding_status': True, 'school_state': True,
        'resource_type': True, 'poverty_level': True,
        'date_posted': True, 'total_donations': True,
        'school_city': True, 'primary_focus_area': True, 'grade_level': True
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGO_DB_URI) as conn:
        # Define which collection we wish to access
        collection = conn[MONGO_DB_NAME][MONGO_DB_COLLECTION]
        # Retrieve a result set only with the fields defined in FIELDS
        # and limit the the results to 55000
        projects = collection.find(projection=FIELDS, limit=1000)

        # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))


if __name__ == "__main__":
    app.run(debug=True)
