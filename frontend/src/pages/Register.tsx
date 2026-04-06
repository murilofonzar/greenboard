import { useState } from "react";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ALUNO",
  });

  const handle = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async () => {
    await api.post("/auth/register", form);
    alert("Registrado!");
  };

  return (
    <div>
      <h2>Registro</h2>
      <input name="name" placeholder="Nome" onChange={handle} />
      <input name="email" placeholder="Email" onChange={handle} />
      <input name="password" type="password" placeholder="Senha" onChange={handle} />
      <select name="role" onChange={handle}>
        <option value="ALUNO">Aluno</option>
        <option value="PROFESSOR">Professor</option>
      </select>
      <button onClick={register}>Cadastrar</button>
    </div>
  );
}