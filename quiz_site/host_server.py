"""Simple webserver to not mess up loading local files in JS"""

# Imports
from flask import Flask
from flask import send_from_directory

app = Flask(__name__)

# Serve index in case the developer is lazy
@app.route("/")
def serve_index():
    return send_from_directory(".","index.html")

# Send a file
@app.route("/<path:path>")
def serve_file(path):
    return send_from_directory(".",path)