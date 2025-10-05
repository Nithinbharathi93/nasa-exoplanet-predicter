import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies

// --- API Endpoint for Predictions ---
app.post('/predict', (req, res) => {
    // 1. Get the data from the request body
    const inputData = req.body;

    // Check if body is empty
    if (!inputData || Object.keys(inputData).length === 0) {
        return res.status(400).json({ error: 'Request body cannot be empty.' });
    }

    // 2. Convert the JSON data to a string to pass to the Python script
    const dataString = JSON.stringify(inputData);

    // 3. Spawn a child process to run the Python script
    // Use 'python3' or 'python' depending on your system setup
    const pythonProcess = spawn('python', ['connector.py', dataString]);

    let predictionResult = '';
    let errorData = '';

    // 4. Listen for data coming from the Python script's standard output
    pythonProcess.stdout.on('data', (data) => {
        predictionResult += data.toString();
    });

    // Listen for any errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    // 5. When the Python script finishes, send the result back
    pythonProcess.on('close', (code) => {
        if (code !== 0 || errorData) {
            console.error(`Python script exited with code ${code}`);
            console.error('Error details:', errorData);
            return res.status(500).json({ 
                error: 'Failed to get prediction from the model.',
                details: errorData 
            });
        }
        
        try {
            // Parse the JSON string from Python and send it as the response
            const finalResult = JSON.parse(predictionResult);
            res.status(200).json(finalResult);
        } catch (parseError) {
            console.error('Error parsing JSON from Python script:', parseError);
            res.status(500).json({ 
                error: 'Could not parse the prediction result.',
                raw_output: predictionResult 
            });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});