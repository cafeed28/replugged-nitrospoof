// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Config = {
  emojiSize?: number;
  emojiHideLinks?: boolean;

  stickerSize?: number;

  streamQualityEnable?: boolean;
};

export enum PremiumType {
  NONE = 0,
  TIER_1,
  TIER_2,
  TIER_3,
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

  emojiObject?: {
    names: string[];
    surrogates: string;
    uniqueName: string;
  };
}

export enum StickerType {
  PNG = 1,
  APNG,
  LOTTIE,
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface Sticker {
  name: string;
  description: string;
  id: string;
  guild_id: string;
  available: boolean;
  format_type: StickerType;
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface OutgoingMessage {
  content: string;
  validNonShortcutEmojis: Emoji[];
}

interface AttachmentFile {
  file: File;
  platform: number; // TODD: Find enum
}

export interface Attachment {
  file: AttachmentFile;
  channelId: string;
  showLargeMessageDialog: boolean;
  draftType: number; // TODD: Find enum
}
