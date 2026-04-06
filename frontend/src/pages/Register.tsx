import { useState } from "react";
import { api } from "../api";
import Button from "../components/Button";

export default function Register({ goLogin }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ALUNO",
  });

  const handle = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const register = async () => {
    await api.post("/auth/register", form);
    alert("Registrado!");
    goLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-black/70 p-8 rounded-2xl w-full max-w-md">

        <h1 className="chalk text-3xl text-center mb-6">
          Criar Conta
        </h1>

        <input name="name" className="w-full mb-2 p-3 rounded" placeholder="Nome" onChange={handle} />
        <input name="email" className="w-full mb-2 p-3 rounded" placeholder="Email" onChange={handle} />
        <input name="password" type="password" className="w-full mb-2 p-3 rounded" placeholder="Senha" onChange={handle} />

        <select name="role" className="w-full mb-4 p-3 rounded" onChange={handle}>
          <option value="ALUNO">Aluno</option>
          <option value="PROFESSOR">Professor</option>
        </select>

        <Button onClick={register}>Registrar</Button>

        <div className="mt-4 text-center">
          <button onClick={goLogin} className="text-white underline text-sm">
            Voltar para login
          </button>
        </div>
      </div>
    </div>
  );
}