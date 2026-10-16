import { useState, useCallback } from "react";
import { api } from "../api";

export interface UseApiOptions {
  onError?: (error: string) => void;
  onSuccess?: (data: any) => void;
}

export function useApi<T = any>(options?: UseApiOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      method: "get" | "post" | "put" | "delete",
      url: string,
      payload?: any
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api[method](url, payload);
        const result = response.data;

        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        let errorMessage = "Erro ao processar requisição";

        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "object" && err !== null) {
          const errorObj = err as Record<string, any>;
          errorMessage =
            errorObj.response?.data?.message ||
            errorObj.message ||
            "Erro desconhecido";
        }

        setError(errorMessage);
        options?.onError?.(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const get = useCallback(
    (url: string) => execute("get", url),
    [execute]
  );

  const post = useCallback(
    (url: string, payload: any) => execute("post", url, payload),
    [execute]
  );

  const put = useCallback(
    (url: string, payload: any) => execute("put", url, payload),
    [execute]
  );

  const del = useCallback(
    (url: string) => execute("delete", url),
    [execute]
  );

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
}
