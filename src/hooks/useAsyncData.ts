import { useEffect, useRef, useState } from "react";
import type { ApiState } from "@/types";

export function useAsyncData<T>(loader: () => Promise<T>, initialData: T) {
  const [state, setState] = useState<ApiState<T>>({ data: initialData, loading: true, error: null });
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    let active = true;
    initialDataRef.current = initialData;

    loader()
      .then((data) => {
        if (active) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({ data: initialDataRef.current, loading: false, error: error instanceof Error ? error.message : "Something went wrong" });
        }
      });

    return () => {
      active = false;
    };
  }, [loader]);

  return state;
}

