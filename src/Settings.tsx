import { components, util } from "replugged";
import { config } from "./misc";
import { EmojiStaticExtension } from "./types";

const { Category, FormItem, Radio, Slider, SwitchItem } = components;

export function Settings() {
  const emojiStaticExtension = util.useSetting(config, "emojiStaticExtension");

  // TODO: i18n
  return (
    <div>
      <Category title="Emoji" note="Emoji spoofer settings">
        <SwitchItem {...util.useSetting(config, "emojiHideLinks", false)} hideBorder>
          Hide emoji links using Discord spoiler bug (199 trailing spoilers)
        </SwitchItem>

        <FormItem title="Emoji Size" style={{ marginBottom: 20 }}>
          <div style={{ marginTop: 20 }}>
            <Slider
              {...util.useSetting(config, "emojiSize", 48)}
              markers={[16, 24, 32, 40, 48, 56, 64, 80, 96]}
              stickToMarkers={true}
              defaultValue={48}
              minValue={16}
              maxValue={96}
              onMarkerRender={(e: number) => {
                return `${e}px`;
              }}
            />
          </div>
        </FormItem>

        <FormItem title="Static Emoji Format" style={{ marginBottom: 20 }}>
          <Radio
            options={[
              {
                name: "PNG: Better quality",
                value: "png",
              },
              {
                name: "WebP: Smaller size",
                value: "webp",
              },
            ]}
            value={emojiStaticExtension.value!}
            onChange={(e) => emojiStaticExtension.onChange(e.value as EmojiStaticExtension)}
          />
        </FormItem>
      </Category>

      <Category title="Miscellaneous" note="Miscellaneous settings">
        <SwitchItem {...util.useSetting(config, "streamQualityEnable")} hideBorder>
          Spoof stream quality (Use at your own risk! May lead to account ban)
        </SwitchItem>
      </Category>
    </div>
  );
}
