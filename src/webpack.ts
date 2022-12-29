import { webpack } from "replugged";

import {
  CloudUploaderType,
  EmojiInfoType,
  MessageParserType,
  SelectedGuildStoreType,
} from "./types";

export const SelectedGuildStore: SelectedGuildStoreType = webpack.getExportsForProps(
  webpack.getByProps("getLastSelectedGuildId")!,
  ["getLastSelectedGuildId"],
) as unknown as SelectedGuildStoreType;

export const EmojiInfo: EmojiInfoType = webpack.getExportsForProps(
  webpack.getByProps("getEmojiUnavailableReason")!,
  ["getEmojiUnavailableReason"],
) as unknown as EmojiInfoType;

export const MessageParser = webpack.getByProps("parse", "parsePreprocessor") as MessageParserType;

export const CloudUploader = await webpack.waitForModule<CloudUploaderType>(
  webpack.filters.byProps("uploadFiles"),
);
