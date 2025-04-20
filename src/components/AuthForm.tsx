import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { User, LogIn, UserPlus, Plane, PlaneTakeoff } from "lucide-react";

interface AuthFormProps {
  onSuccess?: () => void;
  defaultTab?: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSuccess,
  defaultTab = "login",
}) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Login Successful",
        description: "Welcome back to JetSetGO!",
      });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(
        registerData.name,
        registerData.email,
        registerData.password,
      );
      toast({
        title: "Registration Successful",
        description: "Welcome to JetSetGO!",
      });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white relative overflow-hidden border-0 shadow-lg">
      {/* Boarding pass tear line */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center">
        <div className="h-4 w-4 rounded-full bg-background -mt-2 -ml-2 z-10"></div>
        <div className="border-t border-dashed border-gray-300 flex-grow mx-2"></div>
        <div className="h-4 w-4 rounded-full bg-background -mt-2 -mr-2 z-10"></div>
      </div>

      <div className="pt-6 pb-2 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">JetSetGO</h3>
            <p className="text-xs opacity-80">Your journey begins here</p>
          </div>
          <Plane className="h-8 w-8 transform rotate-45" />
        </div>
      </div>

      <CardHeader className="pt-4 pb-0">
        <CardTitle className="text-2xl text-center text-gray-800">
          Welcome Aboard
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account or create a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Passenger Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Security Code
                  </Label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Boarding..." : "Board Now"}
                {!isLoading && <PlaneTakeoff className="h-4 w-4" />}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Passenger Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="register-email"
                  className="text-gray-700 font-medium"
                >
                  Email Address
                </Label>
                <Input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="register-password"
                  className="text-gray-700 font-medium"
                >
                  Create Security Code
                </Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-gray-700 font-medium"
                >
                  Confirm Security Code
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Preparing Ticket..." : "Reserve Your Seat"}
                {!isLoading && <PlaneTakeoff className="h-4 w-4" />}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      {/* Bottom tear line */}
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-full flex justify-between items-center">
          <div className="h-4 w-4 rounded-full bg-background -mb-2 -ml-2 z-10"></div>
          <div className="border-t border-dashed border-gray-300 flex-grow mx-2"></div>
          <div className="h-4 w-4 rounded-full bg-background -mb-2 -mr-2 z-10"></div>
        </div>
      </div>

      <CardFooter className="flex justify-center text-xs text-gray-500 pt-2 pb-6">
        <div className="text-center">
          <p>
            Boarding Pass ID: JSG-
            {Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}
          </p>
          <p className="mt-1">
            By continuing, you agree to JetSetGO's Terms of Service and Privacy
            Policy
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
