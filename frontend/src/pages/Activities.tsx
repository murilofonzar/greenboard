import { useEffect, useState } from "react";
import { api } from "../api";

export default function Activities({ onSelect }: any) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.get("/activities").then((res) => setActivities(res.data));
  }, []);

  return (
    <div className="p-6 text-white">
      <h1>Atividades</h1>

      {activities.map((a: any) => (
        <div key={a.id} onClick={() => onSelect(a)} className="cursor-pointer">
          <h2>{a.title}</h2>
          <p>{a.description}</p>
        </div>
      ))}
    </div>
  );
}