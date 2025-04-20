import React, { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Users, Plane } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { amadeusService, type SearchParams } from "@/services/amadeus";
import { useAppContext } from "./AppContext";

interface FlightSearchProps {
  onSearch?: (searchData: {
    tripType: string;
    origin: string;
    destination: string;
    dates: DateRange | undefined;
    passengers: number;
    travelClass: string;
  }) => void;
  isLoading?: boolean;
}

const FlightSearch = ({
  onSearch = () => {},
  isLoading: propIsLoading,
}: FlightSearchProps) => {
  const { isLoading, setIsLoading, setSearchCriteria, selectedDestination } =
    useAppContext();
  const [tripType, setTripType] = useState("round-trip");
  const [origin, setOrigin] = useState("ICN"); // Default to Seoul (Korean Air hub)
  const [destination, setDestination] = useState(
    selectedDestination?.code || "LAX",
  );
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: tripType === "one-way" ? undefined : addDays(new Date(), 8),
  });

  // Update date range when trip type changes
  useEffect(() => {
    if (tripType === "one-way" && date?.to) {
      setDate({ from: date.from, to: undefined });
    } else if (tripType === "round-trip" && !date?.to && date?.from) {
      setDate({ from: date.from, to: addDays(date.from, 7) });
    }
  }, [tripType, date]);

  // Update destination when selectedDestination changes
  useEffect(() => {
    if (selectedDestination?.code) {
      setDestination(selectedDestination.code);
    }
  }, [selectedDestination]);
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("ECONOMY");

  // Common airport codes for Korean Air routes
  const popularDestinations = [
    { code: "ICN", name: "Seoul (Incheon)" },
    { code: "GMP", name: "Seoul (Gimpo)" },
    { code: "LAX", name: "Los Angeles" },
    { code: "JFK", name: "New York" },
    { code: "NRT", name: "Tokyo" },
    { code: "LHR", name: "London" },
    { code: "CDG", name: "Paris" },
    { code: "SYD", name: "Sydney" },
    { code: "HKG", name: "Hong Kong" },
    { code: "BKK", name: "Bangkok" },
  ];

  const handleSearch = async () => {
    if (!origin || !destination || !date?.from) {
      // Show error or validation message
      return;
    }

    // For round-trip, ensure we have a return date
    if (tripType === "round-trip" && !date.to) {
      // Show error or validation message
      return;
    }

    const searchData = {
      tripType,
      origin,
      destination,
      dates: date,
      passengers,
      travelClass,
    };

    // Store search criteria in context
    setSearchCriteria(searchData);

    // Call the onSearch prop (for storyboard/demo purposes)
    onSearch(searchData);

    // In a real implementation, we would call the API here
    // and update the search results in context
  };

  // Auto-trigger search if coming from a destination selection
  useEffect(() => {
    if (selectedDestination && destination === selectedDestination.code) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        handleSearch();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [selectedDestination, destination]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Plane className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-bold text-blue-600">
            JetSetGO Flight Search
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Best Prices</span>
          <span>•</span>
          <span>Global Flights</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <RadioGroup
              defaultValue="round-trip"
              value={tripType}
              onValueChange={setTripType}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="round-trip"
                  id="round-trip"
                  className="text-blue-600"
                />
                <Label htmlFor="round-trip" className="font-medium">
                  Round Trip
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="one-way"
                  id="one-way"
                  className="text-blue-600"
                />
                <Label htmlFor="one-way" className="font-medium">
                  One Way
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <Label htmlFor="passengers" className="font-medium">
                Passengers:
              </Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                max="10"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                className="w-16 border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="p-2 border rounded-md text-sm bg-background border-blue-600 focus:ring-blue-600"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Prestige (Business)</option>
                <option value="FIRST">First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <Label
              htmlFor="origin"
              className="font-medium text-blue-600 flex items-center"
            >
              <MapPin className="h-4 w-4 mr-1 text-blue-600" />
              From
            </Label>
            <div className="relative">
              <select
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-2 border rounded-md bg-white border-blue-200 focus:ring-blue-600 focus:border-blue-400"
              >
                {popularDestinations.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <Label
              htmlFor="destination"
              className="font-medium text-blue-600 flex items-center"
            >
              <MapPin className="h-4 w-4 mr-1 text-blue-600" />
              To
            </Label>
            <div className="relative">
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-2 border rounded-md bg-white border-blue-200 focus:ring-blue-600 focus:border-blue-400"
              >
                {popularDestinations.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-blue-600">Dates</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-blue-600 focus:ring-blue-600"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                {date?.from ? (
                  tripType === "one-way" ? (
                    format(date.from, "MMM dd, yyyy")
                  ) : date.to ? (
                    <>
                      {format(date.from, "MMM dd, yyyy")} -{" "}
                      {format(date.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(date.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>
                    {tripType === "one-way"
                      ? "Select date"
                      : "Select date range"}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode={tripType === "one-way" ? "single" : "range"}
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-colors font-medium text-lg"
          onClick={handleSearch}
          disabled={isLoading || propIsLoading}
        >
          {isLoading || propIsLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            "Search Flights"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FlightSearch;
