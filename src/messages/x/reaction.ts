import * as M from "../index.js";

export function Reaction({
  children: emoji,
  message_id,
}: {
  children?: string;
  message_id: string;
}) {
  return new M.Reaction(message_id, emoji ?? "");
}
