import { useState } from "react";
import { api } from "../api";
import { getAuth } from "../auth";
import Button from "../components/Button";

export default function CreateActivity() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const save = async () => {
    const user = getAuth().user;
    await api.post("/activities", { title, description, professorId: user.id, questions: [] });
    alert("Criado!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Criar Atividade</h1>
      <input className="block mb-2 p-2 border rounded w-full" placeholder="Título" onChange={(e) => setTitle(e.target.value)} />
      <input className="block mb-4 p-2 border rounded w-full" placeholder="Descrição" onChange={(e) => setDescription(e.target.value)} />
      <Button onClick={save}>Salvar</Button>
    </div>
  );
}