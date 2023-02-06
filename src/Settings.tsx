import { common, components, util } from "replugged";
import { config } from "./misc";
import { EmojiStaticExtension } from "./types";

const { React } = common;
const { Category, Flex, FormItem, Radio, Slider, Switch, Text } = components;

export function Settings() {
  const emojiHideLinks = util.useSetting(config, "emojiHideLinks");
  const emojiStaticExtension = util.useSetting(config, "emojiStaticExtension");

  // TODO: i18n
  return (
    <div>
      <Category title="Emoji" note="Emoji spoofer settings">
        <div style={{ marginBottom: 8 }}>
          <div style={{ marginBottom: 20 }}>
            <Flex>
              <Text variant="text-sm/semibold" style={{ flexGrow: 1 }}>
                Hide emoji links using Discord spoiler bug (199 trailing spoilers)
              </Text>
              <Switch checked={emojiHideLinks.value!} onChange={emojiHideLinks.onChange} />
            </Flex>
          </div>

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Flex direction={Flex.Direction.VERTICAL}>
              <Text.Eyebrow color="header-secondary" style={{ marginBottom: 8 }}>
                Emoji size
              </Text.Eyebrow>
              <Flex align={Flex.Align.CENTER} style={{ marginTop: 20, marginBottom: 8 }}>
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
              </Flex>
            </Flex>
          </div>

          <div style={{ marginTop: 20 }}>
            <Flex direction={Flex.Direction.VERTICAL}>
              <FormItem>
                <Text.Eyebrow style={{ marginBottom: 8 }}>Static emoji format</Text.Eyebrow>
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
                  size={Radio.Sizes.MEDIUM}
                />
              </FormItem>
            </Flex>
          </div>
        </div>
      </Category>
    </div>
  );
}
