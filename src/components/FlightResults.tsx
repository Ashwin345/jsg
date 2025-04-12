import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FlightCard from "./FlightCard";
import { ArrowUpDown, Filter, Clock, Plane } from "lucide-react";

interface Airline {
  id: string;
  name: string;
  logo: string;
}

interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  departureTime: string;
  departureAirport: string;
  departureCity: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  duration: string;
  price: number;
  stops: number;
}

interface FlightResultsProps {
  flights?: Flight[];
  isLoading?: boolean;
  onSelectFlight?: (flight: Flight) => void;
}

const FlightResults: React.FC<FlightResultsProps> = ({
  flights = mockFlights,
  isLoading = false,
  onSelectFlight = () => {},
}) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price");
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>(flights);

  // Get unique airlines from flights
  const airlines = Array.from(
    new Set(flights.map((flight) => flight.airline.id)),
  ).map((id) => flights.find((flight) => flight.airline.id === id)?.airline);

  // Handle airline selection
  const handleAirlineChange = (airlineId: string) => {
    setSelectedAirlines((prev) => {
      if (prev.includes(airlineId)) {
        return prev.filter((id) => id !== airlineId);
      } else {
        return [...prev, airlineId];
      }
    });
  };

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...flights];

    // Filter by price range
    result = result.filter(
      (flight) =>
        flight.price >= priceRange[0] && flight.price <= priceRange[1],
    );

    // Filter by selected airlines
    if (selectedAirlines.length > 0) {
      result = result.filter((flight) =>
        selectedAirlines.includes(flight.airline.id),
      );
    }

    // Sort flights
    if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "duration") {
      // This is a simplified sort - in a real app you'd convert duration to minutes
      result.sort((a, b) => a.duration.localeCompare(b.duration));
    } else if (sortBy === "departure") {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    setFilteredFlights(result);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedAirlines([]);
    setSortBy("price");
    setFilteredFlights(flights);
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <Card className="lg:w-1/4 h-fit sticky top-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-6">
              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    max={2000}
                    step={50}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Airlines Filter */}
              <div>
                <h4 className="font-medium mb-2">Airlines</h4>
                <div className="space-y-2">
                  {airlines.map(
                    (airline) =>
                      airline && (
                        <div
                          key={airline.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`airline-${airline.id}`}
                            checked={selectedAirlines.includes(airline.id)}
                            onCheckedChange={() =>
                              handleAirlineChange(airline.id)
                            }
                          />
                          <Label
                            htmlFor={`airline-${airline.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {airline.name}
                          </Label>
                        </div>
                      ),
                  )}
                </div>
              </div>

              <Separator />

              {/* Stops Filter */}
              <div>
                <h4 className="font-medium mb-2">Stops</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nonstop" />
                    <Label htmlFor="nonstop" className="text-sm cursor-pointer">
                      Non-stop
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="1stop" />
                    <Label htmlFor="1stop" className="text-sm cursor-pointer">
                      1 Stop
                    </Label>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={applyFilters}>
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flight Results */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">
                {filteredFlights.length}{" "}
                {filteredFlights.length === 1 ? "Flight" : "Flights"} Found
              </h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">
                  Sort by:
                </Label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded-md text-sm bg-background"
                >
                  <option value="price">Price (Lowest first)</option>
                  <option value="duration">Duration (Shortest first)</option>
                  <option value="departure">Departure (Earliest first)</option>
                </select>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Flights</TabsTrigger>
                <TabsTrigger value="nonstop">Non-stop</TabsTrigger>
                <TabsTrigger value="best">Best Value</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredFlights.length > 0 ? (
                  filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={() => onSelectFlight(flight)}
                    />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Plane className="h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No flights found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters to see more results
                      </p>
                    </div>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="nonstop" className="space-y-4">
                {filteredFlights
                  .filter((flight) => flight.stops === 0)
                  .map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={() => onSelectFlight(flight)}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="best" className="space-y-4">
                {filteredFlights
                  .slice(0, 3) // Just showing top 3 as "best value" for demo
                  .map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={() => onSelectFlight(flight)}
                    />
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for development
const mockFlights: Flight[] = [
  {
    id: "1",
    airline: {
      id: "delta",
      name: "Delta Airlines",
      logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80",
    },
    flightNumber: "DL1234",
    departureTime: "08:30",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "11:45",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "5h 15m",
    price: 349,
    stops: 0,
  },
  {
    id: "2",
    airline: {
      id: "united",
      name: "United Airlines",
      logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80",
    },
    flightNumber: "UA789",
    departureTime: "10:15",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "14:30",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "6h 15m",
    price: 289,
    stops: 1,
  },
  {
    id: "3",
    airline: {
      id: "american",
      name: "American Airlines",
      logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80",
    },
    flightNumber: "AA456",
    departureTime: "14:20",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "17:40",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "5h 20m",
    price: 399,
    stops: 0,
  },
  {
    id: "4",
    airline: {
      id: "jetblue",
      name: "JetBlue",
      logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80",
    },
    flightNumber: "B6789",
    departureTime: "16:45",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "20:15",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "5h 30m",
    price: 329,
    stops: 0,
  },
  {
    id: "5",
    airline: {
      id: "southwest",
      name: "Southwest",
      logo: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80",
    },
    flightNumber: "WN123",
    departureTime: "07:00",
    departureAirport: "JFK",
    departureCity: "New York",
    arrivalTime: "12:30",
    arrivalAirport: "LAX",
    arrivalCity: "Los Angeles",
    duration: "7h 30m",
    price: 259,
    stops: 1,
  },
];

export default FlightResults;
