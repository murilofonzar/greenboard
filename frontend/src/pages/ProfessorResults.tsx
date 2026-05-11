import { useEffect, useState } from "react";
import { api } from "../api";

export default function ProfessorResults() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/activities/results/professor")
      .then((res) => setResults(res.data));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl mb-6">
        Respostas dos Alunos
      </h1>

      <div className="space-y-4">
        {results.map((r) => (
          <div
            key={r.id}
            className="bg-black/40 p-6 rounded-2xl"
          >
            <h2 className="text-2xl">
              {r.activity.title}
            </h2>

            <p className="mt-2">
              Aluno: {r.student.name}
            </p>

            <p>
              Nota: {r.score}/
              {r.answers.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}