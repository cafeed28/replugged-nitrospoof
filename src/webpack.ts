import { webpack } from "replugged";

import { EmojiInfoType, Message, SelectedGuildStoreType } from "./types";

export const SelectedGuildStore: SelectedGuildStoreType = webpack.getExportsForProps(
  webpack.getByProps("getLastSelectedGuildId")!,
  ["getLastSelectedGuildId"],
) as unknown as SelectedGuildStoreType;

export const EmojiInfo: EmojiInfoType = webpack.getExportsForProps(
  webpack.getByProps("getEmojiUnavailableReason")!,
  ["getEmojiUnavailableReason"],
) as unknown as EmojiInfoType;

export const MessageActions = await webpack.waitForModule<{
  sendMessage: (channelId: string, message: Message) => void;
}>(webpack.filters.byProps("_sendMessage"));
