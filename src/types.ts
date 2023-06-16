// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Config = {
  emojiSize?: number;
  emojiHideLinks?: boolean;

  stickerSize?: number;

  streamQualityEnable?: boolean;

  debugMode?: boolean;
};

export enum PremiumType {
  NONE = 0,
  CLASSIC,
  NITRO,
  BASIC,
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
  STANDARD = 1,
  GUILD,
}

export enum StickerFormat {
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
  type: StickerType;
  format_type: StickerFormat;
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
