import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Activities from "./pages/Activities";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import CreateActivity from "./pages/CreateActivity";
import Results from "./pages/Results";
import ProfessorResults from "./pages/ProfessorResults";

import { getAuth } from "./auth";
import { setAuthToken } from "./api";


export default function App() {
  const [page, setPage] = useState("home");
  const [logged, setLogged] = useState(false);

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

    setLogged(false);
    setPage("home");
  };

  if (page === "home") {
    return <Home onStart={() => setPage("login")} />;
  }

  if (!logged) {
    if (page === "login") {
      return (
        <Login
          onLogin={() => {
            setLogged(true);
            setPage("activities");
          }}
          goRegister={() => setPage("register")}
        />
      );
    }

    if (page === "register") {
      return (
        <Register goLogin={() => setPage("login")} />
      );
    }
  }

  return (
    <div className="flex min-h-screen">

      <Sidebar
        setPage={setPage}
        logout={logout}
      />

      <div className="flex-1 overflow-auto">

        {page === "activities" && (
          <Activities />
        )}

        {page === "create" && (
          <CreateActivity />
        )}

        {page === "results" && (
          <Results />
        )}

        {page === "submissions" && (
          <ProfessorResults />
        )}

      </div>
    </div>
  );
}