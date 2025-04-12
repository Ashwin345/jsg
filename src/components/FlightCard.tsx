import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowRight, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FlightCardProps {
  airline: string;
  flightNumber: string;
  departureTime: string;
  departureAirport: string;
  departureCity: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  duration: string;
  price: number;
  stops?: number;
  returnFlight?: {
    airline: string;
    flightNumber: string;
    departureTime: string;
    departureAirport: string;
    departureCity: string;
    arrivalTime: string;
    arrivalAirport: string;
    arrivalCity: string;
    duration: string;
    stops?: number;
  };
  onSelect?: () => void;
}

const FlightCard = ({
  airline = "American Airlines",
  flightNumber = "AA1234",
  departureTime = "08:00 AM",
  departureAirport = "JFK",
  departureCity = "New York",
  arrivalTime = "11:30 AM",
  arrivalAirport = "LAX",
  arrivalCity = "Los Angeles",
  duration = "3h 30m",
  price = 299.99,
  stops = 0,
  returnFlight,
  onSelect = () => console.log("Flight selected"),
}: FlightCardProps) => {
  return (
    <Card className="w-full mb-4 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Outbound Flight */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                <Plane className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{airline}</p>
                <p className="text-xs text-gray-500">{flightNumber}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-center">
                <p className="text-lg font-bold">{departureTime}</p>
                <p className="text-sm font-medium">{departureAirport}</p>
                <p className="text-xs text-gray-500">{departureCity}</p>
              </div>

              <div className="flex-1 px-4 flex flex-col items-center">
                <p className="text-xs text-gray-500 mb-1">{duration}</p>
                <div className="w-full flex items-center">
                  <div className="h-0.5 flex-1 bg-gray-300"></div>
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                  <div className="h-0.5 flex-1 bg-gray-300"></div>
                </div>
                {stops > 0 && (
                  <Badge variant="outline" className="mt-1">
                    {stops} {stops === 1 ? "stop" : "stops"}
                  </Badge>
                )}
              </div>

              <div className="text-center">
                <p className="text-lg font-bold">{arrivalTime}</p>
                <p className="text-sm font-medium">{arrivalAirport}</p>
                <p className="text-xs text-gray-500">{arrivalCity}</p>
              </div>
            </div>
          </div>

          {/* Return Flight (if provided) */}
          {returnFlight && (
            <>
              <Separator
                orientation="vertical"
                className="mx-4 hidden md:block"
              />
              <Separator className="my-4 md:hidden" />

              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                    <Plane className="h-4 w-4 transform rotate-180" />
                  </div>
                  <div>
                    <p className="font-medium">{returnFlight.airline}</p>
                    <p className="text-xs text-gray-500">
                      {returnFlight.flightNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {returnFlight.departureTime}
                    </p>
                    <p className="text-sm font-medium">
                      {returnFlight.departureAirport}
                    </p>
                    <p className="text-xs text-gray-500">
                      {returnFlight.departureCity}
                    </p>
                  </div>

                  <div className="flex-1 px-4 flex flex-col items-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {returnFlight.duration}
                    </p>
                    <div className="w-full flex items-center">
                      <div className="h-0.5 flex-1 bg-gray-300"></div>
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                      <div className="h-0.5 flex-1 bg-gray-300"></div>
                    </div>
                    {returnFlight.stops && returnFlight.stops > 0 && (
                      <Badge variant="outline" className="mt-1">
                        {returnFlight.stops}{" "}
                        {returnFlight.stops === 1 ? "stop" : "stops"}
                      </Badge>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold">
                      {returnFlight.arrivalTime}
                    </p>
                    <p className="text-sm font-medium">
                      {returnFlight.arrivalAirport}
                    </p>
                    <p className="text-xs text-gray-500">
                      {returnFlight.arrivalCity}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Price and Select Button */}
          <div className="md:ml-6 mt-4 md:mt-0 flex flex-col justify-center items-center">
            <p className="text-2xl font-bold text-primary mb-2">
              ${price.toFixed(2)}
            </p>
            <Button onClick={onSelect} className="w-full">
              Select
            </Button>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Limited seats</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
