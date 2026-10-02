import { useEffect, useState } from "react";
import { api } from "../api";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Results() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await api.get("/activities/results/student");
        setResults(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar resultados"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <LoadingSpinner />;

  const pendingResults = results.filter((r) => r.status === "PENDING");
  const correctedResults = results.filter((r) => r.status === "CORRECTED");

  const getStatusBadge = (status: string) => {
    if (status === "PENDING") {
      return (
        <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm font-semibold">
          ⏳ Aguardando correção
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-600 rounded-full text-sm font-semibold">
        ✅ Corrigida
      </span>
    );
  };

  const getScorePercentage = (score: number, maxScore: number = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">📊 Meus Resultados</h1>

      {error && (
        <div className="bg-red-600 p-4 rounded-lg mb-6">
          Erro: {error}
        </div>
      )}

      {results.length === 0 ? (
        <Card>
          <p className="text-center text-gray-400 py-8">
            Você ainda não respondeu nenhuma atividade.
          </p>
        </Card>
      ) : (
        <>
          {/* Resultados Corrigidos */}
          {correctedResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-green-400">
                ✅ Atividades Corrigidas ({correctedResults.length})
              </h2>
              <div className="space-y-4">
                {correctedResults.map((result) => (
                  <Card key={result.id}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{result.activity.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {result.activity.description}
                        </p>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>

                    <div className="border-t border-gray-600 pt-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Nota</p>
                          <p className={`text-2xl font-bold ${getScorePercentage(result.score)}`}>
                            {result.score}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Data de Correção</p>
                          <p className="text-sm">
                            {new Date(result.correctedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>

                      {result.feedback && (
                        <div className="bg-gray-800 p-4 rounded mt-4">
                          <p className="text-gray-400 text-sm font-semibold mb-2">
                            Feedback do Professor:
                          </p>
                          <p className="text-white">{result.feedback}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Resultados Pendentes */}
          {pendingResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                ⏳ Atividades Aguardando Correção ({pendingResults.length})
              </h2>
              <div className="space-y-4">
                {pendingResults.map((result) => (
                  <Card key={result.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{result.activity.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {result.activity.description}
                        </p>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}