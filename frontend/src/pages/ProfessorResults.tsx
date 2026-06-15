import { useEffect, useState } from "react";
import { api } from "../api";

export default function ProfessorResults() {
  const [results, setResults] = useState<any[]>([]);
  const [score, setScore] = useState({});
  const [feedback, setFeedback] = useState({});

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

            <p>
              Aluno: {r.student.name}
            </p>

            <hr className="my-4" />

            {r.activity.questions.map(
              (q: any, index: number) => (
                <div
                  key={q.id}
                  className="mb-4"
                >
                  <p>
                    <strong>
                      {q.statement}
                    </strong>
                  </p>

                  <p>
                    Resposta correta:
                    {" "}
                    {q.options[q.answer]}
                  </p>

                  <p>
                    Aluno marcou:
                    {" "}
                    {
                      q.options[
                      r.answers[index]
                      ]
                    }
                  </p>
                </div>
              ),
            )}
          </div>
        ))}

      </div>

    </div>

  );


}