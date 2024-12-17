import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Landing from "./pages/Landing/";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import PublishedEvents from "./pages/PublishedEvents";
import AppLayout from "./pages/AppLayout";
import Profile from "./pages/Profile";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import PublishedEventDetail from "./pages/PublishedEventDetail";
import RegisterEvent from "./pages/EventRegister";

/**
 * wrap the private pages with the AuthenticatedRoute component
 */
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="app" element={<AppLayout />}>
            {/* private pages */}
            <Route path="events" element={<Dashboard />} />
            <Route
              path="events/:id"
              element={
                <AuthenticatedRoute>
                  <EventDetails />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="events/:id/register"
              element={
                <AuthenticatedRoute>
                  <RegisterEvent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <AuthenticatedRoute>
                  <Profile />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="profile/createEvent"
              element={
                <AuthenticatedRoute>
                  <CreateEvent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="profile/publishedEvents"
              element={
                <AuthenticatedRoute>
                  <PublishedEvents />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="profile/publishedEvents/:eventId"
              element={
                <AuthenticatedRoute>
                  <PublishedEventDetail />
                </AuthenticatedRoute>
              }
            />
          </Route>
          {/* public pages */}
          <Route index element={<Navigate replace to="landing" />} /> 
          <Route path="landing" element={<Landing />} />
          <Route path="login" element={<Login />} />
          {/* <Route path="*" element={} /> */}
        </Routes>
        <ToastContainer position="top-center" autoClose={2000} />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
