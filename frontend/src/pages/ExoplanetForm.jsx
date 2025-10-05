import { useState } from "react";
import { PuffLoader } from "react-spinners";
import RandomCoords from "../components/RandomCords";

const Corner = ({ position }) => {
  const baseClasses = "absolute w-8 h-8 border-emerald-500";
  const positionClasses = {
    "top-left": "top-0 left-0 border-t-2 border-l-2",
    "top-right": "top-0 right-0 border-t-2 border-r-2",
    "bottom-left": "bottom-0 left-0 border-b-2 border-l-2",
    "bottom-right": "bottom-0 right-0 border-b-2 border-r-2",
  };
  return <div className={`${baseClasses} ${positionClasses[position]}`}></div>;
};

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

  // Optional: simulate network delay for loading effect
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // Convert form values to numbers
    const numericData = {};
    Object.keys(formData).forEach((key) => {
      const value = parseFloat(formData[key]);
      if (!isNaN(value)) numericData[key] = value;
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(numericData),
    });

    if (!response.ok) {
      throw new Error("SYSTEM COMMS FAILED :: UNABLE TO FETCH PREDICTION");
    }

    const data = await response.json();

    // ✅ Extract only the prediction string safely
    if (data && typeof data.prediction === "string") {
      setResult(data);
    } else {
      throw new Error("INVALID RESPONSE FORMAT FROM SERVER");
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const fields = [
    { name: "orb_period", label: "ORBITAL PERIOD (DAYS)" },
    { name: "planet_radius", label: "PLANET RADIUS (REARTH)" },
    { name: "planet_mass", label: "PLANET MASS (MEARTH)" },
    { name: "pl_eqt", label: "EQUILIBRIUM TEMP (K)" },
    { name: "st_teff", label: "STAR EFFECTIVE TEMP (K)" },
    { name: "st_rad", label: "STAR RADIUS (RSUN)" },
    { name: "st_mass", label: "STAR MASS (MSUN)" },
    { name: "sy_dist", label: "SYSTEM DISTANCE (PC)" },
    { name: "transit_depth", label: "TRANSIT DEPTH (PPM)" }, // ✅ Updated label
    { name: "transit_duration", label: "TRANSIT DURATION (HRS)" },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48">
            <PuffLoader color="#34d399" loading size={180} speedMultiplier={2} />
          </div>
          <h2 className="text-2xl mt-8 tracking-widest text-glow">
            TRAVEL ARRANGEMENTS IN PROGRESS
          </h2>
          <p className="text-emerald-500 mt-2">SYSTEM STATUS: CHECKING...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 border-2 border-red-500/50 bg-red-500/10">
          <h2 className="text-2xl text-red-400 text-glow tracking-widest">
            TRANSMISSION ERROR
          </h2>
          <p className="text-red-400 mt-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-6 bg-transparent border-2 border-red-400 px-6 py-2 hover:bg-red-400 hover:text-black transition-all duration-300"
          >
            RETRY
          </button>
        </div>
      );
    }

    if (result) {
      return (
        <div
  className={`text-center p-8 border-2 transition-all duration-700 ${
    result.prediction === "FALSE POSITIVE"
      ? "border-red-500 bg-red-500/10 animate-pulse-glow"
      : result === "CANDIDATE"
      ? "border-amber-500 bg-amber-500/10"
      : "border-emerald-500/50 bg-emerald-500/10"
  }`}
>
  <h2
    className={`text-2xl tracking-widest text-glow ${
      result.prediction === "FALSE POSITIVE"
        ? "text-red-400"
        : result.prediction === "CANDIDATE"
        ? "text-amber-400"
        : "text-emerald-400"
    }`}
  >
    PREDICTION RECEIVED
  </h2>

  <p
    className={`text-4xl font-bold mt-4 ${
      result.prediction === "FALSE POSITIVE"
        ? "text-red-400"
        : result.prediction === "CANDIDATE"
        ? "text-amber-400"
        : "text-white"
    }`}
  >
    {result.prediction}
  </p>

  <button
    onClick={() => setResult(null)}
    className={`mt-6 px-6 py-2 border-2 transition-all duration-300 ${
      result.prediction === "FALSE POSITIVE"
        ? "border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
        : result.prediction === "CANDIDATE"
        ? "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black"
        : "border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black"
    }`}
  >
    NEW CALCULATION
  </button>
</div>

      );
    }

    return (
      <div className="flex flex-col w-full">
        <div className="flex-1 flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-center text-glow tracking-widest">
            {"EXOPLANET HABITABILITY".split("").map((char, index) => (
              <span
                key={index}
                className={
                  Math.random() < 0.3 ? "flicker-random" : ""
                }
              >
                {char}
              </span>
            ))}
             <br />
            {"PREDICTION".split("").map((char, index) => (
              <span
                key={index}
                className={
                  Math.random() < 0.3 ? "flicker-random" : ""
                }
              >
                {char}
              </span>
            ))}
          </h1>

        </div>
        <div className="flex-1">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm text-emerald-500 mb-1 tracking-wider">
                  {field.label}
                </label>
                <input
                  type="number"
                  step="any"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-black/30 border border-emerald-500/50 focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none no-spinners"
                />
              </div>
            ))}
            <div className="md:col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-transparent border-2 border-emerald-500 text-emerald-500 text-lg tracking-widest hover:bg-emerald-500 hover:text-black transition-all duration-300"
              >
                SUBMIT DATA
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-emerald-400 font-mono flex items-center justify-center p-4">
      <div className="relative border-2 border-emerald-500/30 w-full max-w-6xl h-auto p-4 md:p-8 backdrop-blur-sm bg-black/30">
        {/* Decorative Corners */}
        <Corner position="top-left" />
        <Corner position="top-right" />
        <Corner position="bottom-left" />
        <Corner position="bottom-right" />

        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-emerald-500/30 pb-2 mb-4 text-xs tracking-widest">
          <span>[CODE: 0.01 - INTRODUCTION]</span>
          <span>PROTOCOL: 023.041.200</span>
        </div>

        {/* Main Content */}
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            {renderContent()}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-emerald-500/30 pt-2 mt-4 text-xs tracking-widest flex justify-between">
           <span>STATUS: AWAITING INPUT</span>
           <RandomCoords />
        </div>
      </div>
    </div>
  );
}