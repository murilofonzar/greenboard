import { useEffect, useState } from "react";
import { api } from "../api";

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    api.get("/activities").then((res) => setActivities(res.data));
  }, []);

  return (
    <div className="p-6 chalk">
      <h1 className="text-3xl mb-4">Atividades</h1>
      {activities.map((a) => (
        <div key={a.id} className="mb-4">
          <h2 className="text-xl">{a.title}</h2>
          <p>{a.description}</p>
        </div>
      ))}
    </div>
  );
}