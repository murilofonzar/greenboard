import { useEffect, useState } from "react";
import { api } from "../api";
import Card from "../components/Card";

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
        {results.map((result) => (
<div>
  <Card>
  <h2>{result.activity.title}</h2>

  <div>
    Status:
    {result.status === "PENDING"
      ? "Aguardando correção"
      : "Corrigida"}
  </div>

  {result.score != null && (
    <div>
      Nota: {result.score}
    </div>
  )}

  {result.feedback && (
    <div>
      Feedback do professor:
      {result.feedback}
    </div>
  )}
</Card>
  <h3>
    {result.activity.title}
  </h3>

  <p>
    Status:
    {result.status ===
    'PENDING'
      ? ' Aguardando correção'
      : ' Corrigida'}
  </p>
  

  {result.score != null && (
    <p>
      Nota:
      {result.score}
    </p>
  )}

  {result.feedback && (
    <p>
      Feedback:
      {result.feedback}
    </p>
  )}
</div>
          
        ))}
      </div>
    </div>
  );
}