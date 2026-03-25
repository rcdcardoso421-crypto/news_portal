import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";

describe("useInfiniteScroll", () => {
  let scrollListener: ((event: Event) => void) | null = null;

  beforeEach(() => {
    // Mock window.addEventListener
    vi.spyOn(window, "addEventListener").mockImplementation((event, listener) => {
      if (event === "scroll") {
        scrollListener = listener as (event: Event) => void;
      }
    });

    // Mock window.removeEventListener
    vi.spyOn(window, "removeEventListener").mockImplementation(() => {});

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      bottom: 100,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call onLoadMore when scrolling near bottom", () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        threshold: 200,
        isLoading: false,
        hasMore: true,
      })
    );

    // Simulate scroll event
    if (scrollListener) {
      scrollListener(new Event("scroll"));
    }

    expect(onLoadMore).toHaveBeenCalled();
  });

  it("should not call onLoadMore when isLoading is true", () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        threshold: 200,
        isLoading: true,
        hasMore: true,
      })
    );

    // Simulate scroll event
    if (scrollListener) {
      scrollListener(new Event("scroll"));
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when hasMore is false", () => {
    const onLoadMore = vi.fn();

    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        threshold: 200,
        isLoading: false,
        hasMore: false,
      })
    );

    // Simulate scroll event
    if (scrollListener) {
      scrollListener(new Event("scroll"));
    }

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should respect custom threshold", () => {
    const onLoadMore = vi.fn();

    // Mock getBoundingClientRect with bottom far from viewport
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      bottom: window.innerHeight + 500,
      top: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }));

    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        threshold: 200,
        isLoading: false,
        hasMore: true,
      })
    );

    // Simulate scroll event
    if (scrollListener) {
      scrollListener(new Event("scroll"));
    }

    // Should not trigger because bottom is too far
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should return a ref", () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        threshold: 200,
        isLoading: false,
        hasMore: true,
      })
    );

    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty("current");
  });
});
