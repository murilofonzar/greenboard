import { useState } from "react";
import { api, getErrorMessage } from "../api";
import { MediaGallery, MediaView } from "../components/Media";

export default function SolveActivity({ activity }: any) {
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const select = (
    qIndex: number,
    option: number
  ) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const submit = async () => {
    const answeredAll = activity.questions.every(
      (_: any, i: number) => answers[i] !== undefined
    );

    if (!answeredAll) {
      alert("Responda todas as questões");
      return;
    }

    try {
      await api.post(
        `/activities/${activity.id}/submit`,
        {
          answers,
        }
      );
    } catch (error) {
      alert(getErrorMessage(error, "Erro ao enviar atividade"));
      return;
    }

    alert("Atividade enviada!");
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="p-10 text-white">
        <h1 className="text-3xl">
          Atividade enviada com sucesso!
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <div className="bg-black/40 rounded-3xl p-8">
        <h1 className="text-4xl mb-2">
          {activity.title}
        </h1>

        <p className="text-gray-300 mb-8">
          {activity.description}
        </p>

        <MediaGallery media={activity.media} />

        <div className="space-y-8">
          {activity.questions.map(
            (q: any, i: number) => (
              <div
                key={i}
                className="bg-white/10 rounded-2xl p-6"
              >
                <h2 className="text-xl mb-4">
                  {i + 1}. {q.statement}
                </h2>

                {(q.imageUrl || q.audioUrl) && (
                  <div className="space-y-3 mb-4">
                    {q.imageUrl && (
                      <MediaView type="IMAGE" url={q.imageUrl} />
                    )}
                    {q.audioUrl && (
                      <MediaView type="AUDIO" url={q.audioUrl} />
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {q.options.map(
                    (
                      opt: string,
                      j: number
                    ) => (
                      <label
                        key={j}
                        className="flex items-center gap-3 bg-black/20 p-3 rounded-xl cursor-pointer hover:bg-black/40 transition"
                      >
                        <input
                          type="radio"
                          name={`question-${i}`}
                          checked={
                            answers[i] === j
                          }
                          onChange={() =>
                            select(i, j)
                          }
                        />

                        <span>{opt}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <button
          onClick={submit}
          className="mt-8 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-2xl"
        >
          Enviar atividade
        </button>
      </div>
    </div>
  );
}