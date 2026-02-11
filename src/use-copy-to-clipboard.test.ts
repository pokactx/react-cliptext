import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useCopyToClipboard } from "./use-copy-to-clipboard";

const setClipboard = (writeTextImpl?: (value: string) => Promise<void>) => {
  const writeText = writeTextImpl ?? vi.fn().mockResolvedValue({});

  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });

  return writeText;
};

describe("use-copy-to-clipboard", () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: originalClipboard,
    });
  });

  it("returns initial state and copy function", () => {
    setClipboard();
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current[0]).toBeNull();
    expectTypeOf(result.current[1]).toBeFunction();
  });

  it("copies text and updates state", async () => {
    const writeText = setClipboard();
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current[1]("hello");
    });

    expect(writeText).toHaveBeenCalledWith("hello");
    expect(result.current[0]).toBe("hello");
  });

  it("returns false when clipboard write fails", async () => {
    const error = new Error("Copy failed");
    setClipboard(vi.fn().mockRejectedValue(error));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useCopyToClipboard());

    let success = true;
    await act(async () => {
      success = await result.current[1]("hello");
    });

    expect(success).toBeFalsy();
    expect(result.current[0]).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith("Copy failed", error);
  });

  it("returns false when clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() => useCopyToClipboard());

    let success = true;
    await act(async () => {
      success = await result.current[1]("hello");
    });

    expect(success).toBeFalsy();
    expect(result.current[0]).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith("Clipboard not supported");
  });
});
