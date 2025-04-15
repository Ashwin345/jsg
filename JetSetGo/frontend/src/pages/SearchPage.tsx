import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import FlightSearch from "@/components/FlightSearch";
import FlightResults from "@/components/FlightResults";
import {
  amadeusService,
  type SearchParams,
  type FlightOffer,
} from "@/services/amadeus";
import { useAppContext } from "@/components/AppContext";
import { useToast } from "@/components/ui/use-toast";

const SearchPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    isLoading,
    setIsLoading,
    searchResults,
    setSearchResults,
    searchCriteria,
    setSearchCriteria,
    setSelectedFlight,
  } = useAppContext();

  const handleSearch = async (searchData: any) => {
    try {
      setIsLoading(true);

      // Format the search parameters for the Amadeus API
      const params: SearchParams = {
        originLocationCode: searchData.origin,
        destinationLocationCode: searchData.destination,
        departureDate: searchData.dates.from
          ? format(searchData.dates.from, "yyyy-MM-dd")
          : "",
        adults: searchData.passengers,
        travelClass: searchData.travelClass,
        currencyCode: "USD",
      };

      // Add return date if it's a round trip
      if (searchData.tripType === "round-trip" && searchData.dates.to) {
        params.returnDate = format(searchData.dates.to, "yyyy-MM-dd");
      }

      // Call the API through our service
      try {
        const results = await amadeusService.searchFlights(params);
        console.log("API Results:", results);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching flight results:", error);
        toast({
          title: "API Error",
          description:
            "Could not fetch flight results. Please check the console for details.",
          variant: "destructive",
        });
      }

      // Check if server is healthy
      const isHealthy = await amadeusService.checkHealth();
      if (!isHealthy) {
        toast({
          title: "Server Connection Issue",
          description:
            "Could not connect to the backend server. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching flights:", error);
      toast({
        title: "Search Failed",
        description:
          "There was an error searching for flights. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    navigate("/booking");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <FlightSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {searchResults.length > 0 && (
          <div className="mt-8">
            <FlightResults
              flights={searchResults.map((offer: FlightOffer) => ({
                id: offer.id,
                airline: {
                  id: offer.validatingAirlineCodes[0] || "KE",
                  name:
                    offer.validatingAirlineCodes[0] === "KE"
                      ? "Korean Air"
                      : offer.validatingAirlineCodes[0] || "Korean Air",
                  logo: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80`,
                },
                flightNumber: `${offer.validatingAirlineCodes[0] || "KE"}${offer.itineraries[0]?.segments[0]?.number || "123"}`,
                departureTime: amadeusService.formatDateTime(
                  offer.itineraries[0]?.segments[0]?.departure.at || "",
                ).time,
                departureAirport:
                  offer.itineraries[0]?.segments[0]?.departure.iataCode || "",
                departureCity: amadeusService.getAirportCity(
                  offer.itineraries[0]?.segments[0]?.departure.iataCode || "",
                ),
                arrivalTime: amadeusService.formatDateTime(
                  offer.itineraries[0]?.segments[
                    offer.itineraries[0].segments.length - 1
                  ]?.arrival.at || "",
                ).time,
                arrivalAirport:
                  offer.itineraries[0]?.segments[
                    offer.itineraries[0].segments.length - 1
                  ]?.arrival.iataCode || "",
                arrivalCity: amadeusService.getAirportCity(
                  offer.itineraries[0]?.segments[
                    offer.itineraries[0].segments.length - 1
                  ]?.arrival.iataCode || "",
                ),
                duration: amadeusService.formatDuration(
                  offer.itineraries[0]?.duration || "",
                ),
                price: parseFloat(offer.price.total),
                stops: offer.itineraries[0]?.segments.length - 1 || 0,
              }))}
              isLoading={isLoading}
              onSelectFlight={handleSelectFlight}
            />
          </div>
        )}

        {!isLoading && searchCriteria && searchResults.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No flights found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
