import { settings } from "replugged";
import { Config } from "./types";

export const config = await settings.init<Config>("com.cafeed28.NitroSpoof", {
  emojiSize: 48,
  emojiStaticExtension: "png",
  emojiHideLinks: false,
  streamQualityEnable: false,
});

export const HIDE_TEXT_SPOILERS = "||\u200b||".repeat(199);
