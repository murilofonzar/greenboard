import { useState } from "react";
import { api, setAuthToken } from "../api";
import { saveAuth } from "../auth";
import Button from "../components/Button";

interface GuestStudent {
  name: string;
  gradeGroup: "ANOS_INICIAIS" | "ANOS_FINAIS";
  grade: string;
}

interface LoginProps {
  onLogin: () => void;
  onGuest: (student: GuestStudent) => void;
  goRegister: () => void;
}

export default function Login({ onLogin, onGuest, goRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestGradeGroup, setGuestGradeGroup] = useState<GuestStudent["gradeGroup"]>("ANOS_INICIAIS");
  const [guestGrade, setGuestGrade] = useState("PRIMEIRO_ANO");
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { email, password });
    saveAuth(res.data);
    setAuthToken(res.data.access_token);
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <h1 className="chalk text-4xl text-center mb-6">
          Greenboard
        </h1>

        <input
          className="w-full mb-3 p-3 rounded bg-white/90"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 rounded bg-white/90"
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Entrar</Button>

        {showGuestForm ? (
          <div className="mt-6 border-t border-white/20 pt-5">
            <h2 className="text-white text-lg font-semibold mb-3">
              Entrar sem conta
            </h2>
            <input
              className="w-full mb-3 p-3 rounded bg-white/90"
              placeholder="Nome do aluno"
              value={guestName}
              maxLength={100}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <select
              className="w-full mb-3 p-3 rounded bg-white/90"
              value={guestGradeGroup}
              onChange={(e) => {
                const group = e.target.value as GuestStudent["gradeGroup"];
                setGuestGradeGroup(group);
                setGuestGrade(group === "ANOS_INICIAIS" ? "PRIMEIRO_ANO" : "SEXTO_ANO");
              }}
            >
              <option value="ANOS_INICIAIS">Ensino Fundamental — Anos Iniciais</option>
              <option value="ANOS_FINAIS">Ensino Fundamental — Anos Finais</option>
            </select>
            <select
              className="w-full mb-3 p-3 rounded bg-white/90"
              value={guestGrade}
              onChange={(e) => setGuestGrade(e.target.value)}
            >
              {(
                guestGradeGroup === "ANOS_INICIAIS"
                  ? [
                      ["PRIMEIRO_ANO", "1º ano"],
                      ["SEGUNDO_ANO", "2º ano"],
                      ["TERCEIRO_ANO", "3º ano"],
                      ["QUARTO_ANO", "4º ano"],
                      ["QUINTO_ANO", "5º ano"],
                    ]
                  : [
                      ["SEXTO_ANO", "6º ano"],
                      ["SETIMO_ANO", "7º ano"],
                      ["OITAVO_ANO", "8º ano"],
                      ["NONO_ANO", "9º ano"],
                    ]
              ).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <Button
              onClick={() => {
                const name = guestName.trim();
                if (!name) {
                  alert("Informe seu nome");
                  return;
                }
                onGuest({
                  name,
                  gradeGroup: guestGradeGroup,
                  grade: guestGrade,
                });
              }}
            >
              Continuar sem login
            </Button>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowGuestForm(true)}
              className="text-white underline text-sm"
            >
              Entrar sem login (aluno sem conta)
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={goRegister}
            className="text-white underline text-sm"
          >
            Não tem conta? Registrar
          </button>
        </div>
      </div>
    </div>
  );
}