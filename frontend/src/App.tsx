import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activities from "./pages/Activities";
import CreateActivity from "./pages/CreateActivity";
import { getAuth } from "./auth";
import { setAuthToken } from "./api";

export default function App() {
  const [page, setPage] = useState("login");
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setAuthToken(auth.access_token);
      setLogged(true);
      setPage("activities");
    }
  }, []);

  if (!logged) {
    return (
      <div>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>

        {page === "login" && <Login onLogin={() => setLogged(true)} />}
        {page === "register" && <Register />}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setPage("activities")}>Atividades</button>
      <button onClick={() => setPage("create")}>Criar</button>

      {page === "activities" && <Activities />}
      {page === "create" && <CreateActivity />}
    </div>
  );
}