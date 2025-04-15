import React from "react";
import { motion } from "framer-motion";
import { Search, Plane, User, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import FlightSearch from "./FlightSearch";
import { useAppContext } from "./AppContext";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { setSearchCriteria } = useAppContext();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-600">JetSetGO</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Flights
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Bookings
          </a>
          <a
            href="/feedback"
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              navigate("/feedback");
            }}
          >
            Feedback
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          {!useAuth().isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
                onClick={() => navigate("/auth")}
              >
                <User size={16} />
                Sign In
              </Button>
              <Button
                className="hidden md:inline-flex"
                onClick={() => navigate("/auth?tab=register")}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2"
                onClick={() => navigate("/dashboard")}
              >
                <User size={16} />
                My Account
              </Button>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={() => {
                  useAuth().logout();
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Your Perfect Flight
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Search and compare flights from hundreds of airlines and travel
            agencies to find the best deals.
          </motion.p>
        </div>

        {/* Flight Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <FlightSearch
            onSearch={(searchData) => {
              setSearchCriteria(searchData);
              navigate("/search");
            }}
          />
        </motion.div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((destination, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin size={14} className="mr-1" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-lg font-bold text-blue-600">
                      ${destination.price}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Search size={14} />
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Why Choose JetSetGO
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-lg shadow-sm"
            >
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">JetSetGO</h2>
              </div>
              <p className="text-gray-400">
                Find the perfect flight for your next adventure.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">
                Get the latest deals and updates.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-900"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} JetSetGO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Sample data for popular destinations
const popularDestinations = [
  {
    name: "New York",
    country: "United States",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  },
  {
    name: "Paris",
    country: "France",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  },
  {
    name: "Tokyo",
    country: "Japan",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  },
  {
    name: "Bali",
    country: "Indonesia",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  },
  {
    name: "London",
    country: "United Kingdom",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  },
  {
    name: "Sydney",
    country: "Australia",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
  },
];

// Sample data for features
const features = [
  {
    title: "Best Price Guarantee",
    description:
      "We compare prices from hundreds of travel sites to ensure you get the best deal.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-tag"
      >
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
  },
  {
    title: "No Hidden Fees",
    description:
      "We show all fees upfront so you know exactly what you're paying for.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-check-circle"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
      </svg>
    ),
  },
  {
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available around the clock to assist you.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-headphones"
      >
        <path d="M3 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
        <path d="M17 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
        <path d="M1 12a11 11 0 0 1 22 0" />
        <path d="M14 14a2 2 0 0 1-4 0" />
      </svg>
    ),
  },
];

export default Home;
