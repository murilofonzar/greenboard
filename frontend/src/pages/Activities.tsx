import { useEffect, useState } from "react";
import { api } from "../api";
import Card from "../components/Card";
import SolveActivity from "./SolveActivity";

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.get("/activities").then((res) => {
      setActivities(res.data);
    });
  }, []);

  if (selected) {
    return (
      <SolveActivity
        activity={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="p-8 text-white min-h-screen">

      <h1 className="text-4xl chalk mb-8">
        Atividades
      </h1>

      <div className="grid gap-6">

        {activities.length === 0 ? (
  <p>
    Nenhuma atividade disponível.
  </p>
) : activities.map((activity) => (
          <Card key={activity.id}>

            <div className="flex items-start justify-between">

              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {activity.title}
                </h2>

                <p className="text-gray-200">
                  {activity.description}
                </p>
              </div>

              <button
                onClick={() => setSelected(activity)}
                className="
                  bg-green-700
                  hover:bg-green-600
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                Abrir
              </button>

            </div>

          </Card>
        ))}

      </div>
    </div>
  );
}