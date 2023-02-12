/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { types, webpack } from "replugged";
const { getByProps, getBySource, getExportsForProps, waitForModule } = webpack;

import { OutgoingMessage, UserFetchResponse } from "./types";

type EmojiInfo = {
  isEmojiFiltered: () => boolean;
  isEmojiDisabled: () => boolean;
  isEmojiPremiumLocked: () => boolean;
  getEmojiUnavailableReason: () => null;
};
export const emojiInfo: EmojiInfo = getByProps("getEmojiUnavailableReason")!;

type PremiumInfo = {
  canStreamHighQuality: () => boolean;
  canStreamMidQuality: () => boolean;
};
export const premiumInfo: PremiumInfo = getByProps("canStreamHighQuality")!;

type MessageParser = {
  parse: (message: unknown, content: string) => OutgoingMessage;
  parsePreprocessor: types.AnyFunction;
};

export const messageParser: MessageParser = getByProps("parse", "parsePreprocessor")!;

type UserFetchFunction = (id: string) => Promise<UserFetchResponse>;

const userProfileRaw = getBySource('"USER_PROFILE_FETCH_START"')!;

// 99% safe
const userProfileFnName = Object.entries(userProfileRaw).find(([_, v]) =>
  v.toString().includes(".apply("),
)?.[0];

if (!userProfileFnName) {
  throw new Error("Could not find user profile fetch function");
}

export const userProfileFetch = getExportsForProps(userProfileRaw, [userProfileFnName])![
  userProfileFnName
] as UserFetchFunction;

export const users = await waitForModule<{
  addChangeListener: (listener: () => void) => void;
}>(webpack.filters.byProps("addChangeListener", "getCurrentUser"));
