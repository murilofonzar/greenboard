import { useEffect, useRef, useState } from "react";
import { getErrorMessage, mediaUrl, uploadMedia } from "../api";
import type { ActivityMedia, MediaType, MediaUploadResponse } from "../types";

const ACCEPT: Record<MediaType, string> = {
  IMAGE: "image/jpeg,image/png,image/gif,image/webp",
  AUDIO: "audio/mpeg,audio/wav,audio/x-wav,audio/ogg,audio/webm,audio/mp4,audio/x-m4a,audio/aac,.mp3,.wav,.ogg,.m4a,.aac,.webm",
};

const MAX_SIZE_MB = 10;

interface MediaUploadButtonProps {
  type: MediaType;
  label: string;
  onUploaded: (media: MediaUploadResponse) => void;
  className?: string;
}

export function MediaUploadButton({
  type,
  label,
  onUploaded,
  className = "bg-purple-700 hover:bg-purple-600",
}: MediaUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Arquivo maior que ${MAX_SIZE_MB} MB`);
      return;
    }

    try {
      setUploading(true);
      onUploaded(await uploadMedia(file));
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao enviar arquivo"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="inline-flex flex-col">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[type]}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`${className} px-4 py-2 rounded-xl disabled:opacity-50`}
      >
        {uploading ? "Enviando..." : label}
      </button>
      {error && <span className="text-red-300 text-sm mt-1">{error}</span>}
    </div>
  );
}

interface AudioRecorderButtonProps {
  onUploaded: (media: MediaUploadResponse) => void;
  className?: string;
}

function AudioRecorderButton({
  onUploaded,
  className = "bg-red-700 hover:bg-red-600",
}: AudioRecorderButtonProps) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const releaseMicrophone = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const startRecording = async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Este navegador não oferece suporte à gravação de áudio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const supportedMimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType));
      const recorder = new MediaRecorder(
        stream,
        supportedMimeType ? { mimeType: supportedMimeType } : undefined,
      );
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        setRecording(false);
        releaseMicrophone();

        const recordedMimeType =
          recorder.mimeType || chunksRef.current[0]?.type || "audio/webm";
        const mimeType = recordedMimeType.startsWith("audio/mp4")
          ? "audio/mp4"
          : "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`Gravação maior que ${MAX_SIZE_MB} MB`);
          return;
        }

        const extension = mimeType.includes("mp4") ? "m4a" : "webm";
        const file = new File([blob], `gravacao-${Date.now()}.${extension}`, {
          type: mimeType,
        });
        try {
          setUploading(true);
          onUploaded(await uploadMedia(file));
        } catch (err) {
          setError(getErrorMessage(err, "Erro ao enviar gravação"));
        } finally {
          setUploading(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      releaseMicrophone();
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Permita o acesso ao microfone para gravar."
          : "Não foi possível iniciar a gravação.",
      );
    }
  };

  return (
    <div className="inline-flex flex-col">
      <button
        type="button"
        disabled={uploading}
        onClick={() => {
          if (recording) recorderRef.current?.stop();
          else void startRecording();
        }}
        className={`${className} px-4 py-2 rounded-xl disabled:opacity-50`}
      >
        {uploading
          ? "Enviando gravação..."
          : recording
            ? "Parar e enviar gravação"
            : "Gravar áudio"}
      </button>
      {error && <span className="text-red-300 text-sm mt-1">{error}</span>}
    </div>
  );
}

interface MediaViewProps {
  type: MediaType;
  url: string;
  caption?: string | null;
}

export function MediaView({ type, url, caption }: MediaViewProps) {
  return (
    <figure className="bg-black/20 rounded-xl p-3">
      {type === "IMAGE" ? (
        <img
          src={mediaUrl(url)}
          alt={caption || "Imagem da atividade"}
          className="max-h-80 w-auto mx-auto rounded-lg object-contain"
          loading="lazy"
        />
      ) : (
        <audio controls preload="none" src={mediaUrl(url)} className="w-full">
          Seu navegador não suporta áudio.
        </audio>
      )}
      {caption && (
        <figcaption className="text-sm text-gray-300 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function MediaGallery({ media }: { media?: ActivityMedia[] }) {
  if (!media?.length) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      {media.map((m, i) => (
        <MediaView key={m.id ?? i} type={m.type} url={m.url} caption={m.caption} />
      ))}
    </div>
  );
}

interface ActivityMediaEditorProps {
  value: ActivityMedia[];
  onChange: (media: ActivityMedia[]) => void;
}

export function ActivityMediaEditor({ value, onChange }: ActivityMediaEditorProps) {
  const add = (uploaded: MediaUploadResponse) =>
    onChange([
      ...value,
      { type: uploaded.type, url: uploaded.url, mimeType: uploaded.mimeType, caption: "" },
    ]);

  const updateCaption = (index: number, caption: string) =>
    onChange(value.map((m, i) => (i === index ? { ...m, caption } : m)));

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Imagens e áudios da atividade</h2>
      <p className="text-sm text-gray-300">
        Os alunos verão as imagens e poderão ouvir os áudios antes de responder.
        Formatos: JPG, PNG, GIF, WEBP, MP3, WAV, OGG, M4A (até {MAX_SIZE_MB} MB).
      </p>

      {value.map((m, i) => (
        <div key={`${m.url}-${i}`} className="bg-white/10 rounded-xl p-3 space-y-2">
          <MediaView type={m.type} url={m.url} />
          <div className="flex gap-2">
            <input
              placeholder="Legenda (opcional)"
              className="flex-1 p-2 rounded-lg bg-white text-black"
              value={m.caption ?? ""}
              maxLength={255}
              onChange={(e) => updateCaption(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="bg-red-700 hover:bg-red-600 px-4 rounded-lg"
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <MediaUploadButton type="IMAGE" label="+ Adicionar imagem" onUploaded={add} />
        <MediaUploadButton type="AUDIO" label="+ Adicionar áudio" onUploaded={add} />
        <AudioRecorderButton
          onUploaded={add}
          className="bg-red-700 hover:bg-red-600"
        />
      </div>
    </div>
  );
}

interface QuestionMediaEditorProps {
  imageUrl?: string | null;
  audioUrl?: string | null;
  onChange: (field: "imageUrl" | "audioUrl", value: string | null) => void;
}

export function QuestionMediaEditor({ imageUrl, audioUrl, onChange }: QuestionMediaEditorProps) {
  return (
    <div className="space-y-3">
      {imageUrl && (
        <div className="space-y-2">
          <MediaView type="IMAGE" url={imageUrl} />
          <button
            type="button"
            onClick={() => onChange("imageUrl", null)}
            className="text-red-300 text-sm underline"
          >
            Remover imagem
          </button>
        </div>
      )}

      {audioUrl && (
        <div className="space-y-2">
          <MediaView type="AUDIO" url={audioUrl} />
          <button
            type="button"
            onClick={() => onChange("audioUrl", null)}
            className="text-red-300 text-sm underline"
          >
            Remover áudio
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <MediaUploadButton
          type="IMAGE"
          label={imageUrl ? "Trocar imagem" : "+ Imagem na questão"}
          className="bg-indigo-700 hover:bg-indigo-600"
          onUploaded={(m) => onChange("imageUrl", m.url)}
        />
        <MediaUploadButton
          type="AUDIO"
          label={audioUrl ? "Trocar áudio" : "+ Áudio na questão"}
          className="bg-indigo-700 hover:bg-indigo-600"
          onUploaded={(m) => onChange("audioUrl", m.url)}
        />
        <AudioRecorderButton
          onUploaded={(m) => onChange("audioUrl", m.url)}
          className="bg-red-700 hover:bg-red-600"
        />
      </div>
    </div>
  );
}
