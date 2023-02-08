export type EmojiStaticExtension = "png" | "webp";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Config = {
  emojiSize?: number;
  emojiStaticExtension?: EmojiStaticExtension;
  emojiHideLinks?: boolean;
  streamQualityEnable?: boolean;
};

export enum PremiumType {
  None = 0,
  Tier1,
  Tier2,
  Tier3,
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface UserFetchResponse {
  premium_type: PremiumType | null;
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface Emoji {
  animated: boolean;
  available: boolean;

  name: string;
  originalName?: string; // when a name ends with ~num
  url: string;
  id: string;
  guildId: string;
}

export interface OutgoingMessage {
  content: string;
  validNonShortcutEmojis: Emoji[];
}
