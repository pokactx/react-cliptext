# React ClipText

Lightweight React clipboard utilities for TypeScript projects.

This package provides:

- `CopyToClipboard` component for click/keyboard-triggered copy behavior
- `useCopyToClipboard` hook built on the Clipboard API

## Installation

```bash
bun add react-cliptext
```

## Quick Start

### `CopyToClipboard`

```tsx
import { CopyToClipboard } from "react-cliptext";

function App() {
  return (
    <CopyToClipboard
      text="Hello World!"
      onCopy={(text, result) => {
        console.log("Copied:", text, result);
      }}
    >
      <button type="button">Copy to clipboard</button>
    </CopyToClipboard>
  );
}
```

### `useCopyToClipboard`

```tsx
import { useCopyToClipboard } from "react-cliptext";

function App() {
  const [copiedText, copy] = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={async () => {
        await copy("Hello World!");
      }}
    >
      {copiedText ? `Copied: ${copiedText}` : "Copy text"}
    </button>
  );
}
```

## API

### `CopyToClipboard` Props

- `text: string`: Text to copy.
- `children: ReactElement`: A single React element used as the trigger.
- `onCopy?: (text: string, result: boolean) => void`: Called after each copy attempt.
- `options?: CopyToClipboardOptions`: Forwarded to `copy-to-clipboard`.
- `onClick?: (event) => void`: Additional click handler merged with child handlers.
- `onKeyDown?: (event) => void`: Additional keydown handler merged with child handlers.

### `CopyToClipboardOptions`

- `debug?: boolean`
- `message?: string`
- `format?: string`

### `useCopyToClipboard`

- Returns: `[copiedText, copy]`
- `copiedText: string | null`: Last successfully copied text.
- `copy: (text: string) => Promise<boolean>`: Resolves `true` on success, `false` on failure.

## Behavior Notes

- Native `<button>` elements use browser-default keyboard-to-click behavior.
- Custom elements with `role="button"` trigger copy on `Enter` and `Space`.
- Child `onClick` and `onKeyDown` handlers are preserved.

## Compatibility

- React `>=18`
- TypeScript types included
- ESM/CJS exports
