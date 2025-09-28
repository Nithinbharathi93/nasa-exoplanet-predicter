import { useState } from "react";

export default function ExoplanetForm() {
  const [formData, setFormData] = useState({
    orb_period: "",
    planet_radius: "",
    planet_mass: "",
    pl_eqt: "",
    st_teff: "",
    st_rad: "",
    st_mass: "",
    sy_dist: "",
    transit_depth: "",
    transit_duration: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
        // Convert string values to numbers
        const numericData = {};
        Object.keys(formData).forEach((key) => {
        numericData[key] = parseFloat(formData[key]);
        });

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(numericData),
        });

        if (!response.ok) {
        throw new Error("Failed to fetch result from server");
        }

        const data = await response.json();
        setResult(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

  // Friendly labels + placeholders
  const fields = [
    { name: "orb_period", label: "Orbital Period (days)", placeholder: "0.5 – 5000" },
    { name: "planet_radius", label: "Planet Radius (Earth radii)", placeholder: "0.5 – 20" },
    { name: "planet_mass", label: "Planet Mass (Earth masses)", placeholder: "0.1 – 5000" },
    { name: "pl_eqt", label: "Equilibrium Temperature (K)", placeholder: "50 – 3000" },
    { name: "st_teff", label: "Star Effective Temperature (K)", placeholder: "2500 – 10000" },
    { name: "st_rad", label: "Star Radius (Solar radii)", placeholder: "0.1 – 10" },
    { name: "st_mass", label: "Star Mass (Solar masses)", placeholder: "0.1 – 50" },
    { name: "sy_dist", label: "System Distance (parsecs)", placeholder: "1 – 10000" },
    { name: "transit_depth", label: "Transit Depth (0–1)", placeholder: "0.00001 – 0.1" },
    { name: "transit_duration", label: "Transit Duration (hours)", placeholder: "0.1 – 100" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Exoplanet Prediction
        </h1>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {fields.map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                step="any"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          ))}

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Submitting..." : "Submit Data"}
            </button>
          </div>
        </form>

        {/* Output Section */}
        <div className="mt-6 text-center">
          {error && <p className="text-red-600 font-medium">Error: {error}</p>}
          {result && (
            <div className="p-4 bg-green-100 rounded-lg">
              <h2 className="text-lg font-semibold text-green-700">Prediction Result</h2>
              <p className="text-xl font-bold mt-2 text-gray-900">{result.prediction}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
