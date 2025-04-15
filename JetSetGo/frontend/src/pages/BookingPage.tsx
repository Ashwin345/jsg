import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from "@/components/AppContext";
import {
  Plane,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedFlight, searchCriteria } = useAppContext();

  // Redirect if no flight is selected
  if (!selectedFlight || !searchCriteria) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">No Flight Selected</h2>
        <p className="mb-6">Please select a flight from the search results.</p>
        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Return to Search
        </Button>
      </div>
    );
  }

  // Extract flight details
  const flight = {
    airline: selectedFlight.validatingAirlineCodes[0] || "KE",
    flightNumber: `${selectedFlight.validatingAirlineCodes[0] || "KE"}${selectedFlight.itineraries[0]?.segments[0]?.number || "123"}`,
    departureDate: new Date(
      selectedFlight.itineraries[0]?.segments[0]?.departure.at || "",
    ).toLocaleDateString(),
    departureTime: new Date(
      selectedFlight.itineraries[0]?.segments[0]?.departure.at || "",
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    departureAirport:
      selectedFlight.itineraries[0]?.segments[0]?.departure.iataCode || "",
    arrivalDate: new Date(
      selectedFlight.itineraries[0]?.segments[
        selectedFlight.itineraries[0].segments.length - 1
      ]?.arrival.at || "",
    ).toLocaleDateString(),
    arrivalTime: new Date(
      selectedFlight.itineraries[0]?.segments[
        selectedFlight.itineraries[0].segments.length - 1
      ]?.arrival.at || "",
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    arrivalAirport:
      selectedFlight.itineraries[0]?.segments[
        selectedFlight.itineraries[0].segments.length - 1
      ]?.arrival.iataCode || "",
    duration: selectedFlight.itineraries[0]?.duration || "",
    price: parseFloat(selectedFlight.price.total),
    passengers: searchCriteria.passengers,
    class: searchCriteria.travelClass,
  };

  const handleBookFlight = () => {
    // In a real app, this would process the booking
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Results
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Flight Details */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-[#00256c]" />
                    <CardTitle>Flight Details</CardTitle>
                  </div>
                  <div className="text-sm text-gray-500">
                    Booking Reference:{" "}
                    <span className="font-medium">
                      KE{Math.floor(Math.random() * 1000000)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Airline</div>
                    <div className="font-medium">
                      {flight.airline === "KE" ? "Korean Air" : flight.airline}{" "}
                      - {flight.flightNumber}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Class</div>
                    <div className="font-medium">
                      {flight.class === "ECONOMY"
                        ? "Economy"
                        : flight.class === "PREMIUM_ECONOMY"
                          ? "Premium Economy"
                          : flight.class === "BUSINESS"
                            ? "Prestige (Business)"
                            : "First"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Passengers</div>
                    <div className="font-medium">{flight.passengers}</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded-lg bg-gray-50 mb-4">
                  <div className="text-center mb-4 md:mb-0">
                    <div className="text-2xl font-bold">
                      {flight.departureTime}
                    </div>
                    <div className="text-lg font-medium">
                      {flight.departureAirport}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{flight.departureDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-500 mb-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {flight.duration}
                    </div>
                    <div className="w-24 md:w-40 h-0.5 bg-gray-300 relative">
                      <div className="absolute -top-1.5 right-0 w-3 h-3 bg-[#00256c] rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {selectedFlight.itineraries[0]?.segments.length > 1
                        ? `${selectedFlight.itineraries[0]?.segments.length - 1} stop(s)`
                        : "Non-stop"}
                    </div>
                  </div>

                  <div className="text-center mt-4 md:mt-0">
                    <div className="text-2xl font-bold">
                      {flight.arrivalTime}
                    </div>
                    <div className="text-lg font-medium">
                      {flight.arrivalAirport}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{flight.arrivalDate}</span>
                    </div>
                  </div>
                </div>

                {/* Flight segments details */}
                {selectedFlight.itineraries[0]?.segments.map(
                  (segment, index) => (
                    <div key={index} className="mb-4 last:mb-0">
                      {index > 0 && <Separator className="my-4" />}
                      <div className="text-sm font-medium mb-2">
                        {index === 0
                          ? "Departure Flight"
                          : `Connection ${index}`}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">From</div>
                          <div className="font-medium">
                            {segment.departure.iataCode}
                          </div>
                          <div className="text-sm">
                            {new Date(segment.departure.at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">To</div>
                          <div className="font-medium">
                            {segment.arrival.iataCode}
                          </div>
                          <div className="text-sm">
                            {new Date(segment.arrival.at).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </div>

          {/* Price Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
                <CardDescription>Flight details and total cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base fare</span>
                    <span>${(flight.price * 0.85).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & fees</span>
                    <span>${(flight.price * 0.15).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${flight.price.toFixed(2)}</span>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 flex items-start gap-2 mt-4">
                    <div className="mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-info"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <div>
                      This price includes all applicable taxes and fees. No
                      hidden charges.
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleBookFlight}
                  className="w-full bg-[#00256c] hover:bg-[#001d52] text-white py-6 rounded-md transition-colors font-medium text-lg"
                >
                  Book Flight
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
