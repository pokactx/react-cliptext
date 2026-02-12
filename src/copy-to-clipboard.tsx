import type { JSX, ReactElement } from "react";

import copy from "copy-to-clipboard";
import React, { cloneElement } from "react";

/**
 * Options forwarded to `copy-to-clipboard` when executing the copy action.
 */
export interface CopyToClipboardOptions {
  /**
   * Enables debug mode for the underlying `copy-to-clipboard` library.
   */
  debug?: boolean;
  /**
   * Message shown by the browser in fallback copy flows.
   */
  message?: string;
  /**
   * MIME-like format hint passed to the copy implementation.
   */
  format?: string;
}

interface ChildCommonProps<E extends Element> {
  onClick?: (event: React.MouseEvent<E, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<E>) => void;
  className?: string;
  role?: string;
}

/**
 * Props for the `CopyToClipboard` component.
 */
export interface CopyToClipboardProps<
  E extends Element = HTMLElement,
  P = unknown,
> extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onCopy" | "onClick" | "onKeyDown"
> {
  text: string;
  children: ReactElement<P & ChildCommonProps<E>>;
  onCopy?: (text: string, result: boolean) => void;
  onClick?: (event: React.MouseEvent<E, MouseEvent>) => void;
  onKeyDown?: (event: React.KeyboardEvent<E>) => void;
  options?: CopyToClipboardOptions;
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
    const isCustomButton = !isNativeButton && elem.props.role === "button";

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
    [elem.props.className, props.className].filter(Boolean).join(" ") ||
    undefined;

  return cloneElement(elem, {
    ...elem.props,
    ...props,
    className: mergedClassName,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  });
};
