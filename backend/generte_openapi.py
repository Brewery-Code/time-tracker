from fastapi.openapi.utils import get_openapi
from src.main import app
import yaml

openapi_schema = get_openapi(
    title=app.title,
    version=app.version,
    routes=app.routes
)

with open("openapi.yml", "w") as f:
    yaml.dump(openapi_schema, f, sort_keys=False)
