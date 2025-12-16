import { useMediaQuery } from "./useMediaQuery";

const DEFAULT_MOBILE_QUERY = "(max-width: 900px), (pointer: coarse)";

export function useIsMobile(query = DEFAULT_MOBILE_QUERY) {
  return useMediaQuery(query);
}

