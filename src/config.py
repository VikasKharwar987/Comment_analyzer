import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "v1")
DEVICE="cuda"
MAX_LENGTH = 128
THRESHOLD = 0.4