import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  User,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";

interface BookingProps {
  id: string;
  airline: string;
  flightNumber: string;
  departureCity: string;
  departureAirport: string;
  departureTime: string;
  departureDate: string;
  arrivalCity: string;
  arrivalAirport: string;
  arrivalTime: string;
  arrivalDate: string;
  price: number;
  status: "confirmed" | "cancelled" | "completed";
}

interface UserDashboardProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  bookings?: BookingProps[];
}

const UserDashboard = ({
  user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  bookings = [
    {
      id: "1",
      airline: "JetBlue Airways",
      flightNumber: "JB1234",
      departureCity: "New York",
      departureAirport: "JFK",
      departureTime: "08:30",
      departureDate: "2023-12-15",
      arrivalCity: "Los Angeles",
      arrivalAirport: "LAX",
      arrivalTime: "11:45",
      arrivalDate: "2023-12-15",
      price: 349.99,
      status: "confirmed" as const,
    },
    {
      id: "2",
      airline: "Delta Airlines",
      flightNumber: "DL5678",
      departureCity: "Los Angeles",
      departureAirport: "LAX",
      departureTime: "14:15",
      departureDate: "2023-12-22",
      arrivalCity: "New York",
      arrivalAirport: "JFK",
      arrivalTime: "22:30",
      arrivalDate: "2023-12-22",
      price: 389.99,
      status: "confirmed" as const,
    },
    {
      id: "3",
      airline: "American Airlines",
      flightNumber: "AA9012",
      departureCity: "Chicago",
      departureAirport: "ORD",
      departureTime: "10:00",
      departureDate: "2023-11-05",
      arrivalCity: "Miami",
      arrivalAirport: "MIA",
      arrivalTime: "14:20",
      arrivalDate: "2023-11-05",
      price: 299.99,
      status: "completed" as const,
    },
  ],
}: UserDashboardProps) => {
  const [activeBooking, setActiveBooking] = useState<BookingProps | null>(null);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: "(555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 bg-background">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span>Member since January 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane size={18} />
                  <span>{bookings.length} Bookings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4 mt-4">
              <h2 className="text-2xl font-bold mb-4">Your Flight Bookings</h2>

              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Plane className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">
                      You don't have any bookings yet.
                    </p>
                    <Button className="mt-4">Search Flights</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Plane className="h-5 w-5" />
                            <CardTitle className="text-lg">
                              {booking.airline} - {booking.flightNumber}
                            </CardTitle>
                          </div>
                          <Badge
                            variant={
                              booking.status === "cancelled"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {booking.departureCity} (
                                {booking.departureAirport})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.departureTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.departureDate}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {booking.arrivalCity} ({booking.arrivalAirport})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.arrivalTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.arrivalDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="font-bold text-lg">
                            ${booking.price.toFixed(2)}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setActiveBooking(booking)}
                        >
                          View Details
                        </Button>

                        {booking.status === "confirmed" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">
                                Cancel Booking
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Flight Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your booking
                                  for {booking.airline} flight{" "}
                                  {booking.flightNumber}? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Booking
                                </AlertDialogCancel>
                                <AlertDialogAction>
                                  Cancel Booking
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {activeBooking && (
                <AlertDialog
                  open={!!activeBooking}
                  onOpenChange={() => setActiveBooking(null)}
                >
                  <AlertDialogContent className="max-w-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Booking Details</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          {activeBooking.airline} - {activeBooking.flightNumber}
                        </h3>
                        <Badge
                          variant={
                            activeBooking.status === "cancelled"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {activeBooking.status.charAt(0).toUpperCase() +
                            activeBooking.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium">Departure</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {activeBooking.departureCity} (
                                {activeBooking.departureAirport})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{activeBooking.departureTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{activeBooking.departureDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Arrival</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {activeBooking.arrivalCity} (
                                {activeBooking.arrivalAirport})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{activeBooking.arrivalTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{activeBooking.arrivalDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Passenger Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Passenger Name
                            </p>
                            <p>{user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Email
                            </p>
                            <p>{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <h4 className="font-medium">Payment Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total Price
                            </p>
                            <p className="font-bold">
                              ${activeBooking.price.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Payment Method
                            </p>
                            <p>Credit Card ending in 4242</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      {activeBooking.status === "confirmed" && (
                        <Button variant="destructive">Cancel Booking</Button>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </TabsContent>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Preferences</CardTitle>
                  <CardDescription>
                    Set your travel preferences for better recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seat">Preferred Seat Type</Label>
                      <Input id="seat" defaultValue="Window" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meal">Meal Preference</Label>
                      <Input id="meal" defaultValue="Vegetarian" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="airline">Preferred Airlines</Label>
                      <Input id="airline" defaultValue="JetBlue, Delta" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Preferred Class</Label>
                      <Input id="class" defaultValue="Economy" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your bookings
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Payment Methods</h4>
                        <p className="text-sm text-muted-foreground">
                          Manage your payment methods
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Change your password
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove all of
                              your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
