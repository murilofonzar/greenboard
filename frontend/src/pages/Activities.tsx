import { useEffect, useState } from "react";
import { api } from "../api";

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    api.get("/activities").then((res) => setActivities(res.data));
  }, []);

  return (
    <div>
      <h2>Atividades</h2>
      {activities.map((a) => (
        <div key={a.id}>
          <h3>{a.title}</h3>
          <p>{a.description}</p>
          {a.questions.map((q: any) => (
            <div key={q.id}>{q.statement}</div>
          ))}
        </div>
      ))}
    </div>
  );
}