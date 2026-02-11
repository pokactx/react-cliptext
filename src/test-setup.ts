import "@testing-library/jest-dom";
import { vi } from "vitest";

// eslint-disable-next-line jest/no-untyped-mock-factory
vi.mock("copy-to-clipboard", () => ({
  default: vi.fn(),
}));
