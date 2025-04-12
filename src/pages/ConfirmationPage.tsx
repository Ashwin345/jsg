import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CheckCircle, Printer, Download, Home } from "lucide-react";

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const bookingNumber = `KE${Math.floor(Math.random() * 1000000)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-t-4 border-t-green-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Booking Confirmed!
            </CardTitle>
            <p className="text-gray-500 mt-2">
              Your flight has been successfully booked. A confirmation email has
              been sent to your email address.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">
                  Booking Reference
                </div>
                <div className="text-2xl font-bold">{bookingNumber}</div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  • Please arrive at the airport at least 2 hours before your
                  flight
                </li>
                <li>• Don't forget to bring a valid ID or passport</li>
                <li>• Check-in opens 24 hours before departure</li>
                <li>
                  • Baggage allowance: 1 checked bag (23kg) and 1 carry-on (7kg)
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Confirmation
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download E-Ticket
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-[#00256c] hover:bg-[#001d52] flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
            <div className="text-center text-sm text-gray-500 mt-4">
              Need help? Contact our support team at support@jetsetgo.com
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmationPage;
