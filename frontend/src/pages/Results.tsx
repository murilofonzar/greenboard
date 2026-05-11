import { useEffect, useState } from "react";
import { api } from "../api";

export default function Results() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/activities/results/student")
      .then((res) => setResults(res.data));
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl mb-6">
        Meus Resultados
      </h1>

      <div className="space-y-4">
        {results.map((r) => (
          <div
            key={r.id}
            className="bg-black/40 rounded-2xl p-6"
          >
            <h2 className="text-2xl">
              {r.activity.title}
            </h2>

            <p className="text-gray-300 mt-2">
              Nota: {r.score}/
              {r.answers.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}