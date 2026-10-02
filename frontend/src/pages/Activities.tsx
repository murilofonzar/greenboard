import { useEffect, useState } from "react";
import { api } from "../api";
import Card from "../components/Card";
import SolveActivity from "./SolveActivity";
import { getAuth } from "../auth";

export default function Activities({
  setPage,
  setSelectedActivity,
}: any) {
  const auth = getAuth();

  const isProfessor =
    auth?.user?.role === "PROFESSOR";

  const [activities, setActivities] =
    useState<any[]>([]);

  const [selected, setSelected] =
    useState<any>(null);

  const loadActivities = async () => {
    const res = await api.get("/activities");
    setActivities(res.data);
  };

    useEffect(() => {
    loadActivities();
  }, []);

  // Apenas alunos podem abrir a tela de resposta
  if (selected && !isProfessor) {
    return (
      <SolveActivity
        activity={selected}
        onBack={() => {
          setSelected(null);
          loadActivities();
        }}
      />
    );
  }

  return (
    <div className="p-8 text-white min-h-screen">

      <h1 className="text-4xl chalk mb-8">
        Atividades
      </h1>

      {activities.length === 0 ? (
        <p>
          Nenhuma atividade encontrada.
        </p>
      ) : (
        <div className="grid gap-6">

          {activities.map((activity) => (
            <Card key={activity.id}>

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {activity.title}
                  </h2>

                  <p className="text-gray-200">
                    {activity.description}
                  </p>

                  {isProfessor && activity.status && (
                    <div className="mt-2">
                      <span
                        className={`text-sm px-2 py-1 rounded ${activity.status === "PUBLISHED"
                            ? "bg-green-700"
                            : "bg-yellow-700"
                          }`}
                      >
                        {activity.status === "PUBLISHED"
                          ? "Publicada"
                          : "Rascunho"}
                      </span>
                    </div>
                  )}
                </div>

                {isProfessor ? (
                  <div className="flex gap-2">

                    <button
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                      onClick={() => {
                        setSelectedActivity(
                          activity
                        );

                        setPage(
                          "editActivity"
                        );
                      }}
                    >
                      Editar
                    </button>

                    {activity.status !==
                      "PUBLISHED" && (
                        <button
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                          onClick={async () => {
                            try {
                              await api.post(
                                `/activities/${activity.id}/publish`
                              );

                              alert(
                                "Atividade publicada!"
                              );

                              loadActivities();
                            } catch {
                              alert(
                                "Erro ao publicar atividade"
                              );
                            }
                          }}
                        >
                          Publicar
                        </button>
                      )}

                  </div>
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                    onClick={() =>
                      setSelected(activity)
                    }
                  >
                    Responder
                  </button>
                )}

              </div>

            </Card>
          ))}

        </div>
      )}

    </div>
  );
}