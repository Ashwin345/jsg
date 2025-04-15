// Amadeus API service through our backend
import axios from "axios";

interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees: { amount: string; type: string }[];
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

interface Itinerary {
  duration: string;
  segments: Segment[];
}

interface Segment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  operating: {
    carrierCode: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: {
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
    includedCheckedBags: {
      quantity: number;
    };
  }[];
}

interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string;
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
}

class AmadeusService {
  private baseUrl: string = "/api";

  public async searchFlights(params: SearchParams): Promise<FlightOffer[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/flights/search`,
        params,
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error searching flights:", error);
      throw error;
    }
  }

  // Check server health
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data.status === "ok";
    } catch (error) {
      console.error("Server health check failed:", error);
      return false;
    }
  }

  // Convert IATA code to city name (simplified version)
  public getAirportCity(iataCode: string): string {
    const airports: Record<string, string> = {
      ICN: "Seoul",
      GMP: "Seoul",
      JFK: "New York",
      LAX: "Los Angeles",
      SFO: "San Francisco",
      LHR: "London",
      CDG: "Paris",
      HND: "Tokyo",
      NRT: "Tokyo",
      PEK: "Beijing",
      PVG: "Shanghai",
      SYD: "Sydney",
      HKG: "Hong Kong",
      BKK: "Bangkok",
      // Add more as needed
    };

    return airports[iataCode] || iataCode;
  }

  // Format flight duration
  public formatDuration(duration: string): string {
    // PT2H30M -> 2h 30m
    const hours = duration.match(/([0-9]+)H/);
    const minutes = duration.match(/([0-9]+)M/);

    let result = "";
    if (hours) result += `${hours[1]}h `;
    if (minutes) result += `${minutes[1]}m`;

    return result.trim();
  }

  // Format date and time
  public formatDateTime(dateTime: string): {
    date: string;
    time: string;
  } {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  }
}

export const amadeusService = new AmadeusService();
export type { FlightOffer, SearchParams, Itinerary, Segment };
