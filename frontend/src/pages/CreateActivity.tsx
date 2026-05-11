import { useState } from "react";
import { api } from "../api";
import { getAuth } from "../auth";
import Card from "../components/Card";

export default function CreateActivity() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [educationLevel, setEducationLevel] =
    useState("ENSINO_FUNDAMENTAL");

  const [gradeGroup, setGradeGroup] =
    useState("ANOS_INICIAIS");

  const [grade, setGrade] =
    useState("PRIMEIRO_ANO");

  const [highSchoolYear, setHighSchoolYear] =
    useState("PRIMEIRO");

  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        statement: "",
        options: ["", "", "", ""],
        answer: 0,
      },
    ]);
  };

  const updateQuestion = (
    index: number,
    field: string,
    value: any,
  ) => {
    const updated = [...questions];

    updated[index][field] = value;

    setQuestions(updated);
  };

  const updateOption = (
    qIndex: number,
    oIndex: number,
    value: string,
  ) => {
    const updated = [...questions];

    updated[qIndex].options[oIndex] = value;

    setQuestions(updated);
  };

  const save = async () => {
    const auth = getAuth();

    const payload = {
      title,
      description,

      educationLevel,

      gradeGroup:
        educationLevel === "ENSINO_FUNDAMENTAL"
          ? gradeGroup
          : "ENSINO_MEDIO",

      grade:
        educationLevel === "ENSINO_FUNDAMENTAL"
          ? grade
          : null,

      highSchoolYear:
        educationLevel === "ENSINO_MEDIO"
          ? highSchoolYear
          : null,

      professorId: auth.user.id,

      questions,
    };

    console.log(payload);

    await api.post("/activities", payload);

    alert("Atividade criada!");
  };

  return (
    <div className="p-8 text-white min-h-screen">

      <h1 className="text-4xl chalk mb-8">
        Criar atividade
      </h1>

      <Card>

        <div className="space-y-5">

          <input
            placeholder="Título da atividade"
            className="
              w-full
              p-4
              rounded-xl
              bg-white
              text-black
            "
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Descrição"
            className="
              w-full
              p-4
              rounded-xl
              bg-white
              text-black
              min-h-32
            "
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <div className="grid md:grid-cols-2 gap-4">

            <select
              className="
                p-4
                rounded-xl
                bg-white
                text-black
              "
              value={educationLevel}
              onChange={(e) =>
                setEducationLevel(e.target.value)
              }
            >
              <option value="ENSINO_FUNDAMENTAL">
                Ensino Fundamental
              </option>

              <option value="ENSINO_MEDIO">
                Ensino Médio
              </option>
            </select>

            {educationLevel ===
            "ENSINO_FUNDAMENTAL" ? (
              <>
                <select
                  className="
                    p-4
                    rounded-xl
                    bg-white
                    text-black
                  "
                  value={gradeGroup}
                  onChange={(e) =>
                    setGradeGroup(e.target.value)
                  }
                >
                  <option value="ANOS_INICIAIS">
                    Anos iniciais
                  </option>

                  <option value="ANOS_FINAIS">
                    Anos finais
                  </option>
                </select>

                <select
                  className="
                    p-4
                    rounded-xl
                    bg-white
                    text-black
                  "
                  value={grade}
                  onChange={(e) =>
                    setGrade(e.target.value)
                  }
                >
                  <option value="PRIMEIRO_ANO">
                    1º ano
                  </option>

                  <option value="SEGUNDO_ANO">
                    2º ano
                  </option>

                  <option value="TERCEIRO_ANO">
                    3º ano
                  </option>

                  <option value="QUARTO_ANO">
                    4º ano
                  </option>

                  <option value="QUINTO_ANO">
                    5º ano
                  </option>

                  <option value="SEXTO_ANO">
                    6º ano
                  </option>

                  <option value="SETIMO_ANO">
                    7º ano
                  </option>

                  <option value="OITAVO_ANO">
                    8º ano
                  </option>

                  <option value="NONO_ANO">
                    9º ano
                  </option>
                </select>
              </>
            ) : (
              <select
                className="
                  p-4
                  rounded-xl
                  bg-white
                  text-black
                "
                value={highSchoolYear}
                onChange={(e) =>
                  setHighSchoolYear(
                    e.target.value,
                  )
                }
              >
                <option value="PRIMEIRO">
                  1º ano
                </option>

                <option value="SEGUNDO">
                  2º ano
                </option>

                <option value="TERCEIRO">
                  3º ano
                </option>
              </select>
            )}

          </div>

        </div>

      </Card>

      <div className="space-y-6 mt-8">

        {questions.map((q, i) => (
          <Card key={i}>

            <div className="space-y-5">

              <h2 className="text-2xl font-bold">
                Questão {i + 1}
              </h2>

              <input
                placeholder="Pergunta"
                className="
                  w-full
                  p-4
                  rounded-xl
                  bg-white
                  text-black
                "
                value={q.statement}
                onChange={(e) =>
                  updateQuestion(
                    i,
                    "statement",
                    e.target.value,
                  )
                }
              />

              <div className="grid md:grid-cols-2 gap-4">

                {q.options.map(
                  (
                    option: string,
                    j: number,
                  ) => (
                    <div
                      key={j}
                      className="
                        bg-white/10
                        p-3
                        rounded-xl
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <input
                        type="radio"
                        checked={q.answer === j}
                        onChange={() =>
                          updateQuestion(
                            i,
                            "answer",
                            j,
                          )
                        }
                      />

                      <input
                        placeholder={`Alternativa ${
                          j + 1
                        }`}
                        className="
                          flex-1
                          p-3
                          rounded-lg
                          bg-white
                          text-black
                        "
                        value={option}
                        onChange={(e) =>
                          updateOption(
                            i,
                            j,
                            e.target.value,
                          )
                        }
                      />

                    </div>
                  ),
                )}

              </div>

            </div>

          </Card>
        ))}

      </div>

      <div className="flex gap-4 mt-8">

        <button
          onClick={addQuestion}
          className="
            bg-blue-600
            hover:bg-blue-500
            px-6
            py-4
            rounded-xl
          "
        >
          + Adicionar questão
        </button>

        <button
          onClick={save}
          className="
            bg-green-700
            hover:bg-green-600
            px-6
            py-4
            rounded-xl
          "
        >
          Salvar atividade
        </button>

      </div>
    </div>
  );
}