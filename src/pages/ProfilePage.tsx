import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileManagement from "@/components/ProfileManagement";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">Please log in to manage your profile.</p>
          <Button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2"
          >
            <LogIn size={16} />
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Button>

        <div className="max-w-3xl mx-auto">
          <ProfileManagement
            onSuccess={() => {
              toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
