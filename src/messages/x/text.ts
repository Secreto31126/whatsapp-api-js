import * as M from "../index.js";

/**
 * @example
 * ```tsx
 * <Text>Hello World!</Text>
 * ```
 *
 * @see {M.Text}
 * @returns A Text message
 */
export function Text({
  children: body,
  preview_url,
}: {
  children: string;
  preview_url: boolean;
}) {
  return new M.Text(body, preview_url);
}
