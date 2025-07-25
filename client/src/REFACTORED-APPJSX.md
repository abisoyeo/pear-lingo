## Refactored `App.jsx`

✅ Reusable **Auth guards**
✅ **Nested layout** with authenticated routes
✅ A simple **404 page**
✅ Clear **standard explanatory comments**

---

### ✅ `App.jsx` (Fully Commented & Modular)

```jsx
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnboardingPage from "./pages/OnboardingPage";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";
import PrivateRoute from "./components/routes/PrivateRoute";
import OnboardingRoute from "./components/routes/OnboardingRoute";
import NotFoundPage from "./pages/NotFoundPage";
import PublicOnlyRoute from "./components/routes/PublicRoute";

const App = () => {
  const { theme } = useThemeStore();

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        {/* Layout-wrapped private routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout showSidebar={true} />
            </PrivateRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="call" element={<CallPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        {/* Auth routes */}
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

        {/* Onboarding route */}
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

      <Toaster />
    </div>
  );
};

export default App;
```
