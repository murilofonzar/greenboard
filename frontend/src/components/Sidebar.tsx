export default function Sidebar({ setPage, logout }: any) {
  return (
    <div className="w-64 h-screen bg-green-950 text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl chalk mb-6">Greenboard</h1>
        <div className="space-y-2">
          <button onClick={() => setPage("activities")} className="block">Atividades</button>
          <button onClick={() => setPage("create")} className="block">Criar</button>
        </div>
      </div>

      <button onClick={logout} className="text-red-400">Sair</button>
    </div>
  );
}