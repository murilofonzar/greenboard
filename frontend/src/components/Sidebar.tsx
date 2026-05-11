import { getAuth } from "../auth";

export default function Sidebar({ setPage, logout }: any) {
  const auth = getAuth();

  const isProfessor = auth?.user?.role === "PROFESSOR";

  return (
    <div className="w-64 min-h-screen bg-green-950 text-white p-6 flex flex-col justify-between shadow-2xl">
      <div>
        <h1 className="text-3xl chalk mb-10">
          Greenboard
        </h1>

        <div className="space-y-3">
          <button
            onClick={() => setPage("activities")}
            className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
          >
            Atividades
          </button>

          {!isProfessor && (
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
                Criar Atividade
              </button>

              <button
                onClick={() => setPage("submissions")}
                className="w-full text-left hover:bg-green-800 p-3 rounded-xl transition"
              >
                Respostas
              </button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={logout}
        className="text-red-400 hover:text-red-300"
      >
        Sair
      </button>
    </div>
  );
}