import { common, settings } from "replugged";
import { userProfileFetch } from "./webpack";

import { User } from "discord-types/general";
import { Config, PremiumType, UserFetchResponse } from "./types";

export const config = await settings.init<Config>("com.cafeed28.NitroSpoof", {
  emojiSize: 48,
  emojiHideLinks: false,

  stickerSize: 160,

  streamQualityEnable: false,
});

export const HIDE_TEXT_SPOILERS = "||\u200b||".repeat(199);

export let userPremiumType: PremiumType;

let user: User;
let userProfile: UserFetchResponse;
export let ready = false;

export async function userInit(): Promise<void> {
  user = common.users.getCurrentUser();
  if (user) userProfile = await userProfileFetch(user.id);
  if (userProfile) userPremiumType = userProfile.premium_type ?? PremiumType.NONE;

  ready = Boolean(user && userProfile);
}

export async function userChanged(): Promise<void> {
  const newUser = common.users.getCurrentUser();
  if (!newUser) return;
  if (user && newUser.id == user.id) return;

  await userInit();
}
