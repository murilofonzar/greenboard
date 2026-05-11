import { useState } from "react";
import Card from "../components/Card";

export default function SolveActivity({
  activity,
  onBack,
}: any) {
  const [answers, setAnswers] = useState<number[]>([]);

  const select = (
    qIndex: number,
    option: number,
  ) => {
    const updated = [...answers];

    updated[qIndex] = option;

    setAnswers(updated);
  };

  return (
    <div className="p-8 text-white min-h-screen">

      <button
        onClick={onBack}
        className="
          mb-6
          bg-white/10
          hover:bg-white/20
          px-5
          py-3
          rounded-xl
          transition
        "
      >
        ← Voltar
      </button>

      <h1 className="text-4xl chalk mb-3">
        {activity.title}
      </h1>

      <p className="text-gray-200 mb-8">
        {activity.description}
      </p>

      <div className="space-y-6">

        {activity.questions.map((q: any, i: number) => (
          <Card key={i}>

            <div className="space-y-5">

              <h2 className="text-2xl font-semibold">
                {i + 1}. {q.statement}
              </h2>

              <div className="space-y-3">

                {q.options.map(
                  (opt: string, j: number) => {
                    const selected =
                      answers[i] === j;

                    return (
                      <button
                        key={j}
                        onClick={() => select(i, j)}
                        className={`
                          w-full
                          text-left
                          p-4
                          rounded-xl
                          transition
                          border

                          ${
                            selected
                              ? `
                                bg-green-700
                                border-green-500
                              `
                              : `
                                bg-white/10
                                border-white/10
                                hover:bg-white/20
                              `
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">

                          <div
                            className={`
                              w-5
                              h-5
                              rounded-full
                              border-2

                              ${
                                selected
                                  ? "bg-white border-white"
                                  : "border-white"
                              }
                            `}
                          />

                          <span className="text-lg">
                            {opt}
                          </span>

                        </div>
                      </button>
                    );
                  },
                )}

              </div>

            </div>

          </Card>
        ))}

      </div>

      <button
        className="
          mt-8
          bg-green-700
          hover:bg-green-600
          px-8
          py-4
          rounded-xl
          font-semibold
          text-lg
          transition
        "
      >
        Entregar atividade
      </button>
    </div>
  );
}