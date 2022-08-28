import { useEffect, useMemo } from "react";

export const useMounted = () => {
  const mounted = useMemo(() => ({ current: true }), []);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, [mounted]);
  return mounted;
};
