import { ModuleExports } from "replugged/dist/types";

export interface Emoji {
  animated: boolean;
  available: boolean;

  name: string;
  originalName?: string; // when a name ends with ~num
  url: string;
  id: string;
  guildId: string;
}

export interface Message {
  content: string;
  invalidEmojis: Emoji[];
  validNonShortcutEmojis: Emoji[];
}

export type SelectedGuildStoreType = ModuleExports & {
  getGuildId: () => string;
};

export type EmojiInfoType = ModuleExports & {
  getEmojiUnavailableReason: (id: string) => string | undefined;
  isEmojiPremiumLocked: (...args: unknown[]) => boolean;
  isEmojiDisabled: (...args: unknown[]) => boolean;
};
