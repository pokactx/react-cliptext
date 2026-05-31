import type { JSX, ReactElement, Ref } from "react";

import copy from "copy-to-clipboard";
import React, { cloneElement } from "react";

type CopyToClipboardLibOptions = NonNullable<Parameters<typeof copy>[1]>;

/**
 * Options forwarded to `copy-to-clipboard` when executing the copy action.
 * Excludes the library's `onCopy` callback; use the component `onCopy` prop instead.
 */
export type CopyToClipboardOptions = Omit<CopyToClipboardLibOptions, "onCopy">;

interface ChildCommonProps<E extends Element> {
  onClick?: (event: React.MouseEvent<E, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<E>) => void;
  className?: string;
  role?: string;
  type?: string;
  ref?: Ref<E>;
}

const mergeRefs =
  <T,>(...refs: (Ref<T> | undefined)[]): Ref<T> =>
  (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref !== null && ref !== undefined) {
        ref.current = value;
      }
    }
  };

/**
 * Props for the `CopyToClipboard` component.
 */
export interface CopyToClipboardProps<
  E extends Element = HTMLElement,
  P = unknown,
> extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onCopy" | "onClick" | "onKeyDown" | "ref"
> {
  text: string;
  children: ReactElement<P & ChildCommonProps<E>>;
  onCopy?: (text: string, result: boolean) => void;
  onClick?: (event: React.MouseEvent<E, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<E>) => void;
  options?: CopyToClipboardOptions;
  ref?: Ref<E>;
}

/**
 * React component that copies `text` to the clipboard when its child is activated.
 *
 * It clones the single `children` element and wires `onClick` / keyboard handling,
 * while still calling existing child handlers.
 */
export const CopyToClipboard = <E extends Element = HTMLElement, P = unknown>({
  text,
  children,
  onCopy,
  onClick,
  onKeyDown,
  options,
  ref: wrapperRef,
  className: wrapperClassName,
  ...props
}: CopyToClipboardProps<E, P>): JSX.Element => {
  const handleCopy = () => {
    const result = copy(text, options);
    onCopy?.(text, result);
  };

  const elem = React.Children.only(children) as ReactElement<
    P & ChildCommonProps<E>
  >;

  const handleClick = (event: React.MouseEvent<E, MouseEvent>) => {
    handleCopy();
    onClick?.(event);
    elem.props.onClick?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<E>) => {
    const isNativeButton = elem.type === "button";
    const isInputButton =
      elem.type === "input" &&
      (elem.props.type === "button" || elem.props.type === "submit");
    const isCustomButton =
      (!isNativeButton && elem.props.role === "button") || isInputButton;

    // Let native buttons handle keyboard interactions via their built-in click
    // behavior so child onClick handlers are preserved.
    if (isCustomButton && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleCopy();
    }
    onKeyDown?.(event);
    elem.props.onKeyDown?.(event);
  };

  const mergedClassName =
    [elem.props.className, wrapperClassName].filter(Boolean).join(" ") ||
    undefined;

  return cloneElement(elem, {
    ...elem.props,
    ...props,
    className: mergedClassName,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ref: mergeRefs(elem.props.ref, wrapperRef),
  });
};
