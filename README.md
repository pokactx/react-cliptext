# React ClipText

[![npm version](https://img.shields.io/npm/v/react-cliptext)](https://www.npmjs.com/package/react-cliptext)
[![license](https://img.shields.io/npm/l/react-cliptext)](https://github.com/pokactx/react-cliptext/blob/main/LICENSE)

Lightweight React clipboard utilities for TypeScript projects.

This package provides:

- `CopyToClipboard` — a wrapper component that triggers copy on click or keyboard interaction
- `useCopyToClipboard` — a hook built on the modern Clipboard API with legacy fallback

## Installation

```bash
npm install react-cliptext
yarn add react-cliptext
pnpm add react-cliptext
bun add react-cliptext
```

## Quick Start

### `CopyToClipboard`

Wrap any single element. The component handles `onClick` and keyboard events automatically.

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

Custom elements with `role="button"` also get `Enter` and `Space` keyboard support:

```tsx
<CopyToClipboard text="Hello World!">
  <div role="button" tabIndex={0}>
    Copy to clipboard
  </div>
</CopyToClipboard>
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

| Prop        | Type                                      | Description                                     |
| ----------- | ----------------------------------------- | ----------------------------------------------- |
| `text`      | `string`                                  | Text to copy.                                   |
| `children`  | `ReactElement`                            | A single React element used as the trigger.     |
| `onCopy`    | `(text: string, result: boolean) => void` | Called after each copy attempt.                 |
| `options`   | `CopyToClipboardOptions`                  | Forwarded to `copy-to-clipboard`.               |
| `onClick`   | `(event: MouseEvent) => void`             | Additional click handler merged with child's.   |
| `onKeyDown` | `(event: KeyboardEvent) => void`          | Additional keydown handler merged with child's. |

Also accepts any `React.HTMLAttributes<HTMLElement>` (except `onCopy`, `onClick`, `onKeyDown`).

### `CopyToClipboardOptions`

| Option    | Type      | Description                                                |
| --------- | --------- | ---------------------------------------------------------- |
| `debug`   | `boolean` | Enable debug logging.                                      |
| `message` | `string`  | Custom message for the clipboard prompt (legacy browsers). |
| `format`  | `string`  | MIME type for the clipboard data (e.g. `"text/plain"`).    |

### `useCopyToClipboard`

```ts
const [copiedText, copy] = useCopyToClipboard();
//     ^string|null  ^(text: string) => Promise<boolean>
```

| Return value | Type                                 | Description                                                              |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------ |
| `copiedText` | `string \| null`                     | Last successfully copied text, or `null` if nothing has been copied yet. |
| `copy`       | `(text: string) => Promise<boolean>` | Copies text and resolves `true` on success, `false` on failure.          |

## Behavior Notes

- Native `<button>` elements use browser-default keyboard-to-click behavior.
- Custom elements with `role="button"` trigger copy on `Enter` and `Space`.
- Child `onClick` and `onKeyDown` handlers are preserved and called after the copy.
- `className` props from the wrapper and child element are merged automatically.
- The hook prefers `navigator.clipboard.writeText()` and falls back to `copy-to-clipboard` when the Clipboard API is unavailable.

## Compatibility

- React `>=18` (React 19 fully supported)
- TypeScript types included
- ESM and CJS exports

## License

MIT
