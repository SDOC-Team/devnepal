"use client";

import { useEffect, useState } from "react";

/**
 * Tracks a CSS media query from React state, for cases where the *markup*
 * must change rather than just its styling — hiding a wide table on phones,
 * for instance, so it is not merely invisible but absent from the DOM.
 *
 * Starts false so the server and the first client render agree; the effect
 * corrects it before paint.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
