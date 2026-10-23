import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Activities from "./pages/Activities";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import CreateActivity from "./pages/CreateActivity";
import Results from "./pages/Results";
import ProfessorResults from "./pages/ProfessorResults";
import EditActivity from "./pages/EditActivity";
import CreateWordSearch from "./pages/CreateWordSearch";

import { getAuth } from "./auth";
import { clearAuthToken, setAuthToken } from "./api";

export default function App() {
  const [page, setPage] = useState("home");
  const [logged, setLogged] = useState(false);
  const [guestStudent, setGuestStudent] = useState<{
    name: string;
    gradeGroup: "ANOS_INICIAIS" | "ANOS_FINAIS";
    grade: string;
  } | null>(null);

  const [selectedActivity, setSelectedActivity] =
    useState<any>(null);

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setAuthToken(auth.access_token);
      setLogged(true);
      setPage("activities");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("auth");
    clearAuthToken();

    setLogged(false);
    setGuestStudent(null);
    setPage("home");
    setSelectedActivity(null);
  };

  // HOME
  if (page === "home") {
    return (
      <Home
        onStart={() => setPage("login")}
      />
    );
  }

  // LOGIN / REGISTER
  if (!logged) {
    if (page === "login") {
      return (
        <Login
          onLogin={() => {
            setGuestStudent(null);
            setLogged(true);
            setPage("activities");
          }}
          onGuest={(student) => {
            setGuestStudent(student);
            setPage("activities");
          }}
          goRegister={() => setPage("register")}
        />
      );
    }

    if (page === "register") {
      return (
        <Register
          goLogin={() => setPage("login")}
        />
      );
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        setPage={setPage}
        logout={logout}
        guestStudent={guestStudent}
      />

      <div className="flex-1 overflow-auto">

        {page === "activities" && (
          <Activities
            setPage={setPage}
            setSelectedActivity={setSelectedActivity}
            guestStudent={guestStudent}
          />
        )}

        {page === "create" && (
          <CreateActivity
            onBack={() => setPage("activities")}
          />
        )}

        {page === "createWordSearch" && (
          <CreateWordSearch
            onBack={() => setPage("activities")}
            onSuccess={() => setPage("activities")}
          />
        )}

        {page === "results" && (
          <Results />
        )}

        {page === "submissions" && (
          <ProfessorResults />
        )}

        {page === "editActivity" && (
          <EditActivity
            activity={selectedActivity}
            onBack={() => setPage("activities")}
          />
        )}

      </div>
    </div>
  );
}