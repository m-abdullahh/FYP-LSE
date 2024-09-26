from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from ml_models import load_models

def create_app():
    app = Flask(__name__)
    app.config["API_TITLE"] = "Stores REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    # Enable CORS
    CORS(app, resources={r"/search/*": {"origins": "http://localhost:5173"}})

    # Load models before the first request
    with app.app_context():
        load_models()

    api = Api(app)
    from resources.search import blp as search_blp

    api.register_blueprint(search_blp)

    return app
