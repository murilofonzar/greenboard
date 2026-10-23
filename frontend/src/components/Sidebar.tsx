import { getAuth } from "../auth";

const GRADE_LABELS: Record<string, string> = {
  PRIMEIRO_ANO: "1º ano",
  SEGUNDO_ANO: "2º ano",
  TERCEIRO_ANO: "3º ano",
  QUARTO_ANO: "4º ano",
  QUINTO_ANO: "5º ano",
  SEXTO_ANO: "6º ano",
  SETIMO_ANO: "7º ano",
  OITAVO_ANO: "8º ano",
  NONO_ANO: "9º ano",
};

interface SidebarProps {
  setPage: (page: string) => void;
  logout: () => void;
  guestStudent?: {
    name: string;
    gradeGroup: "ANOS_INICIAIS" | "ANOS_FINAIS";
    grade: string;
  } | null;
}

export default function Sidebar({ setPage, logout, guestStudent }: SidebarProps) {
  const auth = getAuth();

  const isProfessor =
    auth?.user?.role === "PROFESSOR";

  return (
    <div className="w-64 min-h-screen bg-green-950 text-white p-6 flex flex-col justify-between shadow-2xl">
      <div>
        <h1 className="text-3xl chalk mb-10">
          Greenboard
        </h1>

        {guestStudent && (
          <p className="text-sm text-green-200 mb-5">
            {guestStudent.name}
            <br />
            {guestStudent.gradeGroup === "ANOS_INICIAIS"
              ? "Anos Iniciais"
              : "Anos Finais"} · {GRADE_LABELS[guestStudent.grade]}
          </p>
        )}

        <div className="space-y-3">

          <button
            onClick={() => setPage("activities")}
            className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
          >
            Atividades
          </button>

          {!isProfessor && !guestStudent && (
            <button
              onClick={() => setPage("results")}
              className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
            >
              Resultados
            </button>
          )}

          {isProfessor && (
            <>
              <button
                onClick={() => setPage("create")}
                className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
              >
                ➕ Múltipla Escolha
              </button>

              <button
                onClick={() => setPage("createWordSearch")}
                className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
              >
                🔤 Caça Palavras
              </button>

              <button
                onClick={() => setPage("submissions")}
                className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
              >
                📊 Respostas
              </button>
            </>
          )}

        </div>
      </div>

      <button
        onClick={logout}
        className="text-red-400 hover:text-red-300"
      >
        {guestStudent ? "Sair do modo sem login" : "Sair"}
      </button>
    </div>
  );
}