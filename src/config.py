import yaml
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

config_path = os.path.join(BASE_DIR, "config.yaml")

with open(config_path) as f:
    config = yaml.safe_load(f)

MODEL_PATH =config["model"]["path"]
THRESHOLD = config["model"]["threshold"]
DEVICE="cuda"
MAX_LENGTH = 128