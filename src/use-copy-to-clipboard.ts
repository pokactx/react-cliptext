import copy from "copy-to-clipboard";
import { useCallback, useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>;

const writeToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn("Copy failed", error);
    return false;
  }
};

export const useCopyToClipboard = (): [CopiedValue, CopyFn] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copyFn: CopyFn = useCallback(async (text) => {
    if (navigator?.clipboard) {
      const success = await writeToClipboard(text);
      if (success) {
        setCopiedText(text);
      }
      return success;
    }

    const result = copy(text);
    if (result) {
      setCopiedText(text);
    }
    return result;
  }, []);

  return [copiedText, copyFn];
};
