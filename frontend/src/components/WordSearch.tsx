import { useState } from "react";

interface WordSearchProps {
  grid: string[];
  words: string[];
  onSubmit: (foundWords: string[]) => void;
  loading?: boolean;
}

export default function WordSearch({
  grid,
  words,
  onSubmit,
  loading = false,
}: WordSearchProps) {
  const [foundWords, setFoundWords] = useState<string[]>([]);

  const toggleWord = (word: string) => {
    if (foundWords.includes(word)) {
      setFoundWords(foundWords.filter((w) => w !== word));
    } else {
      setFoundWords([...foundWords, word]);
    }
  };

  const handleSubmit = () => {
    onSubmit(foundWords);
  };

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="bg-gray-800 p-6 rounded-lg overflow-auto">
        <div className="font-mono text-sm text-white space-y-2">
          {grid.map((row, i) => (
            <div key={i} className="flex gap-4">
              {row.split("").map((letter, j) => (
                <span key={`${i}-${j}`} className="w-6 h-6 flex items-center justify-center border border-gray-600">
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Words List */}
      <div>
        <h3 className="text-xl font-bold mb-3">Palavras para encontrar:</h3>
        <div className="grid grid-cols-2 gap-3">
          {words.map((word) => (
            <button
              key={word}
              onClick={() => toggleWord(word)}
              className={`p-3 rounded text-center font-semibold transition-all ${
                foundWords.includes(word)
                  ? "bg-green-600 line-through"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-800 p-4 rounded">
        <p className="text-white">
          Encontradas: <span className="font-bold text-green-400">{foundWords.length}</span> de{" "}
          <span className="font-bold">{words.length}</span>
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(foundWords.length / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded font-bold text-white transition-all"
      >
        {loading ? "Enviando..." : "Enviar Respostas"}
      </button>
    </div>
  );
}
