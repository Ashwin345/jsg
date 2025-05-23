import React, { createContext, useContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import { FlightOffer } from "@/services/amadeus";

interface AppContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  searchResults: FlightOffer[];
  setSearchResults: (results: FlightOffer[]) => void;
  searchCriteria: {
    tripType: string;
    origin: string;
    destination: string;
    dates: DateRange | undefined;
    passengers: number;
    travelClass: string;
  } | null;
  setSearchCriteria: (
    criteria: {
      tripType: string;
      origin: string;
      destination: string;
      dates: DateRange | undefined;
      passengers: number;
      travelClass: string;
    } | null,
  ) => void;
  selectedFlight: FlightOffer | null;
  setSelectedFlight: (flight: FlightOffer | null) => void;
  selectedDestination: {
    code: string;
    name: string;
    country: string;
  } | null;
  setSelectedDestination: (
    destination: {
      code: string;
      name: string;
      country: string;
    } | null,
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<FlightOffer[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<{
    tripType: string;
    origin: string;
    destination: string;
    dates: DateRange | undefined;
    passengers: number;
    travelClass: string;
  } | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null,
  );
  const [selectedDestination, setSelectedDestination] = useState<{
    code: string;
    name: string;
    country: string;
  } | null>(null);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        searchResults,
        setSearchResults,
        searchCriteria,
        setSearchCriteria,
        selectedFlight,
        setSelectedFlight,
        selectedDestination,
        setSelectedDestination,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Export as a named constant instead of a function to fix Fast Refresh compatibility
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
