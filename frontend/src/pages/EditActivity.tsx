import { useState } from "react";
import { api } from "../api";

type Props = {
  activity: any;
  onBack: () => void;
};

export default function EditActivity({
  activity,
  onBack,
}: Props) {
  const [title, setTitle] = useState(
    activity?.title || ""
  );

  const [description, setDescription] = useState(
    activity?.description || ""
  );

  const save = async () => {
    try {
      await api.patch(
        `/activities/${activity.id}`,
        {
          title,
          description,
        }
      );

      alert("Atividade atualizada");
      onBack();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar atividade");
    }
  };

  const publish = async () => {
    try {
      await api.post(
        `/activities/${activity.id}/publish`
      );

      alert("Atividade publicada");
      onBack();
    } catch (error) {
      console.error(error);
      alert("Erro ao publicar atividade");
    }
  };

  if (!activity) {
    return (
      <div className="p-8 text-white">
        Nenhuma atividade selecionada.
      </div>
    );
  }

  return (
    <div className="p-8 text-white min-h-screen">

      <button
        onClick={onBack}
        className="mb-6 bg-gray-700 px-4 py-2 rounded"
      >
        Voltar
      </button>

      <h1 className="text-4xl chalk mb-8">
        Editar Atividade
      </h1>

      <div className="space-y-4">

        <div>
          <label className="block mb-2">
            Título
          </label>

          <input
            className="w-full p-3 rounded text-black"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div>
          <label className="block mb-2">
            Descrição
          </label>

          <textarea
            className="w-full p-3 rounded text-black"
            rows={6}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div className="flex gap-3">

          <button
            onClick={save}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded"
          >
            Salvar
          </button>

          <button
            onClick={publish}
            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded"
          >
            Publicar
          </button>

        </div>

      </div>
    </div>
  );
}