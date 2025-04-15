import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

// Lazy load pages for better performance
const SearchPage = lazy(() => import("./pages/SearchPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const ConfirmationPage = lazy(() => import("./pages/ConfirmationPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const UserDashboardPage = lazy(() => import("./pages/UserDashboardPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00256c]"></div>
          </div>
        }
      >
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
