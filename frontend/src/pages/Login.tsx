import { useState } from "react";
import { api, setAuthToken } from "../api";
import { saveAuth } from "../auth";
import Button from "../components/Button";

export default function Login({ onLogin, goRegister }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    saveAuth(res.data);
    setAuthToken(res.data.access_token);
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <h1 className="chalk text-4xl text-center mb-6">
          Greenboard
        </h1>

        <input
          className="w-full mb-3 p-3 rounded bg-white/90"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 rounded bg-white/90"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Entrar</Button>

        <div className="mt-4 text-center">
          <button
            onClick={goRegister}
            className="text-white underline text-sm"
          >
            Não tem conta? Registrar
          </button>
        </div>
      </div>
    </div>
  );
}