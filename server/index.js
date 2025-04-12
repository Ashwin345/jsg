import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Amadeus API credentials
const AMADEUS_API_KEY = "1gectTr9XpwxLoOg7DAlABXWNGmEX0eE";
const AMADEUS_API_SECRET = "GVG68HXArVO7qAiZ";
const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

// Token storage
let amadeusToken = null;
let tokenExpiry = 0;

// Get Amadeus token
async function getAmadeusToken() {
  // Check if token exists and is not expired
  if (amadeusToken && tokenExpiry > Date.now()) {
    return amadeusToken;
  }

  try {
    const response = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    amadeusToken = response.data.access_token;
    // Set expiry time (subtract 60 seconds to be safe)
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return amadeusToken;
  } catch (error) {
    console.error(
      "Error getting Amadeus token:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Search flights
app.post("/api/flights/search", async (req, res) => {
  try {
    const token = await getAmadeusToken();
    const params = req.body;

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers`,
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error searching flights:",
      error.response?.data || error.message,
    );
    res.status(error.response?.status || 500).json({
      error: error.response?.data || { message: error.message },
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
