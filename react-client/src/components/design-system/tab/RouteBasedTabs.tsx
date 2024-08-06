import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Tab, TabsProps } from "./Tabs";
import { Tabs } from "./Tabs";

export type RouteTab = Tab & {
  exactRoute?: boolean;
  route: string;
};

type RouteBasedTabsProps = Omit<TabsProps, "onChange" | "tabs" | "value"> & {
  tabs: RouteTab[];
};

export const RouteBasedTabs: FC<RouteBasedTabsProps> = ({ tabs }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (tabs.length < 1) {
    return null;
  }

  const selectedTab =
    tabs.find(({ exactRoute, route }) =>
      exactRoute ? route === pathname : pathname.includes(route)
    )?.label || tabs[0].label;

  return (
    <Tabs onChange={onChangeSelectedTab} tabs={tabs} value={selectedTab} />
  );

  function onChangeSelectedTab(newSelectedTab: string) {
    const tab = tabs.find(({ label }) => label === newSelectedTab);
    if (tab) navigate(tab.route);
  }
};
