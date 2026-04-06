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

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const save = async () => {
    const user = getAuth().user;

    await api.post("/activities", {
      title,
      description,
      professorId: user.id,
      questions,
    });

    alert("Atividade criada!");
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Criar Prova</h1>

      <input placeholder="Título" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Descrição" onChange={(e) => setDescription(e.target.value)} />

      <button onClick={addQuestion}>+ Pergunta</button>

      {questions.map((q, i) => (
        <div key={i} className="mt-4">
          <input
            placeholder="Pergunta"
            onChange={(e) => updateQuestion(i, "statement", e.target.value)}
          />

          {q.options.map((opt: string, j: number) => (
            <input
              key={j}
              placeholder={`Opção ${j}`}
              onChange={(e) => updateOption(i, j, e.target.value)}
            />
          ))}

          <select onChange={(e) => updateQuestion(i, "answer", Number(e.target.value))}>
            <option value={0}>Resposta 1</option>
            <option value={1}>Resposta 2</option>
            <option value={2}>Resposta 3</option>
            <option value={3}>Resposta 4</option>
          </select>
        </div>
      ))}

      <button onClick={save}>Salvar</button>
    </div>
  );
}