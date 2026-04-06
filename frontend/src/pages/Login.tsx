import { useState } from "react";
import { api, setAuthToken } from "../api";
import { saveAuth } from "../auth";

export default function Login({ onLogin }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    saveAuth(res.data);
    setAuthToken(res.data.access_token);
    onLogin();
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}