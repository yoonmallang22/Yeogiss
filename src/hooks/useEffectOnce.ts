import type { EffectCallback } from "react";
import { useEffect, useState } from "react";

const useEffectOnce = (effect: EffectCallback, dependencies: unknown[]) => {
  const [hasRun, setHasRun] = useState(false);
  useEffect(() => {
    if (!hasRun) {
      setHasRun(true);
      effect();
    }
  }, [hasRun, effect, dependencies]);
};

export default useEffectOnce;
