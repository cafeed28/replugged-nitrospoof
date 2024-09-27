import { webpack } from "replugged";
const { filters, waitForModule, waitForProps } = webpack;

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

interface StickerInfo {
  Hc: AnyFunction; // shouldAttachSticker
}
export const stickerInfo = await waitForModule<StickerInfo>(
  filters.bySource(".ANIMATE_ON_INTERACTION?"),
);

interface StickerSendability {
  kl: AnyFunction; // isSendableSticker
}
export const stickerSendability = await waitForModule<StickerSendability>(
  filters.bySource(".SENDABLE=0"),
);

interface StickerPreview {
  eu: AnyFunction; // addStickerPreview
}
export const stickerPreview = await waitForModule<StickerPreview>(
  filters.bySource('"ADD_STICKER_PREVIEW"'),
);
