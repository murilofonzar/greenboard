import { useEffect, useState } from "react";
import { api } from "../api";

interface ProfessorSubmission {
  id: string;
  activity: {
    title: string;
    questions: Array<{
      id: string;
      statement: string;
      options: string[];
      answer: number;
    }>;
  };
  student?: { name: string } | null;
  guestName?: string | null;
  guestGradeGroup?: "ANOS_INICIAIS" | "ANOS_FINAIS" | null;
  guestGrade?: string | null;
  answers: number[];
}

const GRADE_LABELS: Record<string, string> = {
  PRIMEIRO_ANO: "1º ano",
  SEGUNDO_ANO: "2º ano",
  TERCEIRO_ANO: "3º ano",
  QUARTO_ANO: "4º ano",
  QUINTO_ANO: "5º ano",
  SEXTO_ANO: "6º ano",
  SETIMO_ANO: "7º ano",
  OITAVO_ANO: "8º ano",
  NONO_ANO: "9º ano",
};

export default function ProfessorResults() {
  const [results, setResults] = useState<ProfessorSubmission[]>([]);

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
              Aluno: {r.student?.name || r.guestName}
            </p>
            {(r.guestGradeGroup || r.guestGrade) && (
              <p>
                Etapa: {r.guestGradeGroup === "ANOS_INICIAIS"
                  ? "Anos Iniciais"
                  : "Anos Finais"}
                {r.guestGrade && ` · ${GRADE_LABELS[r.guestGrade] || r.guestGrade}`}
              </p>
            )}

            <hr className="my-4" />

            {r.activity.questions.map(
              (q, index) => (
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