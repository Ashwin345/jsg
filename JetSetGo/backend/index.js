import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Import models
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import Content from "./models/Content.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/jetsetgo";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token." });
  }
};

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

// User Authentication Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

// Booking Routes
app.post("/api/bookings", authenticateToken, async (req, res) => {
  try {
    const { flightDetails, passengers, travelClass, price } = req.body;

    const booking = new Booking({
      userId: req.user.id,
      flightDetails,
      passengers,
      travelClass,
      price,
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ error: "Failed to create booking", details: error.message });
  }
});

app.get("/api/bookings/user", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch bookings", details: error.message });
  }
});

app.get("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the booking belongs to the authenticated user
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch booking", details: error.message });
  }
});

app.put("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the booking belongs to the authenticated user
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update only allowed fields
    if (req.body.status) booking.status = req.body.status;

    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ error: "Failed to update booking", details: error.message });
  }
});

app.delete("/api/bookings/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the booking belongs to the authenticated user
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ error: "Failed to delete booking", details: error.message });
  }
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

// CMS Middleware - Check if user is admin or editor
const checkContentPermission = async (req, res, next) => {
  try {
    // First authenticate the user
    authenticateToken(req, res, async () => {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has admin or editor role
      if (user.role !== "admin" && user.role !== "editor") {
        return res
          .status(403)
          .json({ error: "Access denied. Insufficient permissions." });
      }

      next();
    });
  } catch (error) {
    console.error("Permission check error:", error);
    res
      .status(500)
      .json({ error: "Permission check failed", details: error.message });
  }
};

// CMS Content Routes
// Get all content (public)
app.get("/api/cms/content", async (req, res) => {
  try {
    const { contentType, status, limit = 10, page = 1 } = req.query;
    const query = {};

    // Filter by content type if provided
    if (contentType) {
      query.contentType = contentType;
    }

    // For public access, only show published content
    query.status = "published";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const content = await Content.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(query);

    res.json({
      content,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch content", details: error.message });
  }
});

// Get single content by slug (public)
app.get("/api/cms/content/:slug", async (req, res) => {
  try {
    const content = await Content.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch content", details: error.message });
  }
});

// Admin routes - Create content
app.post("/api/cms/admin/content", checkContentPermission, async (req, res) => {
  try {
    const {
      title,
      content: contentBody,
      contentType,
      status,
      slug,
      featuredImage,
      metaTitle,
      metaDescription,
    } = req.body;

    // Create slug from title if not provided
    const contentSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

    // Check if slug already exists
    const existingContent = await Content.findOne({ slug: contentSlug });
    if (existingContent) {
      return res
        .status(400)
        .json({ error: "Content with this slug already exists" });
    }

    const newContent = new Content({
      title,
      slug: contentSlug,
      content: contentBody,
      contentType,
      status: status || "draft",
      createdBy: req.user.id,
      updatedBy: req.user.id,
      featuredImage,
      metaTitle,
      metaDescription,
    });

    await newContent.save();

    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error creating content:", error);
    res
      .status(500)
      .json({ error: "Failed to create content", details: error.message });
  }
});

// Admin routes - Update content
app.put(
  "/api/cms/admin/content/:id",
  checkContentPermission,
  async (req, res) => {
    try {
      const {
        title,
        content: contentBody,
        contentType,
        status,
        slug,
        featuredImage,
        metaTitle,
        metaDescription,
      } = req.body;

      const content = await Content.findById(req.params.id);

      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      // If slug is being changed, check if new slug already exists
      if (slug && slug !== content.slug) {
        const existingContent = await Content.findOne({
          slug,
          _id: { $ne: req.params.id },
        });
        if (existingContent) {
          return res
            .status(400)
            .json({ error: "Content with this slug already exists" });
        }
      }

      // Update fields
      if (title) content.title = title;
      if (slug) content.slug = slug;
      if (contentBody) content.content = contentBody;
      if (contentType) content.contentType = contentType;
      if (status) content.status = status;
      if (featuredImage) content.featuredImage = featuredImage;
      if (metaTitle) content.metaTitle = metaTitle;
      if (metaDescription) content.metaDescription = metaDescription;

      content.updatedBy = req.user.id;

      await content.save();

      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res
        .status(500)
        .json({ error: "Failed to update content", details: error.message });
    }
  },
);

// Admin routes - Delete content
app.delete(
  "/api/cms/admin/content/:id",
  checkContentPermission,
  async (req, res) => {
    try {
      const content = await Content.findById(req.params.id);

      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      await Content.findByIdAndDelete(req.params.id);

      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res
        .status(500)
        .json({ error: "Failed to delete content", details: error.message });
    }
  },
);

// Admin routes - Get all content (including drafts)
app.get("/api/cms/admin/content", checkContentPermission, async (req, res) => {
  try {
    const { contentType, status, limit = 10, page = 1 } = req.query;
    const query = {};

    // Filter by content type if provided
    if (contentType) {
      query.contentType = contentType;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const content = await Content.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(query);

    res.json({
      content,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch content", details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`JetSetGO API server running on port ${PORT}`);
  console.log(`Amadeus API Key: ${AMADEUS_API_KEY ? "Configured" : "Missing"}`);
  console.log(`MongoDB URI: ${MONGODB_URI ? "Configured" : "Missing"}`);
});
