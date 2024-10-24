import * as RadixTab from "@radix-ui/react-tabs";
import { ComponentProps, ReactNode } from "react";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { Icon, IconProps } from "../icon/Icon";
import { Text } from "../text/Text";

export type Tab = {
  content: () => ReactNode;
  icon?: IconProps["display"];
  label: string;
};

type RadixTabProps = ComponentProps<typeof RadixTab.Root>;

export type TabsProps = Pick<RadixTabProps, "value"> & {
  "aria-label"?: string;
  onChange: RadixTabProps["onValueChange"];
  tabs: Tab[];
};

export const Tabs = ({ onChange, tabs, ...rest }: TabsProps) => {
  const shouldDisplayLabel = useWindowWidth() > 768;
  return (
    <>
      <RadixTab.Root {...rest} onValueChange={onChange}>
        <RadixTab.List className="hide-scrollbar flex overflow-x-scroll">
          {tabs.map(({ label, icon }) => (
            <RadixTab.Trigger
              aria-label={`Tab option: ${label}`}
              className={
                "text-base flex w-full justify-center overflow-visible text-nowrap rounded-none border-0 border-b-[3px] border-b-neutral-300 bg-transparent px-base py-small font-bold text-neutral-500 outline-none hover:border-0 hover:border-b-[3px] hover:border-b-neutral-300 hover:bg-transparent hover:outline-none focus:bg-transparent focus:outline-none aria-selected:border-b-purple-500 aria-selected:text-purple-500"
              }
              key={label}
              value={label}
            >
              <div className="flex place-items-center gap-small">
                {!!icon && <Icon display={icon} size={16} />}
                {shouldDisplayLabel && (
                  <Text color={"inherit"} size="16">
                    {label}
                  </Text>
                )}
              </div>
            </RadixTab.Trigger>
          ))}
        </RadixTab.List>
        {tabs.map(({ content, label }) => {
          const isSelected = rest.value === label;
          return (
            <RadixTab.Content
              aria-label={`Tab content of: ${label}`}
              key={label}
              value={label}
            >
              {isSelected && content()}
            </RadixTab.Content>
          );
        })}
      </RadixTab.Root>
    </>
  );
};
