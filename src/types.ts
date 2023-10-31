export interface Config {
  emojiSpoof?: boolean;
  emojiSize?: number;
  emojiHideLinks?: boolean;

  stickerSpoof?: boolean;
  stickerSize?: number;

  streamQualityEnable?: boolean;

  debugMode?: boolean;
}

export enum PremiumType {
  NONE = 0,
  CLASSIC,
  NITRO,
  BASIC,
}

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
  platform: number; // TODO: Find enum
}

export interface Attachment {
  file: AttachmentFile;
  channelId: string;
  showLargeMessageDialog: boolean;
  draftType: number; // TODO: Find enum
}
