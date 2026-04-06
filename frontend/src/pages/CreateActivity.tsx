import { useState } from "react";
import { api } from "../api";
import { getAuth } from "../auth";

export default function CreateActivity() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { statement: "", options: ["", "", "", ""], answer: 0 },
    ]);
  };

  const save = async () => {
    const user = getAuth().user;
    await api.post("/activities", {
      title,
      description,
      professorId: user.id,
      questions,
    });
    alert("Criado!");
  };

  return (
    <div>
      <h2>Criar Atividade</h2>
      <input placeholder="Título" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Descrição" onChange={(e) => setDescription(e.target.value)} />

      <button onClick={addQuestion}>Adicionar Pergunta</button>

      {questions.map((q, i) => (
        <div key={i}>
          <input
            placeholder="Pergunta"
            onChange={(e) => {
              q.statement = e.target.value;
              setQuestions([...questions]);
            }}
          />
        </div>
      ))}

      <button onClick={save}>Salvar</button>
    </div>
  );
}