# predict.py
import sys, json, joblib
import numpy as np
import pandas as pd

import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

# Load model and encoder once
model = joblib.load("../models/exoplanet_model.pkl")
label_encoder = joblib.load("../models/label_encoder.pkl")

# Feature order (must match training)
feature_columns = [
    "orb_period", "planet_radius", "planet_mass", "pl_eqt", "st_teff",
    "st_rad", "st_mass", "sy_dist", "transit_depth", "transit_duration",
    "planet_density", "star_density", "flux_received"
]

def main():
    raw = sys.argv[1]
    features = json.loads(raw)

    df = pd.DataFrame([features], columns=feature_columns)
    pred_encoded = model.predict(df)
    pred_label = label_encoder.inverse_transform(pred_encoded)

    print(json.dumps(pred_label[0]))

if __name__ == "__main__":
    main()
