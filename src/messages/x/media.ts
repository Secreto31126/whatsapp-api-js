import type { XOR } from "../../utils.js";

import * as M from "../index.js";

export type Resource = XOR<{ url: string }, { id: string }>;

export function Audio({ url, id, voice }: Resource & { voice: boolean }) {
  return new M.Audio(url ?? id, id !== undefined, voice);
}

export function Document({
  url,
  id,
  children: caption,
  filename,
}: Resource & { children?: string; filename?: string }) {
  return new M.Document(url ?? id, id !== undefined, caption, filename);
}

export function Image({
  url,
  id,
  children: caption,
}: Resource & { children?: string }) {
  return new M.Image(url ?? id, id !== undefined, caption);
}

export function Sticker({ url, id }: Resource) {
  return new M.Sticker(url ?? id, id !== undefined);
}

export function Video({
  url,
  id,
  children: caption,
}: Resource & { children?: string }) {
  return new M.Video(url ?? id, id !== undefined, caption);
}
