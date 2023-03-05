import { common } from "replugged";
import { userPremiumType } from "./misc";
import { PremiumType, Sticker, StickerType } from "./types";
import { files } from "./webpack";
import { renderPng } from "./renderer";

async function download(url: string): Promise<Blob> {
  const res = await fetch(url);
  return await res.blob();
}

function getUrl(sticker: Sticker): string {
  switch (sticker.format_type) {
    case StickerType.PNG:
      return `https://cdn.discordapp.com/stickers/${sticker.id}.png`;
    case StickerType.APNG:
      return `https://cdn.discordapp.com/stickers/${sticker.id}.png?passtrough=true`;
    case StickerType.LOTTIE:
      return `https://cdn.discordapp.com/stickers/${sticker.id}.json`;
  }
}

function isStickerAvailable(sticker: Sticker): boolean {
  // Emoji not available on Discord (e.g. GUILD_SUBSCRIPTION_UNAVAILABLE)
  if (!sticker.available) return false;

  // User has Nitro
  if (userPremiumType != PremiumType.NONE) return true;

  // Note: getGuildId will return null if user is in DMs
  if (sticker.guild_id == common.guilds.getGuildId()) return true;

  return false;
}

export async function spoofSticker(sticker: Sticker): Promise<boolean> {
  if (isStickerAvailable(sticker)) return false;

  const url = getUrl(sticker);

  const imageFile = await download(url);
  const arrayBuffer = await imageFile.arrayBuffer();

  let renderedImage: Blob;

  switch (sticker.format_type) {
    case StickerType.PNG:
      renderedImage = await renderPng(arrayBuffer);
      break;
    default: // TODO: implement Apng and Lottie
      return true;
  }

  files.addFile({
    channelId: common.channels.getChannelId()!,
    draftType: 0,
    showLargeMessageDialog: false,
    file: {
      platform: 1,
      file: new File([renderedImage], `${sticker.id}.png`, {
        type: "image/png",
      }),
    },
  });

  return true;
}
