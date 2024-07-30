import type { FC } from "react";
import { useState } from "react";
import { Tabs, TabsProps } from "./Tabs";

type IUncontrolledTabsProps = Omit<TabsProps, "onChange" | "value"> & {
  initialTab?: string;
};

export const UncontrolledTabs: FC<IUncontrolledTabsProps> = ({
  tabs,
  initialTab,
}) => {
  const [value, setValue] = useState(initialTab || tabs?.[0]?.label || "");

  return <Tabs onChange={onChangeSelectedTab} tabs={tabs} value={value}></Tabs>;

  function onChangeSelectedTab(newValue: string) {
    setValue(newValue);
  }
};
