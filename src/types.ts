import { OutgoingMessage } from "replugged/dist/renderer/modules/webpack/common/messages";
import { ModuleExports } from "replugged/dist/types";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Config = {
  emojiSize: number;
};

export interface Emoji {
  animated: boolean;
  available: boolean;

  name: string;
  originalName?: string; // when a name ends with ~num
  url: string;
  id: string;
  guildId: string;
}

export type SelectedGuildStoreType = ModuleExports & {
  getGuildId: () => string;
};

export type EmojiInfoType = ModuleExports & {
  getEmojiUnavailableReason: (id: string) => string | undefined;
  isEmojiPremiumLocked: (...args: unknown[]) => boolean;
  isEmojiDisabled: (...args: unknown[]) => boolean;
};

export type CloudUploaderType = ModuleExports & {
  uploadFiles: (args: { parsedMessage: OutgoingMessage }) => void;
};
