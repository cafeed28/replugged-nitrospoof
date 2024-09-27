import { webpack } from "replugged";
const { filters, getFunctionKeyBySource, waitForModule, waitForProps } = webpack;

import type { AnyFunction } from "replugged/dist/types";
import type { Attachment, OutgoingMessage } from "./types";

interface EmojiInfo {
  isEmojiFiltered: (...args: unknown[]) => boolean;
  isEmojiDisabled: (...args: unknown[]) => boolean;
  isEmojiPremiumLocked: (...args: unknown[]) => boolean;
  getEmojiUnavailableReason: (...args: unknown[]) => null;
}
export const emojiInfo = await waitForProps<EmojiInfo>("getEmojiUnavailableReason");

interface PremiumInfo {
  canStreamQuality: (...args: unknown[]) => boolean;
}
export const premiumInfo = await waitForProps<PremiumInfo>("canStreamQuality");

interface MessageParser {
  parse: (message: unknown, content: string) => OutgoingMessage;
  parsePreprocessor: AnyFunction;
}
export const messageParser = await waitForProps<MessageParser>("parse", "parsePreprocessor");

interface Users {
  addChangeListener: (listener: () => void) => void;
  removeChangeListener: (listener: () => void) => void;
  getCurrentUser: unknown;
}
export const users = await waitForProps<Users>("addChangeListener", "getCurrentUser");

interface AttachmentUploader {
  addFile: (attachment: Attachment) => void;
}
export const files = await waitForModule<AttachmentUploader>(
  filters.bySource('"UPLOAD_ATTACHMENT_ADD_FILES"'),
);

type AnyModule = Record<string, AnyFunction>;

export const stickerInfo = await waitForModule<AnyModule>(
  filters.bySource(".ANIMATE_ON_INTERACTION?"),
);
export const shouldAttachSticker = getFunctionKeyBySource(stickerInfo, ".getStickerPreview(");

export const stickerSendability = await waitForModule<AnyModule>(filters.bySource(".SENDABLE=0"));
export const isSendableSticker = getFunctionKeyBySource(stickerSendability, "0===");

export const stickerPreview = await waitForModule<AnyModule>(
  filters.bySource('"ADD_STICKER_PREVIEW"'),
);
export const addStickerPreview = getFunctionKeyBySource(stickerPreview, '"ADD_STICKER_PREVIEW"');
