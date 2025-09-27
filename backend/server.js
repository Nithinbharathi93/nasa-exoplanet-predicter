// server.js
import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// Feature columns (same as training order)
const featureColumns = [
  "orb_period", "planet_radius", "planet_mass", "pl_eqt", "st_teff",
  "st_rad", "st_mass", "sy_dist", "transit_depth", "transit_duration",
  "planet_density", "star_density", "flux_received"
];

app.get("/", (req, res) => {
  res.send("Exoplanet Habitability Prediction API");
});

// Predict endpoint
app.post("/predict", (req, res) => {
  try {
    const inputData = req.body;

    // Perform same feature engineering as Python
    const planet_density = inputData.planet_mass / Math.pow(inputData.planet_radius || 1, 3) + 1e-6;
    const star_density = inputData.st_mass / Math.pow(inputData.st_rad || 1, 3) + 1e-6;
    const flux_received = inputData.st_teff * Math.pow(
      (inputData.st_rad / Math.sqrt(inputData.sy_dist + 1e-6)), 2
    );

    // Construct data row in correct order
    const dataRow = {
      ...inputData,
      planet_density,
      star_density,
      flux_received
    };

    const orderedRow = featureColumns.map(col => dataRow[col]);

    // Call Python script for prediction
    const py = spawn("python", ["predict.py", JSON.stringify(orderedRow)]);

    let result = "";
    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (err) => {
      console.error("Python Error:", err.toString());
    });

    py.on("close", () => {
      try {
        const prediction = JSON.parse(result);
        res.json({ prediction });
      } catch (e) {
        res.status(500).json({ error: "Prediction parsing failed", details: e.message });
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Prediction failed", details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
