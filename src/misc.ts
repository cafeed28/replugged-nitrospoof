import { Logger, common, settings } from "replugged";

import { User } from "discord-types/general";
import { Config, PremiumType } from "./types";

export const config = await settings.init<Config>("com.cafeed28.NitroSpoof", {
  emojiSpoof: true,
  emojiSize: 48,
  emojiHideLinks: false,

  stickerSpoof: true,
  stickerSize: 160,

  streamQualityEnable: false,

  debugMode: false,
});

export const logger = Logger.plugin("NitroSpoof");

export const HIDE_TEXT_SPOILERS = "||\u200b||".repeat(199);

export let userPremiumType: PremiumType;

let user: User;

export function userInit(): void {
  user = common.users.getCurrentUser();
  if (!user) return;

  // @ts-expect-error https://github.com/asportnoy/no-nitro-upsell#for-plugin-developers
  userPremiumType = user._realPremiumType ?? user.premiumType ?? PremiumType.NONE;
}

export function userChanged(): void {
  const newUser = common.users.getCurrentUser();
  if (!newUser) return;
  if (user && newUser.id == user.id) return;

  userInit();
}
