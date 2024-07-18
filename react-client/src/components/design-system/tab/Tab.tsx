import * as RadixTab from "@radix-ui/react-tabs";
import { ReactNode } from "react";
import { Icon, IconProps } from "../icon/Icon";

type Tab = {
  content: ReactNode;
  icon?: IconProps["display"];
  label: string;
};

type TabProps = {
  tabs: Tab[];
};

export const Tab = ({ tabs }: TabProps) => {
  return (
    <>
      <RadixTab.Root defaultValue={tabs[0].label}>
        <RadixTab.List className="flex">
          {tabs.map(({ label, icon }) => (
            <RadixTab.Trigger
              aria-label={`Tab option: ${label}`}
              className={
                "flex w-full justify-center rounded-none border-0 border-b-[3px] border-b-neutral-300 bg-transparent p-small text-base font-bold text-neutral-500 outline-none hover:border-0 hover:border-b-[3px] hover:border-b-neutral-300 hover:bg-transparent hover:outline-none focus:bg-transparent focus:outline-none aria-selected:border-b-purple-500 aria-selected:text-purple-500"
              }
              key={label}
              value={label}
            >
              <div className="flex place-items-center gap-small">
                {!!icon && <Icon display={icon} size={16} />}
                <span>{label}</span>
              </div>
            </RadixTab.Trigger>
          ))}
        </RadixTab.List>
        {tabs.map(({ content, label }) => (
          <RadixTab.Content
            aria-label={`Tab content of: ${label}`}
            className="pt-large"
            key={label}
            value={label}
          >
            {content}
          </RadixTab.Content>
        ))}
      </RadixTab.Root>
    </>
  );
};
