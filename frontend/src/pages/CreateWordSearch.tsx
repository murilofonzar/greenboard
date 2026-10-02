import { useState } from "react";
import { api, getErrorMessage } from "../api";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import { ActivityMediaEditor } from "../components/Media";
import { ActivityType, EducationLevel } from "../types";
import type { ActivityMedia } from "../types";

interface CreateWordSearchProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateWordSearch({
  onBack,
  onSuccess,
}: CreateWordSearchProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("ENSINO_FUNDAMENTAL");
  const [gridRows, setGridRows] = useState<string[]>(Array(8).fill(""));
  const [words, setWords] = useState<string[]>(["", "", ""]);
  const [media, setMedia] = useState<ActivityMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGridChange = (index: number, value: string) => {
    const newGrid = [...gridRows];
    newGrid[index] = value.toUpperCase();
    setGridRows(newGrid);
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value.toUpperCase();
    setWords(newWords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Título e descrição são obrigatórios");
      return;
    }

    if (gridRows.some((row) => !row.trim())) {
      setError("Todas as linhas da grade devem ser preenchidas");
      return;
    }

    if (words.some((w) => !w.trim())) {
      setError("Todas as palavras devem ser preenchidas");
      return;
    }

    try {
      setLoading(true);
      await api.post("/activities", {
        title,
        description,
        type: ActivityType.WORD_SEARCH,
        educationLevel,
        grid: gridRows,
        words: words.filter((w) => w.trim()),
        media,
      });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao criar atividade"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8 text-white">
      <button
        onClick={onBack}
        className="mb-4 text-blue-400 hover:text-blue-300"
      >
        ← Voltar
      </button>

      <h1 className="text-4xl font-bold mb-6">Criar Caça Palavras</h1>

      {error && (
        <ErrorAlert message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Informações Básicas */}
        <div>
          <label className="block text-lg font-semibold mb-2">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 rounded px-4 py-2 text-white h-24"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">
            Nível de Educação
          </label>
          <select
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
          >
            <option value="ENSINO_FUNDAMENTAL">Ensino Fundamental</option>
            <option value="ENSINO_MEDIO">Ensino Médio</option>
          </select>
        </div>

        {/* Grade */}
        <div>
          <label className="block text-lg font-semibold mb-2">
            Grade (linha por linha)
          </label>
          <div className="space-y-2">
            {gridRows.map((row, i) => (
              <input
                key={i}
                type="text"
                value={row}
                onChange={(e) => handleGridChange(i, e.target.value)}
                placeholder={`Linha ${i + 1} (ex: CATDOGS)`}
                className="w-full bg-gray-700 rounded px-4 py-2 text-white font-mono"
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Digite as letras sem espaços. Use apenas letras maiúsculas.
          </p>
        </div>

        {/* Palavras */}
        <div>
          <label className="block text-lg font-semibold mb-2">
            Palavras para encontrar
          </label>
          <div className="space-y-2">
            {words.map((word, i) => (
              <input
                key={i}
                type="text"
                value={word}
                onChange={(e) => handleWordChange(i, e.target.value)}
                placeholder={`Palavra ${i + 1}`}
                className="w-full bg-gray-700 rounded px-4 py-2 text-white font-mono"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setWords([...words, ""])}
            className="mt-2 text-blue-400 hover:text-blue-300"
          >
            + Adicionar palavra
          </button>
        </div>

        <div className="bg-black/30 rounded-xl p-4">
          <ActivityMediaEditor value={media} onChange={setMedia} />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold text-white transition-all"
        >
          Criar Caça Palavras
        </button>
      </form>
    </div>
  );
}
