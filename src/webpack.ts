/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { webpack } from "replugged";
const { filters, waitForModule, waitForProps } = webpack;

import type { AnyFunction, ObjectExports } from "replugged/dist/types";
import type { Attachment, OutgoingMessage } from "./types";

type EmojiInfo = {
  isEmojiFiltered: (...args: unknown[]) => boolean;
  isEmojiDisabled: (...args: unknown[]) => boolean;
  isEmojiPremiumLocked: (...args: unknown[]) => boolean;
  getEmojiUnavailableReason: (...args: unknown[]) => null;
};
export const emojiInfo = await waitForProps<EmojiInfo>("getEmojiUnavailableReason");

type PremiumInfo = {
  canStreamQuality: (...args: unknown[]) => boolean;
};
export const premiumInfo = await waitForProps<PremiumInfo>("canStreamQuality");

type MessageParser = {
  parse: (message: unknown, content: string) => OutgoingMessage;
  parsePreprocessor: AnyFunction;
};

export const messageParser = await waitForProps<MessageParser>("parse", "parsePreprocessor");

type Users = {
  addChangeListener: (listener: () => void) => void;
  removeChangeListener: (listener: () => void) => void;
  getCurrentUser: unknown;
};

export const users = await waitForProps<Users>("addChangeListener", "getCurrentUser");

type AttachmentUploader = {
  addFile: (attachment: Attachment) => void;
};

export const files = await waitForModule<AttachmentUploader>(
  filters.bySource('"UPLOAD_ATTACHMENT_ADD_FILES"'),
);

type AnyModule = {
  [key: string]: AnyFunction;
};

export const stickerInfo = await waitForModule<AnyModule>(
  filters.bySource(".ANIMATE_ON_INTERACTION?"),
);
export const shouldAttachSticker: string = webpack.getFunctionKeyBySource(
  stickerInfo,
  ".EXPRESSION_SUGGESTIONS:",
)!;

export const stickerSendability = await waitForModule<AnyModule>(filters.bySource(".SENDABLE=0"));
export const isSendableSticker: string = webpack.getFunctionKeyBySource(
  stickerSendability as ObjectExports,
  ".SENDABLE}",
)!;

export const stickerPreview = await waitForModule<AnyModule>(
  filters.bySource('"ADD_STICKER_PREVIEW"'),
);
export const addStickerPreview: string = webpack.getFunctionKeyBySource(
  stickerPreview as ObjectExports,
  '"ADD_STICKER_PREVIEW"',
)!;
