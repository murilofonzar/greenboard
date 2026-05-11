import { useState } from "react";
import { api } from "../api";
import Button from "../components/Button";

export default function Register({ goLogin }: any) {
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "ALUNO",
    birthDate: "",

    educationLevel: "ENSINO_FUNDAMENTAL",
    gradeGroup: "ANOS_INICIAIS",

    grade: "PRIMEIRO_ANO",
    highSchoolYear: "PRIMEIRO",
  });

  const handle = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    await api.post("/auth/register", form);

    alert("Registrado com sucesso!");
    goLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl w-full max-w-xl text-white">

        <h1 className="chalk text-4xl mb-6 text-center">
          Criar Conta
        </h1>

        <div className="space-y-3">

          <input
            name="name"
            placeholder="Nome"
            className="w-full p-3 rounded text-black"
            onChange={handle}
          />

          <input
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded text-black"
            onChange={handle}
          />

          <input
            name="password"
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded text-black"
            onChange={handle}
          />

          <input
            type="date"
            name="birthDate"
            className="w-full p-3 rounded text-black"
            onChange={handle}
          />

          <select
            name="role"
            className="w-full p-3 rounded text-black"
            onChange={handle}
          >
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
          </select>

          {form.role === "ALUNO" && (
            <>
              <select
                name="educationLevel"
                className="w-full p-3 rounded text-black"
                onChange={handle}
              >
                <option value="ENSINO_FUNDAMENTAL">
                  Ensino Fundamental
                </option>

                <option value="ENSINO_MEDIO">
                  Ensino Médio
                </option>
              </select>

              {form.educationLevel === "ENSINO_FUNDAMENTAL" && (
                <>
                  <select
                    name="gradeGroup"
                    className="w-full p-3 rounded text-black"
                    onChange={handle}
                  >
                    <option value="ANOS_INICIAIS">
                      Anos Iniciais
                    </option>

                    <option value="ANOS_FINAIS">
                      Anos Finais
                    </option>
                  </select>

                  <select
                    name="grade"
                    className="w-full p-3 rounded text-black"
                    onChange={handle}
                  >
                    <option value="PRIMEIRO_ANO">1º ano</option>
                    <option value="SEGUNDO_ANO">2º ano</option>
                    <option value="TERCEIRO_ANO">3º ano</option>
                    <option value="QUARTO_ANO">4º ano</option>
                    <option value="QUINTO_ANO">5º ano</option>
                    <option value="SEXTO_ANO">6º ano</option>
                    <option value="SETIMO_ANO">7º ano</option>
                    <option value="OITAVO_ANO">8º ano</option>
                    <option value="NONO_ANO">9º ano</option>
                  </select>
                </>
              )}

              {form.educationLevel === "ENSINO_MEDIO" && (
                <select
                  name="highSchoolYear"
                  className="w-full p-3 rounded text-black"
                  onChange={handle}
                >
                  <option value="PRIMEIRO">1º ano</option>
                  <option value="SEGUNDO">2º ano</option>
                  <option value="TERCEIRO">3º ano</option>
                </select>
              )}
            </>
          )}

          <Button onClick={register}>
            Registrar
          </Button>

          <button
            onClick={goLogin}
            className="underline text-sm"
          >
            Voltar
          </button>

        </div>
      </div>
    </div>
  );
}