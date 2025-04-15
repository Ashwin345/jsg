import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings } from "lucide-react";

interface ProfileManagementProps {
  onSuccess?: () => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ onSuccess }) => {
  const { user: authUser, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferences: {
      seatType: "",
      mealPreference: "",
      preferredAirlines: "",
      preferredClass: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const profile = await profileService.getUserProfile();
        setProfileData({
          name: profile.name,
          email: profile.email,
          phone: profile.phone || "",
          address: profile.address || "",
          preferences: {
            seatType: profile.preferences?.seatType || "",
            mealPreference: profile.preferences?.mealPreference || "",
            preferredAirlines: profile.preferences?.preferredAirlines || "",
            preferredClass: profile.preferences?.preferredClass || "",
          },
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleSavePersonalInfo = async () => {
    setIsLoading(true);

    try {
      await profileService.updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
      });

      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update personal information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);

    try {
      await profileService.updateProfile({
        preferences: profileData.preferences,
      });

      toast({
        title: "Success",
        description: "Travel preferences updated successfully",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update travel preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>
            Please sign in to manage your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="mb-4">
            You need to be logged in to access this feature
          </p>
          <Button>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (isFetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
          <CardDescription>Loading your profile...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00256c]"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Management
        </CardTitle>
        <CardDescription>
          Manage your personal information and travel preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Travel Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handlePersonalInfoChange}
                />
              </div>
            </div>

            <Button
              onClick={handleSavePersonalInfo}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Personal Information"}
            </Button>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seatType">Preferred Seat Type</Label>
                <Input
                  id="seatType"
                  name="seatType"
                  value={profileData.preferences.seatType}
                  onChange={handlePreferencesChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mealPreference">Meal Preference</Label>
                <Input
                  id="mealPreference"
                  name="mealPreference"
                  value={profileData.preferences.mealPreference}
                  onChange={handlePreferencesChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredAirlines">Preferred Airlines</Label>
                <Input
                  id="preferredAirlines"
                  name="preferredAirlines"
                  value={profileData.preferences.preferredAirlines}
                  onChange={handlePreferencesChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredClass">Preferred Class</Label>
                <Input
                  id="preferredClass"
                  name="preferredClass"
                  value={profileData.preferences.preferredClass}
                  onChange={handlePreferencesChange}
                />
              </div>
            </div>

            <Button
              onClick={handleSavePreferences}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Travel Preferences"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileManagement;
