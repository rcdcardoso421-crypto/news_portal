import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  threshold?: number;
  isLoading?: boolean;
  hasMore?: boolean;
}

/**
 * Hook para implementar paginação infinita
 * Detecta quando o usuário rola para perto do final da página
 */
export function useInfiniteScroll({
  onLoadMore,
  threshold = 200,
  isLoading = false,
  hasMore = true,
}: UseInfiniteScrollOptions) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!observerTarget.current || isLoading || !hasMore) return;

    const element = observerTarget.current;
    const rect = element.getBoundingClientRect();

    // Se o elemento está a menos de `threshold` pixels do final da viewport
    if (rect.bottom <= window.innerHeight + threshold) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading, hasMore, threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return observerTarget;
}
