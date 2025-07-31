import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnboardingPage from "./pages/OnboardingPage";
import FriendPage from "./pages/FriendPage";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";
import PrivateRoute from "./components/routes/PrivateRoute";
import OnboardingRoute from "./components/routes/OnboardingRoute";
import NotFoundPage from "./pages/NotFoundPage";
import PublicOnlyRoute from "./components/routes/PublicRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import EmailVerificationRoute from "./components/routes/EmailVerificationRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div className="min-h-screen" data-theme={theme}>
      <AuthProvider>
        <Routes>
          {/* Private, verified, onboarded */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout showSidebar />
              </PrivateRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="friends" element={<FriendPage />} />
            <Route path="call/:id" element={<CallPage />} />
            <Route path="chat/:id" element={<ChatPage />} />
          </Route>

          {/* Public only */}
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignupPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <ForgotPasswordPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicOnlyRoute>
                <ResetPasswordPage />
              </PublicOnlyRoute>
            }
          />

          {/* Email verification */}
          <Route
            path="/verify-email"
            element={
              <EmailVerificationRoute>
                <EmailVerificationPage />
              </EmailVerificationRoute>
            }
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <OnboardingPage />
              </OnboardingRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Global toast notifications */}
      </AuthProvider>
      <Toaster />
    </div>
  );
};

export default App;
