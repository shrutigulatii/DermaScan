const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors({
  origin: ["http://localhost:5173","https://derma-scan-nine.vercel.app/"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());


app.post("/api/advice", (req, res) => {
  res.json({ advice: "Healthy skin begins with daily habits. Start by drinking at least 8 glasses of water a day to keep your skin hydrated from within. Always apply a broad-spectrum sunscreen with SPF 30 or higher, even on cloudy days or indoors, as UV rays can still cause damage. At night, gently cleanse your face to remove dirt and oils, and use a moisturizer suited to your skin type. Avoid touching your face frequently, get enough sleep, and follow a balanced diet rich in antioxidants and vitamins. These simple steps go a long way in keeping your skin clear, youthful, and protected. 💧☀️" });
});


const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
