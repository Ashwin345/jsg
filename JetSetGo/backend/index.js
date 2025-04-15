import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Amadeus API credentials
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

// Token storage
let amadeusToken = null;
let tokenExpiration = null;

// Get Amadeus access token
async function getAmadeusToken() {
  // Check if token is still valid
  if (amadeusToken && tokenExpiration && new Date() < tokenExpiration) {
    return amadeusToken;
  }

  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    amadeusToken = response.data.access_token;
    // Set expiration time (subtract 5 minutes to be safe)
    const expiresIn = (response.data.expires_in - 300) * 1000;
    tokenExpiration = new Date(Date.now() + expiresIn);

    return amadeusToken;
  } catch (error) {
    console.error(
      "Error getting Amadeus token:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to authenticate with Amadeus API");
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "JetSetGO API is running" });
});

// Flight search endpoint
app.post("/api/flights/search", async (req, res) => {
  try {
    const token = await getAmadeusToken();

    // Extract search parameters from request body
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass,
      nonStop,
      currencyCode,
      maxPrice,
    } = req.body;

    // Build query parameters
    const params = new URLSearchParams();
    params.append("originLocationCode", originLocationCode);
    params.append("destinationLocationCode", destinationLocationCode);
    params.append("departureDate", departureDate);
    if (returnDate) params.append("returnDate", returnDate);
    params.append("adults", adults || 1);
    if (children) params.append("children", children);
    if (infants) params.append("infants", infants);
    if (travelClass) params.append("travelClass", travelClass);
    if (nonStop !== undefined) params.append("nonStop", nonStop);
    if (currencyCode) params.append("currencyCode", currencyCode);
    if (maxPrice) params.append("maxPrice", maxPrice);

    // Make request to Amadeus API
    const response = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${params.toString()}`,
      {
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
      error: "Failed to search flights",
      details: error.response?.data || error.message,
    });
  }
});

// User routes (mock implementation)
app.post("/api/auth/register", (req, res) => {
  // Mock registration - in a real app, you would save to a database
  const { name, email, password } = req.body;
  res.json({
    user: {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
    },
    token: `mock_token_${Math.random().toString(36).substring(2, 9)}`,
  });
});

app.post("/api/auth/login", (req, res) => {
  // Mock login - in a real app, you would verify credentials
  const { email } = req.body;
  res.json({
    user: {
      id: `user_${Math.random().toString(36).substring(2, 9)}`,
      name: email.split("@")[0],
      email,
    },
    token: `mock_token_${Math.random().toString(36).substring(2, 9)}`,
  });
});

// Feedback endpoint
app.post("/api/feedback", (req, res) => {
  // Mock feedback submission - in a real app, you would save to a database
  console.log("Received feedback:", req.body);
  res.json({
    success: true,
    message: "Thank you for your feedback!",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`JetSetGO API server running on port ${PORT}`);
  console.log(`Amadeus API Key: ${AMADEUS_API_KEY ? "Configured" : "Missing"}`);
});
