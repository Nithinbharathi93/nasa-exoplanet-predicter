# NASA Exoplanet Predictor

A full-stack application that predicts the likelihood of exoplanet candidates being confirmed exoplanets using machine learning. The application uses a trained model to analyze various astronomical parameters and classify potential exoplanets.

## Live Demo

- Frontend: [https://nasa-exoplanet-predicter.vercel.app/](https://nasa-exoplanet-predicter.vercel.app/)
- Backend API: [https://nasa-exoplanet-predictor.onrender.com/](https://nasa-exoplanet-predictor.onrender.com/)

## Project Structure

```
├── frontend/           # React + Vite frontend application
├── backend/           # Node.js + Express backend server
└── models/           # Trained machine learning models
```

## Features

- Interactive form for inputting astronomical data
- Real-time predictions using machine learning
- Dynamic status updates and protocol tracking
- Responsive design with modern UI elements
- Cross-Origin Resource Sharing (CORS) enabled API

## Technologies Used

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Environment variable configuration
- React Spinners for loading states
- Modern ES6+ JavaScript

### Backend
- Node.js with Express
- Python for machine learning integration
- Scikit-learn for model predictions
- Pandas for data processing
- Joblib for model loading

## Key Components

### Frontend
- `ExoplanetForm`: Main component for data input and prediction display
- `RandomCoords`: Component for coordinate visualization
- Environment configuration with `.env` support
- Error handling and loading states

### Backend
- RESTful API endpoint for predictions
- Python-Node.js integration using child processes
- Model loading and prediction processing
- Error handling and validation
- Feature engineering for accurate predictions

## Machine Learning Model
The application uses a calibrated machine learning model to predict exoplanet classifications:
- Input features include orbital period, planet radius, mass, temperature, and stellar properties
- Predicts classifications: CONFIRMED, CANDIDATE, or FALSE POSITIVE
- Includes feature engineering for density and flux calculations

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   VITE_BACKEND_URL=http://localhost:3000
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or your configured Vite port).

## API Endpoints

### POST /predict
Accepts astronomical data and returns exoplanet predictions:
- Endpoint: `https://nasa-exoplanet-predictor.onrender.com/predict`
- Method: `POST`
- Content-Type: `application/json`

#### Sample Request Body
```json
{
    "orb_period": 1.9,
    "planet_radius": 65.0,
    "planet_mass": 250000.0,
    "pl_eqt": 2800,
    "st_teff": 7500,
    "st_rad": 1.5,
    "st_mass": 1.4,
    "sy_dist": 600,
    "transit_depth": 210000.0,
    "transit_duration": 4.8
}
```

#### Parameters Description
- `orb_period`: Orbital period in days
- `planet_radius`: Planet radius in Earth radii
- `planet_mass`: Planet mass in Earth masses
- `pl_eqt`: Planet equilibrium temperature in Kelvin
- `st_teff`: Star effective temperature in Kelvin
- `st_rad`: Star radius in Solar radii
- `st_mass`: Star mass in Solar masses
- `sy_dist`: System distance in parsecs
- `transit_depth`: Transit depth in parts per million (ppm)
- `transit_duration`: Transit duration in hours

#### Response Format
- Success: Returns prediction classification (CONFIRMED, CANDIDATE, or FALSE POSITIVE)
- Error: Returns error message with details if request is invalid

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request