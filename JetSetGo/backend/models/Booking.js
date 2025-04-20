import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    flightDetails: {
      airline: String,
      flightNumber: String,
      departureCity: String,
      departureAirport: String,
      departureTime: String,
      departureDate: String,
      arrivalCity: String,
      arrivalAirport: String,
      arrivalTime: String,
      arrivalDate: String,
      duration: String,
    },
    passengers: {
      type: Number,
      required: true,
      default: 1,
    },
    travelClass: {
      type: String,
      enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
      default: "ECONOMY",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    paymentMethod: {
      type: String,
      default: "Credit Card",
    },
    bookingReference: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

// Generate a random booking reference before saving
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    // Generate a random alphanumeric booking reference
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let reference = "";
    for (let i = 0; i < 6; i++) {
      reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.bookingReference = reference;
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
