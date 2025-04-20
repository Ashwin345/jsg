import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { feedbackService } from "@/services/feedbackService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Star, Plane } from "lucide-react";

interface FeedbackFormProps {
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await feedbackService.submitFeedback({
        ...formData,
        rating,
      });

      toast({
        title: "Feedback Submitted",
        description: response.message,
      });

      // Reset form
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
      });
      setRating(5);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white relative overflow-hidden border-0 shadow-lg">
      {/* Boarding pass tear line - top */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center">
        <div className="h-4 w-4 rounded-full bg-background -mt-2 -ml-2 z-10"></div>
        <div className="border-t border-dashed border-gray-300 flex-grow mx-2"></div>
        <div className="h-4 w-4 rounded-full bg-background -mt-2 -mr-2 z-10"></div>
      </div>

      <div className="pt-6 pb-2 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">JetSetGO</h3>
            <p className="text-xs opacity-80">Passenger Feedback Card</p>
          </div>
          <Plane className="h-8 w-8 transform rotate-45" />
        </div>
      </div>

      <CardHeader className="pt-4 pb-0">
        <CardTitle className="flex items-center gap-2 text-2xl text-center text-gray-800">
          <MessageSquare className="h-5 w-5" />
          Share Your Journey Experience
        </CardTitle>
        <CardDescription className="text-center">
          We value your opinion! Let us know how we can improve your travel
          experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Passenger Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Contact Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-700 font-medium">
              Feedback Category
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="e.g. Flight Service, Booking Experience"
              required
              value={formData.subject}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700 font-medium">
              Your Comments
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please share your thoughts about your journey..."
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Flight Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit Feedback"}
            {!isLoading && <Plane className="h-4 w-4" />}
          </Button>
        </form>
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
            Feedback ID: JSG-
            {Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}
          </p>
          <p className="mt-1">Thank you for flying with JetSetGO</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FeedbackForm;
