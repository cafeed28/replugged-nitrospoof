/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { types, webpack } from "replugged";
const { filters, getFunctionBySource, waitForModule, waitForProps } = webpack;

import type { ObjectExports } from "replugged/dist/types";
import type { OutgoingMessage, UserFetchResponse } from "./types";

type EmojiInfo = {
  isEmojiFiltered: () => boolean;
  isEmojiDisabled: () => boolean;
  isEmojiPremiumLocked: () => boolean;
  getEmojiUnavailableReason: () => null;
};
export const emojiInfo = await waitForProps<string, EmojiInfo>("getEmojiUnavailableReason");

type PremiumInfo = {
  canStreamHighQuality: () => boolean;
  canStreamMidQuality: () => boolean;
};
export const premiumInfo = await waitForProps<string, PremiumInfo>("canStreamHighQuality");

type MessageParser = {
  parse: (message: unknown, content: string) => OutgoingMessage;
  parsePreprocessor: types.AnyFunction;
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
