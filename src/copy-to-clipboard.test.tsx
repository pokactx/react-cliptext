import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import copy from "copy-to-clipboard";

import { CopyToClipboard } from "./copy-to-clipboard";

const mockCopy = vi.mocked(copy);

describe("copy-to-clipboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    mockCopy.mockReset();
  });

  it("renders single child", () => {
    render(
      <CopyToClipboard text="hello">
        <button type="button">copy</button>
      </CopyToClipboard>
    );

    expect(screen.getByRole("button", { name: "copy" })).toBeVisible();
  });

  it("invokes copy with text on click", async () => {
    mockCopy.mockReturnValue(true);

    render(
      <CopyToClipboard text="hello">
        <button type="button">copy</button>
      </CopyToClipboard>
    );

    await user.click(screen.getByRole("button", { name: "copy" }));

    expect(mockCopy).toHaveBeenCalledWith("hello", undefined);
  });

  it("passes options to copy", async () => {
    mockCopy.mockReturnValue(true);
    const options = { format: "text/plain" };

    render(
      <CopyToClipboard text="hello" options={options}>
        <button type="button">copy</button>
      </CopyToClipboard>
    );

    await user.click(screen.getByRole("button", { name: "copy" }));

    expect(mockCopy).toHaveBeenCalledWith("hello", options);
  });

  it("calls onCopy callback", async () => {
    mockCopy.mockReturnValue(true);
    const onCopy = vi.fn();

    render(
      <CopyToClipboard text="hello" onCopy={onCopy}>
        <button type="button">copy</button>
      </CopyToClipboard>
    );

    await user.click(screen.getByRole("button", { name: "copy" }));

    expect(onCopy).toHaveBeenCalledWith("hello", true);
  });

  it("preserves child onClick after copy", async () => {
    mockCopy.mockReturnValue(true);
    const onCopy = vi.fn();
    const childOnClick = vi.fn();

    render(
      <CopyToClipboard text="hello" onCopy={onCopy}>
        <button type="button" onClick={childOnClick}>
          copy
        </button>
      </CopyToClipboard>
    );

    await user.click(screen.getByRole("button", { name: "copy" }));

    const [copyCall] = mockCopy.mock.invocationCallOrder;
    const [onCopyCall] = onCopy.mock.invocationCallOrder;
    const [childCall] = childOnClick.mock.invocationCallOrder;

    expect(copyCall).toBeLessThan(onCopyCall);
    expect(onCopyCall).toBeLessThan(childCall);
  });

  it("preserves child onClick for Enter key on native button", async () => {
    mockCopy.mockReturnValue(true);
    const childOnClick = vi.fn();

    render(
      <CopyToClipboard text="hello">
        <button type="button" onClick={childOnClick}>
          copy
        </button>
      </CopyToClipboard>
    );

    const button = screen.getByRole("button", { name: "copy" });
    button.focus();
    await user.keyboard("{Enter}");

    expect(mockCopy).toHaveBeenCalledOnce();
    expect(childOnClick).toHaveBeenCalledOnce();
  });

  it("copies on Enter key for custom role button", async () => {
    mockCopy.mockReturnValue(true);
    const childOnKeyDown = vi.fn();

    render(
      <CopyToClipboard text="hello">
        <div role="button" tabIndex={0} onKeyDown={childOnKeyDown}>
          copy
        </div>
      </CopyToClipboard>
    );

    const button = screen.getByRole("button", { name: "copy" });
    button.focus();
    await user.keyboard("{Enter}");

    expect(mockCopy).toHaveBeenCalledOnce();
    expect(childOnKeyDown).toHaveBeenCalledOnce();
  });

  it("throws for multiple children", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(
        // @ts-expect-error validating runtime behavior for invalid usage
        <CopyToClipboard text="hello">
          <button type="button">first</button>
          <button type="button">second</button>
        </CopyToClipboard>
      );
    }).toThrow(
      new Error(
        "React.Children.only expected to receive a single React element child."
      )
    );
  });
});
