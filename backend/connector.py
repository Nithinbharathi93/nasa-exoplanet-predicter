import sys
import json
import joblib
import pandas as pd
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings("ignore")

def predict(data):
    """
    Loads the model and label encoder, makes a prediction, and returns it.
    """
    try:
        # Load the pre-trained model and label encoder
        # Ensure these paths are correct relative to where you run the script
        model = joblib.load("./exoplanet_model_calibrated.pkl")
        le = joblib.load("./label_encoder.pkl")
    except FileNotFoundError:
        return {"error": "Model or encoder file not found. Ensure training script has been run."}

    # The model expects a DataFrame with specific column names
    # The input 'data' is a dictionary from the JSON input
    input_df = pd.DataFrame([data])
    
    # --- Feature Engineering (must match the training script) ---
    # Re-create the derived features that the model was trained on.
    # Use .get() for safety in case a key is missing, providing a default value.
    input_df["planet_density"] = input_df.get("planet_mass", 0) / (input_df.get("planet_radius", 1)**3 + 1e-6)
    input_df["star_density"] = input_df.get("st_mass", 0) / (input_df.get("st_rad", 1)**3 + 1e-6)
    input_df["flux_received"] = input_df.get("st_teff", 0) * (input_df.get("st_rad", 1) / ((input_df.get("sy_dist", 1) + 1e-6)**0.5))**2

    # Ensure all required features are present, fill missing with 0 or another default
    required_features = [
        "orb_period", "planet_radius", "planet_mass", "pl_eqt", "st_teff", 
        "st_rad", "st_mass", "sy_dist", "transit_depth", "transit_duration",
        "planet_density", "star_density", "flux_received"
    ]
    for col in required_features:
        if col not in input_df.columns:
            input_df[col] = 0
            
    # Keep only the columns the model was trained on, in the correct order
    final_features = input_df[required_features]

    # Make prediction and get probabilities
    prediction_encoded = model.predict(final_features)
    probabilities = model.predict_proba(final_features)

    # Decode the prediction to the original label (e.g., 'CONFIRMED')
    prediction_label = le.inverse_transform(prediction_encoded)[0]
    
    # Create a dictionary of class probabilities
    class_probabilities = dict(zip(le.classes_, probabilities[0]))

    # Format the result
    result = {
        "prediction": prediction_label,
        # "probabilities": class_probabilities
    }
    
    return result

if __name__ == "__main__":
    # The first command-line argument (sys.argv[1]) is the JSON string
    input_data = json.loads(sys.argv[1])
    
    # Get the prediction
    prediction_result = predict(input_data)
    
    # Print the result as a JSON string to standard output
    print(json.dumps(prediction_result))