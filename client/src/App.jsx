import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import OnboardingPage from "./pages/OnboardingPage";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignupPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
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

// Refactored `App.jsx` with Reusable **Auth guards** and **Nested layout** with authenticated routes
// import { Navigate, Route, Routes } from "react-router";
// import HomePage from "./pages/HomePage";
// import SignupPage from "./pages/SignupPage";
// import LoginPage from "./pages/LoginPage";
// import NotificationsPage from "./pages/NotificationsPage";
// import CallPage from "./pages/CallPage";
// import ChatPage from "./pages/ChatPage";
// import OnboardingPage from "./pages/OnboardingPage";
// import { Toaster } from "react-hot-toast";
// import Layout from "./components/Layout";
// import { useThemeStore } from "./store/useThemeStore";
// import PrivateRoute from "./components/routes/PrivateRoute";
// import OnboardingRoute from "./components/routes/OnboardingRoute";
// import NotFoundPage from "./pages/NotFoundPage";
// import PublicOnlyRoute from "./components/routes/PublicRoute";

// const App = () => {
//   const { theme } = useThemeStore();

//   return (
//     <div className="h-screen" data-theme={theme}>
//       <Routes>
//         {/* Layout-wrapped private routes */}
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <Layout showSidebar={true} />
//             </PrivateRoute>
//           }
//         >
//           <Route index element={<HomePage />} />
//           <Route path="notifications" element={<NotificationsPage />} />
//           <Route path="call" element={<CallPage />} />
//           <Route path="chat" element={<ChatPage />} />
//         </Route>

//         {/* Auth routes */}
//         <Route
//           path="/signup"
//           element={
//             <PublicOnlyRoute>
//               <SignupPage />
//             </PublicOnlyRoute>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <PublicOnlyRoute>
//               <LoginPage />
//             </PublicOnlyRoute>
//           }
//         />

//         {/* Onboarding route */}
//         <Route
//           path="/onboarding"
//           element={
//             <OnboardingRoute>
//               <OnboardingPage />
//             </OnboardingRoute>
//           }
//         />

//         {/* 404 fallback */}
//         <Route path="*" element={<NotFoundPage />} />
//       </Routes>
//       {/* Global toast notifications */}

//       <Toaster />
//     </div>
//   );
// };

// export default App;
