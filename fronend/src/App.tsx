import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./features/auth/hooks/useAuth";
import { AdminPage } from "./features/admin/pages/AdminPage";
import { AccountPage } from "./features/account/pages/AccountPage";
import { useMyBookings } from "./features/account/hooks/useMyBookings";
import { HomePage } from "./features/studio/pages/HomePage";

function HashScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const id = location.hash.slice(1);

    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.pathname]);

  return null;
}

function App() {
  const auth = useAuth();
  const myBookings = useMyBookings(auth.token);

  return (
    <BrowserRouter>
      <HashScrollManager />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              error={auth.error}
              form={auth.form}
              isCheckingSession={auth.isCheckingSession}
              isSubmitting={auth.isSubmitting}
              mode={auth.mode}
              onFieldChange={auth.updateField}
              onLogout={auth.logout}
              onModeChange={auth.setMode}
              onSubmit={auth.submit}
              status={auth.status}
              token={auth.token}
              unreadCount={myBookings.unreadCount}
              user={auth.user}
            />
          }
        />
        <Route
          path="/account"
          element={
            <AccountPage
              error={auth.error}
              form={auth.form}
              isCheckingSession={auth.isCheckingSession}
              isSubmitting={auth.isSubmitting}
              mode={auth.mode}
              onFieldChange={auth.updateField}
              onLogout={auth.logout}
              onModeChange={auth.setMode}
              onSubmit={auth.submit}
              status={auth.status}
              token={auth.token}
              user={auth.user}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              isCheckingSession={auth.isCheckingSession}
              onLogout={auth.logout}
              token={auth.token}
              user={auth.user}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
