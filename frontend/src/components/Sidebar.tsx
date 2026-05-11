import { getAuth } from "../auth";

export default function Sidebar({ setPage, logout }: any) {
  const auth = getAuth();

  const isProfessor = auth?.user?.role === "PROFESSOR";

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-green-950 to-green-900 text-white p-6 flex flex-col justify-between shadow-2xl">

      <div>
        <h1 className="text-3xl chalk mb-10">
          Greenboard
        </h1>

        <div className="space-y-3">

          <button
            onClick={() => setPage("activities")}
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              hover:bg-white/10
              transition
            "
          >
            Atividades
          </button>

          {isProfessor && (
            <button
              onClick={() => setPage("create")}
              className="
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                hover:bg-white/10
                transition
              "
            >
              Criar atividade
            </button>
          )}

        </div>
      </div>

      <button
        onClick={logout}
        className="
          bg-red-500/20
          hover:bg-red-500/40
          rounded-xl
          py-3
          transition
        "
      >
        Sair
      </button>
    </div>
  );
}