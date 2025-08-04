import { Route, Routes } from "react-router";
import HomePage from "./pages/user/HomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import CallPage from "./pages/messaging/CallPage";
import ChatPage from "./pages/messaging/ChatPage";
import OnboardingPage from "./pages/user/OnboardingPage";
import FriendPage from "./pages/user/FriendPage";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import { useThemeStore } from "./store/useThemeStore";
import PrivateRoute from "./components/routes/PrivateRoute";
import OnboardingRoute from "./components/routes/OnboardingRoute";
import NotFoundPage from "./pages/user/NotFoundPage";
import PublicOnlyRoute from "./components/routes/PublicRoute";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import EmailVerificationRoute from "./components/routes/EmailVerificationRoute";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { AuthProvider } from "./context/AuthContext";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPage from "./pages/admin/AdminPage";
import CreateAdminPage from "./pages/admin/CreateAdminPage";
import AdminRoute from "./components/routes/AdminRoute";
import ProfilePage from "./pages/user/ProfilePage";

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
            <Route path="profile" element={<ProfilePage />} />
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

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Layout showSidebar />
              </AdminRoute>
            }
          >
            <Route index element={<AdminPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="create-admin" element={<CreateAdminPage />} />
          </Route>

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
