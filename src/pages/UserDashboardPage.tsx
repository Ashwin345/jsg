import React from "react";
import { useNavigate } from "react-router-dom";
import UserDashboard from "@/components/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn } from "lucide-react";

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6">Please log in to view your dashboard.</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>

        <UserDashboard
          user={{
            name: user?.name || "User",
            email: user?.email || "user@example.com",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`,
          }}
        />
      </div>
    </div>
  );
};

export default UserDashboardPage;
