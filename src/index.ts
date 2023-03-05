import { Injector, common } from "replugged";

import { config, ready, userChanged, userInit } from "./misc";

import {
  addStickerPreview,
  emojiInfo,
  isSendableSticker,
  messageParser,
  premiumInfo,
  shouldAttachSticker,
  stickerInfo,
  stickerPreview,
  stickerSendability,
  users,
} from "./webpack";

import { spoofEmojis } from "./emoji";
import { spoofSticker } from "./sticker";

const injector = new Injector();

export async function start(): Promise<void> {
  // using premiumType from common.users.getCurrentUser will broke with plugins like No Nitro Upsell
  await userInit();

  users.addChangeListener(userChanged);

  injector.after(messageParser, "parse", (_, message) => {
    if (ready) spoofEmojis(message);
    return message;
  });

  // Chat emoji picker
  injector.instead(emojiInfo, "isEmojiFiltered", () => false);
  injector.instead(emojiInfo, "isEmojiDisabled", () => false);
  injector.instead(emojiInfo, "isEmojiPremiumLocked", () => false);

  // Emoji picker tint
  injector.instead(emojiInfo, "getEmojiUnavailableReason", () => null);

  // Stickers
  injector.instead(stickerInfo, shouldAttachSticker, () => true);
  injector.instead(stickerSendability, isSendableSticker, () => true);

  injector.instead(stickerPreview, addStickerPreview, async ([channelId, sticker, draftType]) => {
    if (ready) {
      const spoofed = await spoofSticker(sticker);
      if (!spoofed) {
        common.fluxDispatcher.dispatch({
          type: "ADD_STICKER_PREVIEW",
          channelId,
          sticker,
          draftType,
        });
      }
    }
  });

  // Stream quality
  injector.instead(premiumInfo, "canStreamHighQuality", (_, orig) => {
    if (!config.get("streamQualityEnable")) return orig(_);
    return true;
  });

  injector.instead(premiumInfo, "canStreamMidQuality", (_, orig) => {
    if (!config.get("streamQualityEnable")) return orig(_);
    return true;
  });
}

export function stop(): void {
  users.removeChangeListener(userChanged);
  injector.uninjectAll();
}

export { Settings } from "./Settings";
