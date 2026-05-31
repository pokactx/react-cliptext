# React ClipText

Lightweight React clipboard utilities for TypeScript projects.

This package provides:

- `CopyToClipboard` component for click/keyboard-triggered copy behavior
- `useCopyToClipboard` hook built on the Clipboard API

## Installation

```bash
bun add react-cliptext
```

## Choosing an API

The two exports use **different copy implementations**. Pick based on browser support and how you want to handle success/failure.

|                  | `CopyToClipboard`                                                             | `useCopyToClipboard`                                                                                       |
| ---------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Implementation   | [`copy-to-clipboard`](https://www.npmjs.com/package/copy-to-clipboard) (sync) | [`navigator.clipboard`](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) (async)            |
| Best for         | Maximum compatibility, legacy/fallback copy flows                             | Modern apps in a [secure context](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security) |
| Success signal   | `onCopy(text, result)` callback                                               | `Promise<boolean>` from `copy()`                                                                           |
| State            | None (controlled by you)                                                      | `copiedText` in hook state                                                                                 |
| Extra dependency | Yes (`copy-to-clipboard` at runtime)                                          | No                                                                                                         |

Use the **component** when you need broader browser support or a declarative trigger element. Use the **hook** when you already control the button and target environments with Clipboard API support (typically HTTPS + user gesture).

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
- `onCopy?: (text: string, result: boolean) => void`: Called after each copy attempt (component-level; not `options.onCopy` from the underlying library).
- `options?: CopyToClipboardOptions`: Forwarded to `copy-to-clipboard` (`debug`, `message`, `format` only).
- `onClick?: (event) => void`: Additional click handler merged with child handlers.
- `onKeyDown?: (event) => void`: Additional keydown handler merged with child handlers.
- `ref?`: Merged with the child element ref (does not replace the child ref).
- Other `HTMLAttributes` (for example `className`, `id`, `data-*`) are merged onto the child.

### `CopyToClipboardOptions`

Aligned with [`copy-to-clipboard` options](https://github.com/sudodoki/copy-to-clipboard#api), except `onCopy` on the library options object is **not** exposed—use the component `onCopy` prop instead.

- `debug?: boolean`
- `message?: string`
- `format?: string`

### `useCopyToClipboard`

- Returns: `[copiedText, copy]`
- `copiedText: string | null`: Last successfully copied text. Reset to `null` if a later copy attempt fails.
- `copy: (text: string) => Promise<boolean>`: Resolves `true` on success, `false` on failure. Logs a warning to the console when the Clipboard API is missing or the write fails.

Requires a [secure context](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security) and often a user gesture (for example a click handler).

## Behavior Notes

### Supported trigger elements

- **Native `<button>`**: Keyboard activation uses the browser’s default click behavior, so copy runs via `onClick` and the child’s `onClick` still runs.
- **Custom `role="button"`** (with `tabIndex={0}` recommended): Copy runs on `Enter` and `Space`. Child `onKeyDown` runs; child `onClick` does **not** run from keyboard-only activation (only from pointer click).
- **`<input type="button">` / `<input type="submit">`**: Treated like custom controls for keyboard handling (`Enter` / `Space` copy via `onKeyDown`, not synthesized `onClick`).
- **Other elements** (for example `<a>`): Pointer click copies; keyboard behavior depends on the element—add `role="button"` and `tabIndex` if you need explicit keyboard copy.

### Handler order (pointer click)

On click: copy → `CopyToClipboard` `onClick` → child `onClick`.

### Refs

`ref` on `CopyToClipboard` is merged with the child ref so both receive the DOM node.

## Compatibility

- React `>=18`
- TypeScript types included
- ESM/CJS exports

## Publishing (npm)

CI publishes on tag `v*` via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (no long-lived `NPM_TOKEN`).

1. On [npm](https://www.npmjs.com/), open **Access** → **Trusted Publishers** (or the package settings after the first publish).
2. Add **GitHub Actions**:
   - Repository: `pokactx/react-cliptext`
   - Workflow filename: `publish.yml`
   - Environment name: `npm-publish` (must match [`.github/workflows/publish.yml`](.github/workflows/publish.yml))
3. In GitHub: **Settings** → **Environments** → create `npm-publish` (optional protection rules).
4. Tag and push: `git tag v1.0.0 && git push origin v1.0.0`

Local publish (requires login):

```bash
npm login
bun run build
npm publish --access public
```

## Development

```bash
bun install
bunx lefthook install
bun run test --run
```

## Commits

This repository uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are checked locally (Lefthook `commit-msg`) and in CI (`commitlint`).

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`.

Examples:

```
feat: add reset helper to useCopyToClipboard
fix(copy): merge refs on CopyToClipboard child
docs: clarify Clipboard API requirements
```
