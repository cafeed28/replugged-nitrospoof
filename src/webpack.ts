/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { webpack } from "replugged";
const { filters, getFunctionBySource, waitForModule, waitForProps } = webpack;

import type { AnyFunction, ObjectExports } from "replugged/dist/types";
import type { Attachment, OutgoingMessage, UserFetchResponse } from "./types";

type EmojiInfo = {
  isEmojiFiltered: () => boolean;
  isEmojiDisabled: () => boolean;
  isEmojiPremiumLocked: () => boolean;
  getEmojiUnavailableReason: () => null;
};
export const emojiInfo = await waitForProps<string, EmojiInfo>("getEmojiUnavailableReason");

type PremiumInfo = {
  canStreamHighQuality: (...args: unknown[]) => boolean;
  canStreamMidQuality: (...args: unknown[]) => boolean;
};
export const premiumInfo = await waitForProps<string, PremiumInfo>("canStreamHighQuality");

type MessageParser = {
  parse: (message: unknown, content: string) => OutgoingMessage;
  parsePreprocessor: AnyFunction;
};

export const messageParser = await waitForProps<string, MessageParser>(
  "parse",
  "parsePreprocessor",
);

type Users = {
  addChangeListener: (listener: () => void) => void;
  removeChangeListener: (listener: () => void) => void;
};

export const users = await waitForProps<string, Users>("addChangeListener", "getCurrentUser");

type AttachmentUploader = {
  addFile: (attachment: Attachment) => void;
};

export const files = await waitForModule<AttachmentUploader>(
  filters.bySource('"UPLOAD_ATTACHMENT_ADD_FILES"'),
);

type UserFetchFunction = (id: string) => Promise<UserFetchResponse>;

const userProfileModule = await waitForModule<ObjectExports>(
  filters.bySource('"USER_PROFILE_FETCH_START"'),
);

// 99% safe
export const userProfileFetch = getFunctionBySource<UserFetchFunction>(
  userProfileModule,
  ".apply(",
)!;

if (!userProfileFetch) {
  throw new Error("Could not find user profile fetch function");
}

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
